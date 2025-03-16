// server/src/modules/forum/controllers/forumCategoryController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import sequelize from '../../../infrastructure/database/db';
import ForumCategory from '../models/ForumCategory';
import { AuthRequest } from '../../auth/controllers/verify.controller';
import { forumCategoryValidations } from '../validators/category.validator';

export class ForumCategoryController {
  static forumCategoryValidations = forumCategoryValidations;
  
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await ForumCategory.findAll({
        order: [['name', 'ASC']]
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

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(Number(id))) {
        res.status(400).json({ success: false, message: 'ID de categoría inválido' });
        return;
      }
      
      const category = await ForumCategory.findByPk(Number(id));
      
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

  static async createCategory(req: AuthRequest, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();  
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, description, icon, banner } = req.body;
      
      const newCategory = await ForumCategory.create({
        name,
        description,
        icon,
        banner,
        memberCount: 0,
      }, { transaction });
      
      await transaction.commit();
      res.status(201).json({ success: true, data: newCategory });
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

  static async updateCategory(req: AuthRequest, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await ForumCategory.findByPk(Number(id));
      if (!category) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      await category.update({
        name: name || category.name,
        description: description || category.description
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

  static async deleteCategory(req: AuthRequest, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      
      const category = await ForumCategory.findByPk(Number(id));
      if (!category) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
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
}