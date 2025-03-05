import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ForumReply from '../models/ForumReply';
import ForumPost from '../models/ForumPost';
import User from '../../user/User';
import sequelize from '../../../infrastructure/database/db';
import { replyValidations } from '../validators/reply.validator';

export class ForumReplyController {
  // Validaciones para los datos de entrada
  static replyValidations = replyValidations;

  /**
   * @function getAllReplies
   * @description Obtiene todas las respuestas
   */
  static async getAllReplies(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const replies = await ForumReply.findAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: ForumPost,
            as: 'post',
            attributes: ['id', 'title']
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: replies
      });
    } catch (error) {
      console.error('Error al obtener todas las respuestas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener todas las respuestas',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function createReply
   * @description Crea una nueva respuesta a un post
   */
  static async createReply(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { postId } = req.params;
      const {content, isNSFW = false, isSpoiler = false } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      // Verificar si el post existe
      const post = await ForumPost.findByPk(postId);
      if (!post) {
        res.status(404).json({ success: false, message: 'Post no encontrado' });
        return;
      }
      // Crear la respuesta
      const reply = await ForumReply.create({
        postId: Number(postId),
        authorId: userId,
        content,
        isNSFW,
        isSpoiler,
        voteScore: 0,
        upvoteCount: 0,
        downvoteCount: 0
      }, { transaction });

      await transaction.commit();
      res.status(201).json({
        success: true,
        message: 'Respuesta creada exitosamente',
        data: reply
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al crear la respuesta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear la respuesta',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getReplyById
   * @description Obtiene una respuesta por su ID
   */
  static async getReplyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const reply = await ForumReply.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: ForumPost,
            as: 'post'
          }
        ]
      });
      
      if (!reply) {
        res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        return;
      }
      
      res.status(200).json({ success: true, data: reply });
    } catch (error) {
      console.error('Error al obtener la respuesta por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la respuesta',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function updateReply
   * @description Actualiza una respuesta existente
   */
  static async updateReply(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { content, isNSFW, isSpoiler } = req.body;
      
      // Buscar la respuesta
      const reply = await ForumReply.findByPk(id);
      
      if (!reply) {
        res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        return;
      }
      
      // Actualizar la respuesta
      await reply.update({
        content: content || reply.content,
        isNSFW: typeof isNSFW === 'boolean' ? isNSFW : reply.isNSFW,
        isSpoiler: typeof isSpoiler === 'boolean' ? isSpoiler : reply.isSpoiler
      }, { transaction });
      
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Respuesta actualizada exitosamente',
        data: reply
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al actualizar la respuesta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la respuesta',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function deleteReply
   * @description Oculta una respuesta (cambia su estado a HIDDEN)
   */
  static async deleteReply(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      
      // Buscar la respuesta
      const reply = await ForumReply.findByPk(id);
      
      if (!reply) {
        res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        return;
      }
      
      // Eliminar la respuesta físicamente
      await reply.destroy({ transaction });
      
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Respuesta eliminada exitosamente'
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al eliminar la respuesta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la respuesta',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function toggleNSFWStatus
   * @description Cambia el estado de NSFW de una respuesta
   */
  static async toggleNSFWStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isNSFW } = req.body;

      if (typeof isNSFW !== 'boolean') {
        res.status(400).json({ 
          success: false, 
          message: 'El valor de isNSFW debe ser un booleano' 
        });
        return;
      }

      const reply = await ForumReply.findByPk(id);

      if (!reply) {
        res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        return;
      }

      await reply.update({ isNSFW });

      res.status(200).json({
        success: true,
        message: `Estado NSFW de la respuesta actualizado exitosamente`,
        data: reply
      });
    } catch (error) {
      console.error('Error al cambiar el estado NSFW de la respuesta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar el estado NSFW de la respuesta',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function toggleSpoilerStatus
   * @description Cambia el estado de spoiler de una respuesta
   */
  static async toggleSpoilerStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isSpoiler } = req.body;

      if (typeof isSpoiler !== 'boolean') {
        res.status(400).json({ 
          success: false, 
          message: 'El valor de isSpoiler debe ser un booleano' 
        });
        return;
      }

      const reply = await ForumReply.findByPk(id);

      if (!reply) {
        res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        return;
      }

      await reply.update({ isSpoiler });

      res.status(200).json({
        success: true,
        message: `Estado de spoiler de la respuesta actualizado exitosamente`,
        data: reply
      });
    } catch (error) {
      console.error('Error al cambiar el estado de spoiler de la respuesta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar el estado de spoiler de la respuesta',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  static async getPopularReplies(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const criteria = req.query.criteria as string || 'voteScore'; // 'voteScore', 'upvoteCount', 'downvoteCount'

      let order: [string, string][] = [];

      switch (criteria) {
        case 'upvoteCount':
          order = [['upvoteCount', 'DESC']];
          break;
        case 'downvoteCount':
          order = [['downvoteCount', 'ASC']];
          break;
        case 'voteScore':
        default:
          order = [['voteScore', 'DESC']];
          break;
      }

      const replies = await ForumReply.findAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: ForumPost,
            as: 'post',
            attributes: ['id', 'title']
          }
        ],
        limit,
        order
      });

      res.status(200).json({
        success: true,
        data: replies
      });
    } catch (error) {
      console.error('Error al obtener las respuestas populares:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las respuestas populares',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}