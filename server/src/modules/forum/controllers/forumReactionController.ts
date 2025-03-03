import { Request, Response } from 'express';
import ForumReaction, { ReactionTargetType } from '../models/ForumReaction';
import ForumPost from '../models/ForumPost';
import ForumReply from '../models/ForumReply';
import User from '../../user/User';
import sequelize from '../../../infrastructure/database/db';

/**
 * @function getReactionsByTarget
 * @description Obtiene todas las reacciones para un objetivo específico (post o reply)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getReactionsByTarget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetId, targetType } = req.params;
    
    // Validar el tipo de objetivo
    if (!Object.values(ReactionTargetType).includes(targetType as ReactionTargetType)) {
      res.status(400).json({ 
        success: false, 
        message: 'Tipo de objetivo no válido. Debe ser "post" o "reply"' 
      });
      return;
    }
    
    // Verificar si el objetivo existe
    let targetExists = false;
    if (targetType === ReactionTargetType.POST) {
      targetExists = !!(await ForumPost.findByPk(Number(targetId)));
    } else {
      targetExists = !!(await ForumReply.findByPk(Number(targetId)));
    }
    
    if (!targetExists) {
      res.status(404).json({ 
        success: false, 
        message: `El ${targetType === ReactionTargetType.POST ? 'post' : 'reply'} no existe` 
      });
      return;
    }
    
    // Obtener las reacciones
    const reactions = await ForumReaction.findAll({
      where: { 
        targetId: Number(targetId), 
        targetType 
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ]
    });
    
    // Agrupar reacciones por emoji
    const groupedReactions = reactions.reduce((acc: any, reaction) => {
      const emojiId = reaction.emojiId;
      if (!acc[emojiId]) {
        acc[emojiId] = {
          emojiId: reaction.emojiId,
          emojiName: reaction.emojiName,
          isCustom: reaction.isCustom,
          count: 0,
          users: []
        };
      }
      
      acc[emojiId].count++;
      acc[emojiId].users.push(reaction.get('user'));
      
      return acc;
    }, {});
    
    res.status(200).json({ 
      success: true, 
      data: Object.values(groupedReactions) 
    });
  } catch (error) {
    console.error('Error al obtener las reacciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las reacciones',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function addReaction
 * @description Agrega una reacción a un objetivo (post o reply)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const addReaction = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { targetId, targetType } = req.params;
    const { userId, emojiId, emojiName, isCustom = false } = req.body;
    
    // Validaciones básicas
    if (!userId || !emojiId || !emojiName) {
      res.status(400).json({ 
        success: false, 
        message: 'userId, emojiId y emojiName son obligatorios' 
      });
      return;
    }
    
    // Validar el tipo de objetivo
    if (!Object.values(ReactionTargetType).includes(targetType as ReactionTargetType)) {
      res.status(400).json({ 
        success: false, 
        message: 'Tipo de objetivo no válido. Debe ser "post" o "reply"' 
      });
      return;
    }
    
    // Verificar si el objetivo existe
    let targetExists = false;
    if (targetType === ReactionTargetType.POST) {
      targetExists = !!(await ForumPost.findByPk(Number(targetId)));
    } else {
      targetExists = !!(await ForumReply.findByPk(Number(targetId)));
    }
    
    if (!targetExists) {
      res.status(404).json({ 
        success: false, 
        message: `El ${targetType === ReactionTargetType.POST ? 'post' : 'reply'} no existe` 
      });
      return;
    }
    
    // Verificar si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    
    // Verificar si ya existe la misma reacción del usuario
    const existingReaction = await ForumReaction.findOne({
      where: {
        userId,
        targetId: Number(targetId),
        targetType,
        emojiId
      },
      transaction
    });
    
    if (existingReaction) {
      await transaction.rollback();
      res.status(409).json({ 
        success: false, 
        message: 'Ya existe esta reacción del usuario' 
      });
      return;
    }
    
    // Crear la reacción
    const reaction = await ForumReaction.create({
      userId,
      targetId: Number(targetId),
      targetType: targetType as ReactionTargetType,
      emojiId,
      emojiName,
      isCustom
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json({ 
      success: true, 
      message: 'Reacción agregada exitosamente', 
      data: reaction 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al agregar la reacción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al agregar la reacción',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function removeReaction
 * @description Elimina una reacción de un objetivo (post o reply)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const removeReaction = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { targetId, targetType, emojiId } = req.params;
    const { userId } = req.body;
    
    // Validaciones básicas
    if (!userId) {
      res.status(400).json({ 
        success: false, 
        message: 'userId es obligatorio' 
      });
      return;
    }
    
    // Buscar la reacción
    const reaction = await ForumReaction.findOne({
      where: {
        userId,
        targetId: Number(targetId),
        targetType,
        emojiId
      },
      transaction
    });
    
    if (!reaction) {
      await transaction.rollback();
      res.status(404).json({ 
        success: false, 
        message: 'Reacción no encontrada' 
      });
      return;
    }
    
    // Eliminar la reacción
    await reaction.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({ 
      success: true, 
      message: 'Reacción eliminada exitosamente' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar la reacción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la reacción',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function getUserReactions
 * @description Obtiene todas las reacciones de un usuario
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getUserReactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Verificar si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    
    // Obtener las reacciones del usuario
    const reactions = await ForumReaction.findAll({
      where: { userId },
      include: [
        {
          model: ForumPost,
          as: 'post',
          required: false
        },
        {
          model: ForumReply,
          as: 'reply',
          required: false
        }
      ]
    });
    
    res.status(200).json({ 
      success: true, 
      data: reactions 
    });
  } catch (error) {
    console.error('Error al obtener las reacciones del usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las reacciones del usuario',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 