// server/src/modules/forum/controllers/ForumCategoryController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import sequelize from '../../../infrastructure/database/db';
import ForumCategory from '../models/ForumCategory';
import ForumThread from '../models/ForumThread';
import { AuthRequest } from '../../auth/controllers/verify.controller';
import { categoryValidations } from '../validators/category.validator';

export class ForumCategoryController {


    static categoryValidations = categoryValidations;
  /**
   * @description Obtiene todas las categorías ordenadas por displayOrder
   */
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await ForumCategory.findAll({
        order: [['displayOrder', 'ASC']]
      });

      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener categorías',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @description Obtiene una categoría específica con sus hilos
   */
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(Number(id))) {
        res.status(400).json({ success: false, message: 'ID de categoría inválido' });
        return;
      }
      
      const category = await ForumCategory.findByPk(Number(id), {
        include: [
          {
            model: ForumThread,
            as: 'threads',
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!category) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      res.status(200).json({ success: true, data: category });
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener categoría',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @description Crea una nueva categoría
   */
  static async createCategory(req: AuthRequest, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, description, icon } = req.body;
      
      // Validaciones básicas
      if (!name || name.trim() === '') {
        res.status(400).json({ 
          success: false, 
          message: 'El nombre es obligatorio' 
        });
        return;
      }
      
      if (!description || description.trim() === '') {
        res.status(400).json({ 
          success: false, 
          message: 'La descripción es obligatoria' 
        });
        return;
      }

      // Obtener el siguiente orden de visualización
      const nextDisplayOrder = await ForumCategoryController.getNextDisplayOrder();

      // Crear la categoría
      const category = await ForumCategory.create({
        name,
        description,
        icon,
        displayOrder: nextDisplayOrder
      }, { transaction });

      await transaction.commit();
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al crear categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear categoría',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @description Actualiza una categoría existente
   */
  static async updateCategory(req: AuthRequest, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { name, description, icon } = req.body;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ success: false, message: 'ID de categoría inválido' });
        return;
      }


      const category = await ForumCategory.findByPk(Number(id));
      if (!category) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      await category.update({
        name: name !== undefined ? name : category.name,
        description: description !== undefined ? description : category.description,
        icon: icon !== undefined ? icon : category.icon
      }, { transaction });

      await transaction.commit();
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al actualizar categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar categoría',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @description Elimina una categoría (solo si no tiene hilos)
   */
  static async deleteCategory(req: AuthRequest, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      
      if (!id || isNaN(Number(id))) {
        res.status(400).json({ success: false, message: 'ID de categoría inválido' });
        return;
      }

      
      const category = await ForumCategory.findByPk(Number(id), {
        include: [
          { model: ForumThread, as: 'threads' }
        ]
      });

      if (!category) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }
      // Verificar si tiene hilos
      if ((category as any).threads?.length > 0) {
        res.status(400).json({
          success: false,
          message: 'No se puede eliminar una categoría con hilos asociados'
        });
        return;
      }

      await category.destroy({ transaction });
      await transaction.commit();
      
      res.status(200).json({ 
        success: true, 
        message: 'Categoría eliminada exitosamente' 
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al eliminar categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar categoría',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @description Reordena las categorías
   */
  static async reorderCategories(req: AuthRequest, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const { order } = req.body;
      
      
      if (!Array.isArray(order)) {
        res.status(400).json({ success: false, message: 'Formato de orden inválido' });
        return;
      }

      await Promise.all(order.map(async (categoryOrder: { id: number; displayOrder: number }) => {
        if (!categoryOrder.id || isNaN(Number(categoryOrder.id)) || 
            categoryOrder.displayOrder === undefined || isNaN(Number(categoryOrder.displayOrder))) {
          throw new Error('Formato de orden inválido para algunas categorías');
        }
        
        await ForumCategory.update(
          { displayOrder: Number(categoryOrder.displayOrder) },
          { where: { id: Number(categoryOrder.id) }, transaction }
        );
      }));

      await transaction.commit();
      res.status(200).json({ success: true, message: 'Orden actualizado exitosamente' });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al reordenar categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al reordenar categorías',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @description Método auxiliar para obtener el siguiente valor de displayOrder
   */
  private static async getNextDisplayOrder(): Promise<number> {
    const result = await ForumCategory.findOne({
      attributes: [
        [sequelize.fn('MAX', sequelize.col('displayOrder')), 'maxOrder']
      ],
      raw: true
    });

    // @ts-ignore - sequelize.fn result typing issue
    const maxOrder = result?.maxOrder;
    return (maxOrder ? Number(maxOrder) : 0) + 1;
  }
}