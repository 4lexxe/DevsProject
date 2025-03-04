import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import ForumThread from '../models/ForumThread';
import ForumPost, { PostStatus } from '../models/ForumPost';
import User from '../../user/User';
import ForumCategory from '../models/ForumCategory';
import sequelize from '../../../infrastructure/database/db';
import { Op } from 'sequelize';

export class ForumThreadController {
  // Validaciones para los datos de entrada
  static threadValidations = [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('categoryId').isInt().withMessage('El ID de la categoría debe ser un número entero'),
    body('firstPostContent').notEmpty().withMessage('El contenido del primer post es obligatorio'),
    body('isPinned').optional().isBoolean().withMessage('isPinned debe ser un valor booleano'),
    body('isLocked').optional().isBoolean().withMessage('isLocked debe ser un valor booleano'),
    body('isAnnouncement').optional().isBoolean().withMessage('isAnnouncement debe ser un valor booleano'),
  ];

  /**
   * @function getAllThreads
   * @description Obtiene todos los hilos del foro con paginación
   */
  static async getAllThreads(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const search = req.query.search as string;

      const whereClause: any = {};
      
      if (categoryId) {
        whereClause.categoryId = categoryId;
      }
      
      if (search) {
        whereClause.title = { [Op.iLike]: `%${search}%` };
      }
      
      const { count, rows: threads } = await ForumThread.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: ForumPost,
            as: 'posts',
            required: false,
            limit: 1,
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          },
          {
            model: ForumCategory,
            as: 'category'
          }
        ],
        limit,
        offset,
        order: [['isPinned', 'DESC'], ['lastActivityAt', 'DESC']]
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.status(200).json({
        success: true,
        data: threads,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          limit
        }
      });
    } catch (error) {
      console.error('Error al obtener los hilos del foro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los hilos del foro',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getThreadById
   * @description Obtiene un hilo por su ID
   */
  static async getThreadById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const thread = await ForumThread.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: ForumCategory,
            as: 'category'
          }
        ]
      });
      
      if (!thread) {
        res.status(404).json({ success: false, message: 'Hilo no encontrado' });
        return;
      }
      
      // Incrementar el conteo de vistas
      await thread.increment('viewCount');
      
      res.status(200).json({ success: true, data: thread });
    } catch (error) {
      console.error('Error al obtener el hilo por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function createThread
   * @description Crea un nuevo hilo en el foro
   */
  static async createThread(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
        // Verificar si el usuario está autenticado
        if (!req.isAuthenticated()) {
          res.status(401).json({ error: 'Usuario no autenticado' });
          return;
        }
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }
  
        const { title, categoryId, firstPostContent, isPinned, isLocked, isAnnouncement } = req.body;
        const userId = (req.user as User)?.id;
  
        if (!userId) {
          res.status(401).json({ error: 'Usuario no autenticado' });
          return;
        }
        
        // Crear el hilo
        const thread = await ForumThread.create({
          title,
          categoryId,
          authorId: userId,
          lastActivityAt: new Date(),
          postCount: 1,
          viewCount: 0,
          isPinned,
          isLocked,
          isAnnouncement
        }, { transaction });
        
        // Crear el primer post del hilo
        const post = await ForumPost.create({
          threadId: thread.id,
          authorId: userId,
          content: firstPostContent,
          status: PostStatus.PUBLISHED,
          isNSFW: false,
          isSpoiler: false
        }, { transaction });
        
        await transaction.commit();
        res.status(201).json({
          success: true,
          message: 'Hilo creado exitosamente',
          data: {
            thread,
            firstPost: post
          }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al crear el hilo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function updateThread
   * @description Actualiza un hilo existente
   */
  static async updateThread(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { 
        title, 
        categoryId, 
        isPinned,
        isLocked,
        isAnnouncement
      } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      // Buscar el hilo
      const thread = await ForumThread.findByPk(id);
      
      if (!thread) {
        res.status(404).json({ success: false, message: 'Hilo no encontrado' });
        return;
      }
      
      // Actualizar el hilo
      await thread.update({
        title: title || thread.title,
        categoryId: categoryId || thread.categoryId,
        isPinned: typeof isPinned === 'boolean' ? isPinned : thread.isPinned,
        isLocked: typeof isLocked === 'boolean' ? isLocked : thread.isLocked,
        isAnnouncement: typeof isAnnouncement === 'boolean' ? isAnnouncement : thread.isAnnouncement
      }, { transaction });
      
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Hilo actualizado exitosamente',
        data: thread
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al actualizar el hilo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function deleteThread
   * @description Elimina un hilo
   */
  static async deleteThread(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
        // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

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
      
      // Buscar el hilo
      const thread = await ForumThread.findByPk(id);
      
      if (!thread) {
        res.status(404).json({ success: false, message: 'Hilo no encontrado' });
        return;
      }
      
      // Eliminar el hilo
      await thread.destroy({ transaction });
      
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Hilo eliminado exitosamente'
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al eliminar el hilo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getThreadPosts
   * @description Obtiene todos los posts de un hilo específico con paginación
   */
  static async getThreadPosts(req: Request, res: Response): Promise<void> {
    try {
      const { threadId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      
      // Verificar que el hilo existe
      const thread = await ForumThread.findByPk(threadId);
      
      if (!thread) {
        res.status(404).json({ success: false, message: 'Hilo no encontrado' });
        return;
      }
      
      // Obtener los posts del hilo
      const { count, rows: posts } = await ForumPost.findAndCountAll({
        where: { 
          threadId,
          status: PostStatus.PUBLISHED
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar', 'createdAt']
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'ASC']]
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.status(200).json({
        success: true,
        data: posts,
        threadInfo: {
          id: thread.id,
          title: thread.title,
          isLocked: thread.isLocked
        },
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          limit
        }
      });
    } catch (error) {
      console.error('Error al obtener los posts del hilo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los posts del hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function pinThread
   * @description Fija o desfija un hilo en el foro
   */
  static async pinThread(req: Request, res: Response): Promise<void> {
    try {

      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      
      const { id } = req.params;
      const { isPinned } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }
      
      if (typeof isPinned !== 'boolean') {
        res.status(400).json({ 
          success: false, 
          message: 'El valor de isPinned debe ser un booleano' 
        });
        return;
      }
      
      const thread = await ForumThread.findByPk(id);
      
      if (!thread) {
        res.status(404).json({ success: false, message: 'Hilo no encontrado' });
        return;
      }
      
      await thread.update({ isPinned });
      
      const action = isPinned ? 'fijado' : 'desfijado';
      
      res.status(200).json({
        success: true,
        message: `Hilo ${action} exitosamente`,
        data: thread
      });
    } catch (error) {
      console.error('Error al fijar/desfijar el hilo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al fijar/desfijar el hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function lockThread
   * @description Bloquea o desbloquea un hilo para prevenir nuevas publicaciones
   */
  static async lockThread(req: Request, res: Response): Promise<void> {
    try {

      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { isLocked } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      if (typeof isLocked !== 'boolean') {
        res.status(400).json({ 
          success: false, 
          message: 'El valor de isLocked debe ser un booleano' 
        });
        return;
      }
      
      const thread = await ForumThread.findByPk(id);
      
      if (!thread) {
        res.status(404).json({ success: false, message: 'Hilo no encontrado' });
        return;
      }
      
      await thread.update({ isLocked });
      
      const action = isLocked ? 'bloqueado' : 'desbloqueado';
      
      res.status(200).json({
        success: true,
        message: `Hilo ${action} exitosamente`,
        data: thread
      });
    } catch (error) {
      console.error('Error al bloquear/desbloquear el hilo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al bloquear/desbloquear el hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function getPopularThreads
   * @description Obtiene los hilos más populares basados en vistas, posts o actividad reciente
   */
  static async getPopularThreads(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const criteria = req.query.criteria as string || 'activity'; // 'activity', 'views', 'posts'
      
      let order: [string, string][] = [];
      
      switch (criteria) {
        case 'views':
          order = [['viewCount', 'DESC']];
          break;
        case 'posts':
          order = [['postCount', 'DESC']];
          break;
        case 'activity':
        default:
          order = [['lastActivityAt', 'DESC']];
          break;
      }
      
      const threads = await ForumThread.findAll({
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
        data: threads
      });
    } catch (error) {
      console.error('Error al obtener los hilos populares:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los hilos populares',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @function toggleAnnouncementStatus
   * @description Cambia el estado de anuncio de un hilo
   */
  static async toggleAnnouncementStatus(req: Request, res: Response): Promise<void> {
    try {

      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { isAnnouncement } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      if (typeof isAnnouncement !== 'boolean') {
        res.status(400).json({ 
          success: false, 
          message: 'El valor de isAnnouncement debe ser un booleano' 
        });
        return;
      }
      
      const thread = await ForumThread.findByPk(id);
      
      if (!thread) {
        res.status(404).json({ success: false, message: 'Hilo no encontrado' });
        return;
      }
      
      await thread.update({ isAnnouncement });
      
      const action = isAnnouncement ? 'marcado como anuncio' : 'desmarcado como anuncio';
      
      res.status(200).json({
        success: true,
        message: `Hilo ${action} exitosamente`,
        data: thread
      });
    } catch (error) {
      console.error('Error al cambiar el estado de anuncio del hilo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar el estado de anuncio del hilo',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}