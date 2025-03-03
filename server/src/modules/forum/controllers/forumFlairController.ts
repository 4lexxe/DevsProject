import { Request, Response } from 'express';
import ForumFlair, { FlairType } from '../models/ForumFlair';
import User from '../../user/User';
import sequelize from '../../../infrastructure/database/db';

/**
 * @function getAllFlairs
 * @description Obtiene todos los distintivos disponibles
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getAllFlairs = async (req: Request, res: Response): Promise<void> => {
  try {
    const flairs = await ForumFlair.findAll({
      where: { isActive: true }
    });
    
    res.status(200).json({ success: true, data: flairs });
  } catch (error) {
    console.error('Error al obtener todos los flairs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los distintivos',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function getFlairById
 * @description Obtiene un distintivo por su ID
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getFlairById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const flair = await ForumFlair.findByPk(id);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    res.status(200).json({ success: true, data: flair });
  } catch (error) {
    console.error('Error al obtener el flair por ID:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el distintivo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function createFlair
 * @description Crea un nuevo distintivo
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const createFlair = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      name, 
      description, 
      icon, 
      color, 
      type = FlairType.CUSTOM, 
      isActive = true,
      createdBy 
    } = req.body;
    
    // Validaciones básicas
    if (!name || !description) {
      res.status(400).json({ 
        success: false, 
        message: 'El nombre y la descripción son obligatorios' 
      });
      return;
    }
    
    // Crear el distintivo
    const flair = await ForumFlair.create({
      name,
      description,
      icon,
      color,
      type,
      isActive,
      createdBy
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json({ 
      success: true, 
      message: 'Distintivo creado exitosamente', 
      data: flair 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear el flair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el distintivo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function updateFlair
 * @description Actualiza un distintivo existente
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const updateFlair = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      icon, 
      color, 
      type, 
      isActive
    } = req.body;
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(id);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // Actualizar el distintivo
    await flair.update({
      name: name || flair.name,
      description: description || flair.description,
      icon: icon || flair.icon,
      color: color || flair.color,
      type: type || flair.type,
      isActive: typeof isActive === 'boolean' ? isActive : flair.isActive
    }, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({ 
      success: true, 
      message: 'Distintivo actualizado exitosamente', 
      data: flair 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar el flair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el distintivo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function deleteFlair
 * @description Elimina un distintivo (desactivándolo)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const deleteFlair = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(id);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // En lugar de eliminar, desactivamos el distintivo
    await flair.update({ isActive: false }, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({ 
      success: true, 
      message: 'Distintivo desactivado exitosamente' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar el flair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el distintivo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function assignFlairToUser
 * @description Asigna un distintivo a un usuario
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const assignFlairToUser = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { flairId, userId } = req.params;
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(flairId);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // Buscar el usuario
    const user = await User.findByPk(userId);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    
    // Usar el método add generado por Sequelize para la asociación belongsToMany
    // @ts-ignore - Sequelize tiene problemas con el tipado aquí
    await flair.addUser(user, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({ 
      success: true, 
      message: 'Distintivo asignado exitosamente al usuario' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al asignar el flair al usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al asignar el distintivo al usuario',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function removeFlairFromUser
 * @description Elimina un distintivo de un usuario
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const removeFlairFromUser = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { flairId, userId } = req.params;
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(flairId);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // Buscar el usuario
    const user = await User.findByPk(userId);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    
    // Usar el método remove generado por Sequelize para la asociación belongsToMany
    // @ts-ignore - Sequelize tiene problemas con el tipado aquí
    await flair.removeUser(user, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({ 
      success: true, 
      message: 'Distintivo eliminado exitosamente del usuario' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar el flair del usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el distintivo del usuario',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function getFlairsByType
 * @description Obtiene todos los distintivos por tipo
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getFlairsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    
    // Validar que el tipo sea válido
    if (!Object.values(FlairType).includes(type as FlairType)) {
      res.status(400).json({ 
        success: false, 
        message: 'Tipo de distintivo no válido' 
      });
      return;
    }
    
    const flairs = await ForumFlair.findAll({
      where: { 
        type: type as FlairType,
        isActive: true 
      }
    });
    
    res.status(200).json({ success: true, data: flairs });
  } catch (error) {
    console.error('Error al obtener flairs por tipo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los distintivos por tipo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function getUserFlairs
 * @description Obtiene todos los distintivos de un usuario
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getUserFlairs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Buscar el usuario
    const user = await User.findByPk(userId, {
      include: [
        {
          model: ForumFlair,
          as: 'flairs',
          where: { isActive: true },
          required: false
        }
      ]
    });
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    
    // @ts-ignore - Sequelize tiene problema con tipado aquí
    res.status(200).json({ success: true, data: user.flairs || [] });
  } catch (error) {
    console.error('Error al obtener los flairs del usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los distintivos del usuario',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 