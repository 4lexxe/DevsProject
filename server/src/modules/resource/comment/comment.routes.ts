import express from 'express';
import { CommentController } from './comment.controller';

const router = express.Router();

// Crear un nuevo comentario (POST /comments)
router.post('/', CommentController.commentValidations, CommentController.createComment);

// Obtener todos los comentarios de un recurso (GET /comments/resource/:resourceId)
router.get('/resource/:resourceId', CommentController.getCommentsByResource);

// Actualizar un comentario (PUT /comments/:id)
router.put('/:id', CommentController.commentValidations, CommentController.updateComment);

// Eliminar un comentario (DELETE /comments/:id)
router.delete('/:id', CommentController.deleteComment);

export default router;