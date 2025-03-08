import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ForumPost, { PostStatus } from '../models/ForumPost';
import ForumThread from '../models/ForumThread';
import User from '../../user/User';
import sequelize from '../../../infrastructure/database/db';
import { postValidations } from '../validators/post.validator';

export class ForumPostController {
  // Validaciones para los datos de entrada
  static postValidations = postValidations;

  /**
   * @function createPost
   * @description Crea un nuevo post en un hilo
   */
  static async createPost(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { threadId, content, isNSFW, isSpoiler, coverImage } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      // Verificar si el hilo existe y no está bloqueado
      const thread = await ForumThread.findByPk(threadId);
      if (!thread) {
        res.status(404).json({ success: false, message: 'Hilo no encontrado' });
        return;
      }
      if (thread.isLocked) {
        res.status(403).json({ success: false, message: 'El hilo está bloqueado y no acepta nuevos posts' });
        return;
      }

      // Crear el post
      const post = await ForumPost.create({
        threadId,
        authorId: userId,
        content,
        status: PostStatus.PUBLISHED,
        isNSFW,
        isSpoiler,
        coverImage
      }, { transaction });

      await transaction.commit();
      res.status(201).json({
        success: true,
        message: 'Post creado exitosamente',
        data: post
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al crear el post:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el post',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getPostById
   * @description Obtiene un post por su ID
   */
  static async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const post = await ForumPost.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: ForumThread,
            as: 'thread'
          }
        ]
      });
      
      if (!post) {
        res.status(404).json({ success: false, message: 'Post no encontrado' });
        return;
      }
      
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      console.error('Error al obtener el post por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el post',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function updatePost
   * @description Actualiza un post existente
   */
  static async updatePost(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { content, isNSFW, isSpoiler, coverImage } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      // Buscar el post
      const post = await ForumPost.findByPk(id);
      
      if (!post) {
        res.status(404).json({ success: false, message: 'Post no encontrado' });
        return;
      }
      
      // Verificar si el hilo está bloqueado
      const thread = await ForumThread.findByPk(post.threadId);
      if (thread && thread.isLocked) {
        res.status(403).json({ success: false, message: 'No se puede editar el post porque el hilo está bloqueado' });
        return;
      }
      
      // Actualizar el post
      await post.update({
        content: content || post.content,
        isNSFW: typeof isNSFW === 'boolean' ? isNSFW : post.isNSFW,
        isSpoiler: typeof isSpoiler === 'boolean' ? isSpoiler : post.isSpoiler,
        coverImage: coverImage || post.coverImage
      }, { transaction });
      
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Post actualizado exitosamente',
        data: post
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al actualizar el post:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el post',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function deletePost
   * @description Oculta un post (cambia su estado a HIDDEN)
   */
  static async deletePost(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      // Buscar el post
      const post = await ForumPost.findByPk(id);
      
      if (!post) {
        res.status(404).json({ success: false, message: 'Post no encontrado' });
        return;
      }
      
      // Eliminar el post físicamente
      await post.destroy({ transaction });
      
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Post eliminado exitosamente'
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al eliminar el post:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el post',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
 * @function toggleNSFWStatus
 * @description Cambia el estado de NSFW de un post
 */
    /*static async toggleNSFWStatus(req: Request, res: Response): Promise<void> {
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
  
      const post = await ForumPost.findByPk(id);
  
      if (!post) {
        res.status(404).json({ success: false, message: 'Post no encontrado' });
        return;
      }
  
      await post.update({ isNSFW });
  
      res.status(200).json({
        success: true,
        message: `Estado NSFW del post actualizado exitosamente`,
        data: post
      });
    } catch (error) {
      console.error('Error al cambiar el estado NSFW del post:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar el estado NSFW del post',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }*/

  /**
 * @function toggleSpoilerStatus
 * @description Cambia el estado de spoiler de un post
 */
    /*static async toggleSpoilerStatus(req: Request, res: Response): Promise<void> {
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
  
      const post = await ForumPost.findByPk(id);
  
      if (!post) {
        res.status(404).json({ success: false, message: 'Post no encontrado' });
        return;
      }
  
      await post.update({ isSpoiler });
  
      res.status(200).json({
        success: true,
        message: `Estado de spoiler del post actualizado exitosamente`,
        data: post
      });
    } catch (error) {
      console.error('Error al cambiar el estado de spoiler del post:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar el estado de spoiler del post',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }*/

    /**
    * @function getPopularPosts
    * @description Obtiene los posts más populares basados en voteScore, upvoteCount, y downvoteCount
    */

  static async getPopularPosts(req: Request, res: Response): Promise<void> {
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
  
      const posts = await ForumPost.findAll({
        where: { status: PostStatus.PUBLISHED },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }
        ],
        limit,
        order
      });
  
      res.status(200).json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error('Error al obtener los posts populares:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los posts populares',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getPostsByThread
   * @description Obtiene todas las publicaciones de un hilo específico
   */
  static async getPostsByThread(req: Request, res: Response): Promise<void> {
    try {
      const { threadId } = req.params;

      // Validar el ID del hilo
      if (!threadId || isNaN(Number(threadId))) {
        res.status(400).json({ success: false, message: 'ID de hilo inválido' });
        return;
      }

      const posts = await ForumPost.findAll({
        where: { threadId: Number(threadId) },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }
        ],
        order: [['createdAt', 'ASC']] // Ordenar por fecha de creación ascendente
      });

      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      console.error('Error al obtener las publicaciones del hilo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las publicaciones del hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}