import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ForumReply from '../models/ForumReply';
import ForumPost from '../models/ForumPost';
import User from '../../user/User';
import sequelize from '../../../infrastructure/database/db';
import { replyValidations } from '../validators/reply.validator';
import { ForumThread } from '../models';
import { NotificationType } from '../models/Notification';
import NotificationService from '../services/notification.service';

export class ForumReplyController {
  // Validaciones para los datos de entrada
  static replyValidations = replyValidations;

  

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
        const { content, parentReplyId, isNSFW = false, isSpoiler = false } = req.body;
        const userId = (req.user as User)?.id;

        // Validar existencia del post padre
        const parentPost = await ForumPost.findByPk(postId);
        if (!parentPost) {
            res.status(404).json({ success: false, message: 'Post no encontrado' });
            return;
        }

        let depth = 0;
        let parentReply: ForumReply | null = null;

        // Si es respuesta a otro reply
        if (parentReplyId) {
            parentReply = await ForumReply.findByPk(parentReplyId);
            if (!parentReply || parentReply.postId !== parseInt(postId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Respuesta padre inválida o no pertenece al post' 
                });
                return;
            }
            depth = parentReply.depth + 1;
        }

        // Crear reply
        const reply = await ForumReply.create({
            postId: Number(postId),
            authorId: userId,
            content,
            parentReplyId: parentReplyId || null,
            depth,
            isNSFW,
            isSpoiler,
            voteScore: 0,
            upvoteCount: 0,
            downvoteCount: 0
        }, { transaction });

        // Actualizar actividad del hilo
        await ForumThread.update(
            { lastActivityAt: new Date() },
            { where: { id: parentPost.threadId }, transaction }
        );



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

// Nuevo método para obtener estructura anidada
static async getPaginatedNestedReplies(req: Request, res: Response): Promise<void> {
  try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 25;
      const offset = (page - 1) * limit;

      // Obtener respuestas raíz (parentReplyId = null) paginadas
      const { count, rows: rootReplies } = await ForumReply.findAndCountAll({
          where: { 
              postId: Number(postId),
              parentReplyId: null 
          },
          include: [
              {
                  model: User,
                  as: 'author',
                  attributes: ['id', 'username', 'avatar']
              }
          ],
          limit,
          offset,
          order: [['createdAt', 'DESC']]
      });

      // Función recursiva para cargar primeros niveles de hijos
      const loadInitialChildren = async (reply: ForumReply) => {
          const children = await ForumReply.findAll({
              where: { parentReplyId: reply.id },
              include: [
                  {
                      model: User,
                      as: 'author',
                      attributes: ['id', 'username', 'avatar']
                  }
              ],
              limit: 3, // Carga inicial de 3 hijos por nivel
              order: [['createdAt', 'DESC']]
          });
          
          (reply as any).setDataValue('replies', children);
      };

      // Cargar primeros hijos para cada raíz
      await Promise.all(rootReplies.map(loadInitialChildren));

      res.status(200).json({
          success: true,
          data: {
              totalRootReplies: count,
              currentPage: page,
              totalPages: Math.ceil(count / limit),
              replies: rootReplies
          }
      });
  } catch (error) {
      console.error('Error al obtener respuestas paginadas:', error);
      res.status(500).json({
          success: false,
          message: 'Error al obtener respuestas',
          error: error instanceof Error ? error.message : String(error)
      });
  }
}

  // Carga bajo demanda de más hijos
static async getMoreChildren(req: Request, res: Response): Promise<void> {
  try {
      const { parentReplyId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const offset = (page - 1) * limit;

      const { count, rows: children } = await ForumReply.findAndCountAll({
          where: { parentReplyId: Number(parentReplyId) },
          include: [
              {
                  model: User,
                  as: 'author',
                  attributes: ['id', 'username', 'avatar']
              }
          ],
          limit,
          offset,
          order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
          success: true,
          data: {
              totalChildren: count,
              currentPage: page,
              totalPages: Math.ceil(count / limit),
              replies: children
          }
      });
  } catch (error) {
      console.error('Error al obtener hijos adicionales:', error);
      res.status(500).json({
          success: false,
          message: 'Error al obtener respuestas',
          error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
 * @function getReplyById
 * @description Obtiene una respuesta específica con sus relaciones
 */
  static async getReplyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
  
      // Validate the ID
      if (!id || isNaN(Number(id))) {
        res.status(400).json({ success: false, message: 'ID de respuesta inválido' });
        return;
      }
      
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
      const { content, isNSFW, isSpoiler, coverImage } = req.body;
      
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
        isSpoiler: typeof isSpoiler === 'boolean' ? isSpoiler : reply.isSpoiler,
        coverImage: coverImage || reply.coverImage
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