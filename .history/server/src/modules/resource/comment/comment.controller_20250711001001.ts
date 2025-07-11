import { Request, Response } from 'express';
import Comment from '../comment/Comment';
import Resource from '../Resource';
import User from '../../user/User';
import { body, validationResult } from 'express-validator';

export class CommentController {
  // Validaciones para los datos de entrada
  static commentValidations = [
    body('content').notEmpty().withMessage('El contenido del comentario es obligatorio'),
  ];

  // Crear un nuevo comentario (requiere autenticación)
  static async createComment(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User;
      if (!user) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { resourceId, content } = req.body;
      const userId = user.id;

      // Verificar si el recurso existe
      const resource = await Resource.findByPk(resourceId);
      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      // Crear el nuevo comentario
      const comment = await Comment.create({
        userId,
        resourceId,
        content,
      });

      res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Error al crear el comentario' });
    }
  }

  // Obtener todos los comentarios de un recurso (público)
  static async getCommentsByResource(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;

      // Verificar si el recurso existe
      const resource = await Resource.findByPk(resourceId);
      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      // Obtener todos los comentarios del recurso
      const comments = await Comment.findAll({
        where: { resourceId },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['id', 'name', 'username', 'displayName', 'avatar'], // Agregamos avatar
          },
        ],
      });

      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments by resource:', error);
      res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
  }

  // Función helper para verificar permisos de propietario o moderador
  private static canModifyComment(user: User, comment: any): { canModify: boolean; reason?: string } {
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    const isOwner = comment.userId === user.id;
    const canModerateAll = userPermissions.includes('moderate:all_comments') || user.Role?.name === 'superadmin';
    const canManageOwn = userPermissions.includes('manage:own_comments');

    if (canModerateAll) {
      return { canModify: true };
    }

    if (isOwner && canManageOwn) {
      return { canModify: true };
    }

    if (!isOwner) {
      return { canModify: false, reason: 'Solo el propietario del comentario puede modificarlo' };
    }

    return { canModify: false, reason: 'No tienes permisos para gestionar comentarios' };
  }

  // Actualizar un comentario (requiere ser propietario o tener permisos de moderador)
  static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User;
      if (!user) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { content } = req.body;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        res.status(404).json({ error: 'Comentario no encontrado' });
        return;
      }

      // Verificar permisos usando la función helper
      const { canModify, reason } = this.canModifyComment(user, comment);
      if (!canModify) {
        res.status(403).json({ error: reason });
        return;
      }

      await comment.update({ content });

      res.json(await Comment.findByPk(id, {
        include: [{
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'username', 'displayName', 'avatar'],
        }],
      }));
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'Error al actualizar el comentario' });
    }
  }

  // Eliminar un comentario (requiere ser propietario o tener permisos de moderador)
  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User;
      if (!user) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { id } = req.params;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        res.status(404).json({ error: 'Comentario no encontrado' });
        return;
      }

      // Verificar permisos usando la función helper
      const { canModify, reason } = this.canModifyComment(user, comment);
      if (!canModify) {
        res.status(403).json({ error: reason });
        return;
      }

      await comment.destroy();
      res.json({ message: 'Comentario eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Error al eliminar el comentario' });
    }
  }
}