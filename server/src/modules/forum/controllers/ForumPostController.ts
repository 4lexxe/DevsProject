import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ForumPost, { PostStatus } from '../models/ForumPost';
import User from '../../user/User';
import ForumCategory from '../models/ForumCategory';
import sequelize from '../../../infrastructure/database/db';
import { Op } from 'sequelize';
import { postValidations } from '../validators/post.validator';
import { ForumReply } from '../models';

export class ForumPostController {
    static postValidations = postValidations;

    /**
     * @function createPost
     * @description Crea un nuevo post/hilo en el foro
     */
    static async createPost(req: Request, res: Response): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              res.status(400).json({ errors: errors.array() });
              return;
            }

            const { title, content, categoryId, isNSFW, isSpoiler, coverImage } = req.body;
            const userId = (req.user as User)?.id;

            const post = await ForumPost.create({
                title,
                content,
                categoryId,
                authorId: userId,
                status: PostStatus.PUBLISHED,
                isNSFW: isNSFW || false,
                isSpoiler: isSpoiler || false,
                coverImage: coverImage || null,
                viewCount: 0,
                replyCount: 0
            }, { transaction });

            await transaction.commit();
            res.status(201).json({ success: true, data: post });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                success: false,
                message: 'Error creating post',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    /**
     * @function getPosts
     * @description Obtiene todos los posts con paginación y filtros
     */
    static async getPosts(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;
            const { categoryId, search, sortBy = 'lastActivityAt' } = req.query;

            const where: any = {};
            if (categoryId) where.categoryId = categoryId;
            if (search) where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { content: { [Op.iLike]: `%${search}%` } }
            ];

            const order = [[sortBy, sortBy === 'title' ? 'ASC' : 'DESC']];

            const { count, rows } = await ForumPost.findAndCountAll({
                where,
                include: [
                    { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
                    { model: ForumCategory, as: 'category' }
                ],
                order: [['createdAt', 'DESC']], //CAMBIAR A ORDER CUANDO HAYA FILTROS!!!!
                limit,
                offset
            });

            res.status(200).json({
                success: true,
                data: rows,
                pagination: {
                    totalItems: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    limit
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving posts',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    /**
     * @function getPostDetail
     * @description Obtiene un post completo con sus relaciones
     */
    static async getPostDetail(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const post = await ForumPost.findByPk(id, {
                include: [
                    { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
                    { model: ForumCategory, as: 'category' },
                    {
                        model: ForumPost,
                        as: 'replies',
                        include: [{
                            model: User,
                            as: 'author',
                            attributes: ['id', 'username', 'avatar']
                        }]
                    }
                ]
            });

            if (!post) {
                res.status(404).json({ success: false, message: 'Post not found' });
                return;
            }

            await post.increment('viewCount');
            res.status(200).json({ success: true, data: post });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving post',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    /**
     * @function updatePostStatus
     * @description Actualiza estados especiales del post (pinned, locked, etc)
     */
    static async updatePostStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const field = req.path.split('/').pop() as 'pin' | 'lock' | 'announcement';
            const value = req.body[field];
            if (typeof value !== 'boolean') {
                res.status(400).json({ success: false, message: 'Invalid value type' });
                return;
            }

            const post = await ForumPost.findByPk(id);
            if (!post) {
                res.status(404).json({ success: false, message: 'Post not found' });
                return;
            }

            const fieldMap = {
                pin: 'isPinned',
                lock: 'isLocked',
                announcement: 'isAnnouncement'
            };

            await post.update({ [fieldMap[field]]: value });
            res.status(200).json({ success: true, data: post });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating post status',
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
          await transaction.rollback();
          res.status(400).json({ errors: errors.array() });
          return;
      }

      const { id } = req.params;
      const { title, content, categoryId, isNSFW, isSpoiler, coverImage } = req.body;
      const userId = (req.user as User)?.id;

      const post = await ForumPost.findByPk(id, { transaction });
      
      if (!post) {
          await transaction.rollback();
          res.status(404).json({ success: false, message: 'Post not found' });
          return;
      }

      // Verificar que el usuario sea el autor del post
      if (post.authorId !== userId) {
          await transaction.rollback();
          res.status(403).json({ success: false, message: 'Not authorized to update this post' });
          return;
      }

      // Actualizar solo los campos proporcionados
      await post.update({
          title,
          content,
          categoryId,
          isNSFW,
          isSpoiler,
          coverImage,
          updatedAt: new Date()
      }, { transaction });

      await transaction.commit();
      res.status(200).json({ success: true, data: post });
  } catch (error) {
      await transaction.rollback();
      res.status(500).json({
          success: false,
          message: 'Error updating post',
          error: error instanceof Error ? error.message : String(error)
      });
  }
  }

    /**
     * @function getPopularPosts
     * @description Obtiene posts populares por diferentes criterios
     */
    static async getPopularPosts(req: Request, res: Response): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const criteria = req.query.criteria as keyof ForumPost || 'viewCount';

            const posts = await ForumPost.findAll({
                order: [[criteria, 'DESC']],
                limit,
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }]
            });

            res.status(200).json({ success: true, data: posts });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving popular posts',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    /**
     * @function deletePost
     * @description Elimina un post y sus respuestas relacionadas
     */
    static async deletePost(req: Request, res: Response): Promise<void> {
      const transaction = await sequelize.transaction();
      try {
          const { id } = req.params;
          const post = await ForumPost.findByPk(id, { transaction });
          
          if (!post) {
              await transaction.rollback();
              res.status(404).json({ success: false, message: 'Post not found' });
              return;
          }
  
          // 1. Eliminar todas las respuestas asociadas al post
          await ForumReply.destroy({
              where: { postId: post.id },
              transaction
          });
  
          // 2. Eliminar el post
          await post.destroy({ transaction });
          
          await transaction.commit();
          res.status(200).json({ success: true, message: 'Post deleted successfully' });
      } catch (error) {
          await transaction.rollback();
          res.status(500).json({
              success: false,
              message: 'Error deleting post',
              error: error instanceof Error ? error.message : String(error)
          });
      }
  }
}