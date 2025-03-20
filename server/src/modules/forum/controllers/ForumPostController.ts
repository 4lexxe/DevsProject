import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ForumPost, { PostStatus, ContentType } from '../models/ForumPost';
import User from '../../user/User';
import ForumCategory from '../models/ForumCategory';
import sequelize from '../../../infrastructure/database/db';
import { Op } from 'sequelize';
import { postValidations } from '../validators/post.validator';
import { ForumReply } from '../models';
import forumPostFilterService from '../services/forumPostFilter.service';

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

            const { 
                title, 
                content, 
                categoryId, 
                isNSFW, 
                isSpoiler, 
                imageUrl, 
                contentType: requestContentType,
                linkUrl, // Para posts de tipo LINK
            } = req.body;
            
            const userId = (req.user as User)?.id;
            
            // Determinar el tipo de contenido basado en el valor proporcionado o inferirlo
            let contentType = requestContentType;
            
            // Si no se proporcionó tipo, inferir basado en los datos proporcionados
            if (!contentType) {
                if (linkUrl) {
                    contentType = ContentType.LINK;
                } else if (imageUrl || (content && content.includes('![') && content.includes('](') && content.includes(')'))) {
                    contentType = ContentType.IMAGE;
                } else {
                    contentType = ContentType.TEXT; // Valor por defecto
                }
            }

            // Validar el tipo de contenido
            if (!Object.values(ContentType).includes(contentType)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid content type. Must be one of: TEXT, IMAGE, LINK' 
                });
                return;
            }

            // Si no se especificó tipo, usar TEXT por defecto
            if (!contentType) {
                contentType = ContentType.TEXT;
            }

            // Crear el post
            const postData: any = {
                title,
                content,
                contentType,
                categoryId,
                authorId: userId,
                status: PostStatus.PUBLISHED,
                isNSFW: isNSFW || false,
                isSpoiler: isSpoiler || false,
                viewCount: 0,
                replyCount: 0
            };
            
            // Manejar imageUrl según el tipo de contenido
            if (contentType === ContentType.IMAGE) {
                // Si viene una URL directa (string), la convertimos en array
                if (typeof imageUrl === 'string' && imageUrl) {
                    postData.imageUrl = [imageUrl];
                } 
                // Si ya viene como array, lo usamos como está (hasta 8 imágenes)
                else if (Array.isArray(imageUrl)) {
                    postData.imageUrl = imageUrl.slice(0, 8);
                }
                // Si no hay imágenes, usamos array vacío
                else {
                    postData.imageUrl = [];
                }
            }
            
            // Manejar linkUrl para posts de tipo LINK
            if (contentType === ContentType.LINK && linkUrl) {
                postData.linkUrl = linkUrl;
                // No sobrescribir el slug, dejemos que el hook beforeValidate lo genere correctamente
            }
            
            const post = await ForumPost.create(postData, { transaction });

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
            const { id, slug } = req.params;
            const post = await ForumPost.findByPk(id, {
                include: [
                    { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
                    { model: ForumCategory, as: 'category' },
                    {
                        model: ForumReply,
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

            // Verificar si la URL utiliza el slug correcto (para SEO)
            if (req.params.slug !== post.slug) {
                // Redirigir a la URL correcta con código 301 (redirección permanente)
                return res.redirect(301, post.getUrl());
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
 * @function getFilteredPosts
 * @description Obtiene posts con filtros avanzados
 */
static async getFilteredPosts(req: Request, res: Response): Promise<void> {
    try {
      // Extraer todos los parámetros de filtro de query params
      const filterOptions = {
        // Paginación
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        
        // Filtros básicos
        search: req.query.search as string,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        authorId: req.query.authorId ? parseInt(req.query.authorId as string) : undefined,
        status: req.query.status as string,
        
        // Filtros de estado
        isPinned: req.query.isPinned ? req.query.isPinned === 'true' : undefined,
        isLocked: req.query.isLocked ? req.query.isLocked === 'true' : undefined,
        isAnnouncement: req.query.isAnnouncement ? req.query.isAnnouncement === 'true' : undefined,
        isNSFW: req.query.isNSFW ? req.query.isNSFW === 'true' : undefined,
        isSpoiler: req.query.isSpoiler ? req.query.isSpoiler === 'true' : undefined,
        
        // Filtros de actividad
        minViewCount: req.query.minViewCount ? parseInt(req.query.minViewCount as string) : undefined,
        maxViewCount: req.query.maxViewCount ? parseInt(req.query.maxViewCount as string) : undefined,
        minReplyCount: req.query.minReplyCount ? parseInt(req.query.minReplyCount as string) : undefined,
        maxReplyCount: req.query.maxReplyCount ? parseInt(req.query.maxReplyCount as string) : undefined,
        minVoteScore: req.query.minVoteScore ? parseInt(req.query.minVoteScore as string) : undefined,
        maxVoteScore: req.query.maxVoteScore ? parseInt(req.query.maxVoteScore as string) : undefined,
        
        // Filtros temporales
        createdBefore: req.query.createdBefore as string,
        createdAfter: req.query.createdAfter as string,
        updatedBefore: req.query.updatedBefore as string,
        updatedAfter: req.query.updatedAfter as string,
        activeAfter: req.query.activeAfter as string,
        activeBefore: req.query.activeBefore as string,
        
        // Filtros de relaciones
        flairIds: req.query.flairIds ? (req.query.flairIds as string).split(',').map(id => parseInt(id)) : undefined,
        
        // Ordenamiento
        sortBy: req.query.sortBy as string || 'lastActivityAt',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };
      
      // Utilizar el servicio para obtener posts filtrados
      const result = await forumPostFilterService.getFilteredPosts(filterOptions);
      
      res.status(200).json({
        success: true,
        data: result.posts,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving filtered posts',
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
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { id } = req.params;
        const { title, content, categoryId, isNSFW, isSpoiler, imageUrl, contentType, isPinned, isLocked, isAnnouncement, linkUrl } = req.body;
        const userId = (req.user as User)?.id;
        
        const post = await ForumPost.findByPk(id);
        if (!post) {
            res.status(404).json({ success: false, message: 'Post not found' });
            return;
        }
        
      // Verificar que el usuario sea el autor del post
        if (post.authorId !== userId) {
            res.status(403).json({ success: false, message: 'Not authorized to update this post' });
            return;
        }
        
        // Validar el tipo de contenido si se está actualizando
        if (contentType && !Object.values(ContentType).includes(contentType)) {
            res.status(400).json({ 
                success: false, 
                message: 'Invalid content type. Must be one of: TEXT, IMAGE, LINK' 
            });
            return;
        }

        // Actualizar solo los campos proporcionados
        await post.update({
            title,
            content,
            categoryId,
            isNSFW,
            isSpoiler,
            imageUrl: Array.isArray(imageUrl) ? imageUrl.slice(0, 8) : imageUrl ? [imageUrl] : undefined,
            contentType: contentType || post.contentType,
            isLocked,
            isPinned,
            isAnnouncement,
            linkUrl,
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