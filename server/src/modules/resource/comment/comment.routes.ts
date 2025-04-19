import express from 'express';
import { CommentController } from './comment.controller';
import { permissionsMiddleware } from '../../../shared/middleware/permissionsMiddleware';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = express.Router();

// Crear un nuevo comentario (POST /comments)
router.post('/',
  authMiddleware,
  permissionsMiddleware(['comment:resources']),
  CommentController.commentValidations,
  CommentController.createComment);

// Obtener todos los comentarios de un recurso (GET /comments/resource/:resourceId)
router.get('/resource/:resourceId', CommentController.getCommentsByResource);

// Actualizar un comentario (PUT /comments/:id)
router.put('/:id',
  authMiddleware,
  permissionsMiddleware(['comment:resources']),
  CommentController.commentValidations, 
  CommentController.updateComment);

// Eliminar un comentario (DELETE /comments/:id)
router.delete('/:id',
  authMiddleware,
  permissionsMiddleware(['comment:resources']),
  CommentController.deleteComment);

export default router;