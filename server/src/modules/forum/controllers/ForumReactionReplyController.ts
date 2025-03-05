// server/src/modules/forum/controllers/forumReactionReplyController.ts

import { Request, Response } from 'express';
import ForumReactionReply from '../models/ForumReactionReply';
import ForumReply from '../models/ForumReply';
import User from '../../user/User';
import sequelize from '../../../infrastructure/database/db';

/**
 * @function getReactionsByReply
 * @description Obtiene todas las reacciones para una respuesta específica
 */
export const getReactionsByReply = async (req: Request, res: Response): Promise<void> => {
  try {
    const { replyId } = req.params;

    // Verificar si la respuesta existe
    const replyExists = !!(await ForumReply.findByPk(Number(replyId)));
    if (!replyExists) {
      res.status(404).json({ success: false, message: 'La respuesta no existe' });
      return;
    }

    // Obtener las reacciones
    const reactions = await ForumReactionReply.getReplyReactions(Number(replyId));

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

    res.status(200).json({ success: true, data: Object.values(groupedReactions) });
  } catch (error) {
    console.error('Error al obtener las reacciones de la respuesta:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las reacciones de la respuesta', error: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * @function addReactionToReply
 * @description Agrega una reacción a una respuesta
 */
export const addReactionToReply = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const { replyId } = req.params;
    const userId = (req.user as User)?.id;
    const { emojiId, emojiName, isCustom = false } = req.body;

    // Validaciones básicas
    if (!userId || !emojiId || !emojiName) {
      res.status(400).json({ success: false, message: 'userId, emojiId y emojiName son obligatorios' });
      return;
    }

    // Verificar si la respuesta existe
    const replyExists = !!(await ForumReply.findByPk(Number(replyId)));
    if (!replyExists) {
      res.status(404).json({ success: false, message: 'La respuesta no existe' });
      return;
    }

    // Verificar si ya existe alguna reacción del usuario para esta respuesta
    const existingReaction = await ForumReactionReply.findOne({
      where: { userId, replyId: Number(replyId) },
      transaction
    });

    if (existingReaction) {
      await transaction.rollback();
      res.status(409).json({ success: false, message: 'El usuario ya reaccionó a esta respuesta' });
      return;
    }

    // Crear la reacción
    const reaction = await ForumReactionReply.create({
      userId,
      replyId: Number(replyId),
      emojiId,
      emojiName,
      isCustom
    }, { transaction });

    await transaction.commit();

    res.status(201).json({ success: true, message: 'Reacción agregada exitosamente', data: reaction });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al agregar la reacción a la respuesta:', error);
    res.status(500).json({ success: false, message: 'Error al agregar la reacción a la respuesta', error: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * @function removeReactionFromReply
 * @description Elimina una reacción de una respuesta
 */
export const removeReactionFromReply = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const { replyId, emojiId } = req.params;
    const userId = (req.user as User)?.id;

    // Validaciones básicas
    if (!userId) {
      res.status(400).json({ success: false, message: 'userId es obligatorio' });
      return;
    }

    // Buscar la reacción
    const reaction = await ForumReactionReply.findOne({
      where: { userId, replyId: Number(replyId), emojiId },
      transaction
    });

    if (!reaction) {
      await transaction.rollback();
      res.status(404).json({ success: false, message: 'Reacción no encontrada' });
      return;
    }

    // Eliminar la reacción
    await reaction.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({ success: true, message: 'Reacción eliminada exitosamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar la reacción de la respuesta:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la reacción de la respuesta', error: error instanceof Error ? error.message : String(error) });
  }
};