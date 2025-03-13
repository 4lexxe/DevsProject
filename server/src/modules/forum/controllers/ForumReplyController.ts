// ForumReplyController.ts
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
   * @function createReply
   * @description Crea un nuevo comentario (reply).
   * Si se provee parentReplyId, se toma el postId del comentario padre y se calcula la profundidad.
   * Si no se provee, se requiere postId en el body para un comentario raíz.
   */
  static async createReply(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Se extraen los datos del body
      const { content, parentReplyId, isNSFW = false, isSpoiler = false, postId: providedPostId } = req.body;
      const userId = (req.user as User)?.id;

      let postId: number;
      let depth = 0;

      if (parentReplyId) {
        // Si es respuesta a otro comentario, obtener el comentario padre
        const parentReply = await ForumReply.findByPk(parentReplyId);
        if (!parentReply) {
          res.status(400).json({ 
            success: false, 
            message: 'Comentario padre no encontrado' 
          });
          return;
        }
        postId = parentReply.postId;
        depth = parentReply.depth + 1;
      } else {
        // Comentario raíz: se requiere postId en el body
        if (!providedPostId) {
          res.status(400).json({ 
            success: false, 
            message: 'postId es requerido para comentarios raíz' 
          });
          return;
        }
        // Validar existencia del post
        const parentPost = await ForumPost.findByPk(providedPostId);
        if (!parentPost) {
          res.status(404).json({ success: false, message: 'Post no encontrado' });
          return;
        }
        postId = Number(providedPostId);
      }

      // Crear el comentario (reply)
      const reply = await ForumReply.create({
        postId,
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

      await transaction.commit();
      res.status(201).json({
        success: true,
        message: 'Comentario creado exitosamente',
        data: reply
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al crear el comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el comentario',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getPaginatedNestedReplies
   * @description Obtiene los comentarios raíz (con parentReplyId = null) de un post dado,
   * con paginación y carga inicial de respuestas hijas.
   */
  static async getPaginatedNestedReplies(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 25;
      const offset = (page - 1) * limit;

      // Buscar comentarios raíz para el post indicado
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

      // Función para cargar respuestas hijas iniciales (por ejemplo, hasta 3 por comentario)
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
          limit: 3,
          order: [['createdAt', 'DESC']]
        });
        // Asignar los hijos encontrados en la propiedad 'childReplies'
        (reply as any).setDataValue('childReplies', children);
      };

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
      console.error('Error al obtener comentarios paginados:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener comentarios',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getMoreChildren
   * @description Carga paginada de respuestas hijas adicionales para un comentario dado.
   */
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
   * @description Obtiene un comentario específico con sus relaciones.
   */
  static async getReplyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ success: false, message: 'ID de comentario inválido' });
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
        res.status(404).json({ success: false, message: 'Comentario no encontrado' });
        return;
      }

      res.status(200).json({ success: true, data: reply });
    } catch (error) {
      console.error('Error al obtener el comentario por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el comentario',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function updateReply
   * @description Actualiza un comentario existente.
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

      // Buscar el comentario
      const reply = await ForumReply.findByPk(id);
      if (!reply) {
        res.status(404).json({ success: false, message: 'Comentario no encontrado' });
        return;
      }

      await reply.update({
        content: content || reply.content,
        isNSFW: typeof isNSFW === 'boolean' ? isNSFW : reply.isNSFW,
        isSpoiler: typeof isSpoiler === 'boolean' ? isSpoiler : reply.isSpoiler,
        coverImage: coverImage || reply.coverImage
      }, { transaction });

      await transaction.commit();
      res.status(200).json({
        success: true,
        message: 'Comentario actualizado exitosamente',
        data: reply 
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al actualizar el comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el comentario',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function deleteReply
   * @description Elimina (o oculta) un comentario.
   */
  static async deleteReply(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const reply = await ForumReply.findByPk(id);
      if (!reply) {
        res.status(404).json({ success: false, message: 'Comentario no encontrado' });
        return;
      }

      // Eliminación física del comentario
      await reply.destroy({ transaction });
      await transaction.commit();
      res.status(200).json({
        success: true,
        message: 'Comentario eliminado exitosamente'
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al eliminar el comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el comentario',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function toggleNSFWStatus
   * @description Cambia el estado NSFW de un comentario.
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
        res.status(404).json({ success: false, message: 'Comentario no encontrado' });
        return;
      }

      await reply.update({ isNSFW });
      res.status(200).json({
        success: true,
        message: 'Estado NSFW del comentario actualizado exitosamente',
        data: reply
      });
    } catch (error) {
      console.error('Error al cambiar el estado NSFW del comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar el estado NSFW del comentario',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function toggleSpoilerStatus
   * @description Cambia el estado de spoiler de un comentario.
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
        res.status(404).json({ success: false, message: 'Comentario no encontrado' });
        return;
      }

      await reply.update({ isSpoiler });
      res.status(200).json({
        success: true,
        message: 'Estado de spoiler del comentario actualizado exitosamente',
        data: reply
      });
    } catch (error) {
      console.error('Error al cambiar el estado de spoiler del comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar el estado de spoiler del comentario',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getPopularReplies
   * @description Obtiene comentarios populares basados en un criterio (por defecto, voteScore).
   */
  static async getPopularReplies(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const criteria = req.query.criteria as string || 'voteScore';

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
      console.error('Error al obtener comentarios populares:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener comentarios populares',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

export default ForumReplyController;
