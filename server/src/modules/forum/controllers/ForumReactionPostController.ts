// server/src/modules/forum/controllers/forumReactionPostController.ts

import { Request, Response } from 'express';
import ForumReactionPost from '../models/ForumReactionPost';
import ForumPost from '../models/ForumPost';
import User from '../../user/User';
import sequelize from '../../../infrastructure/database/db';

/**
 * @function getReactionsByPost
 * @description Obtiene todas las reacciones para un post específico
 */
export const getReactionsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // Verificar si el post existe
    const postExists = !!(await ForumPost.findByPk(Number(postId)));
    if (!postExists) {
      res.status(404).json({ success: false, message: 'El post no existe' });
      return;
    }

    // Obtener las reacciones
    const reactions = await ForumReactionPost.getPostReactions(Number(postId));

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
    console.error('Error al obtener las reacciones del post:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las reacciones del post', error: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * @function addReactionToPost
 * @description Agrega una reacción a un post
 */
export const addReactionToPost = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const { postId } = req.params;
    const userId = (req.user as User)?.id;
    const { emojiId, emojiName, isCustom = false } = req.body;

    // Validaciones básicas
    if (!userId || !emojiId || !emojiName) {
      res.status(400).json({ success: false, message: 'userId, emojiId y emojiName son obligatorios' });
      return;
    }

    // Verificar si el post existe
    const postExists = !!(await ForumPost.findByPk(Number(postId)));
    if (!postExists) {
      res.status(404).json({ success: false, message: 'El post no existe' });
      return;
    }

    // Verificar si ya existe alguna reacción del usuario para este post
    const existingReaction = await ForumReactionPost.findOne({
      where: { userId, postId: Number(postId) },
      transaction
    });

    if (existingReaction) {
      await transaction.rollback();
      res.status(409).json({ success: false, message: 'El usuario ya reaccionó a este post' });
      return;
    }

    // Crear la reacción
    const reaction = await ForumReactionPost.create({
      userId,
      postId: Number(postId),
      emojiId,
      emojiName,
      isCustom
    }, { transaction });

    await transaction.commit();

    res.status(201).json({ success: true, message: 'Reacción agregada exitosamente', data: reaction });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al agregar la reacción al post:', error);
    res.status(500).json({ success: false, message: 'Error al agregar la reacción al post', error: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * @function removeReactionFromPost
 * @description Elimina una reacción de un post
 */
export const removeReactionFromPost = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const { postId, emojiId } = req.params;
    const userId = (req.user as User)?.id;

    // Validaciones básicas
    if (!userId) {
      res.status(400).json({ success: false, message: 'Usuario no autenticado' });
      return;
    }

    // Buscar la reacción
    const reaction = await ForumReactionPost.findOne({
      where: { userId, postId: Number(postId), emojiId },
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
    console.error('Error al eliminar la reacción del post:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la reacción del post', error: error instanceof Error ? error.message : String(error) });
  }
};