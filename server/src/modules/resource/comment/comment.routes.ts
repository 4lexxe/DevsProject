import express from 'express';
import { CommentController } from './comment.controller';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = express.Router();

// Rutas públicas
router.get('/resource/:resourceId', CommentController.getCommentsByResource);

// Rutas protegidas
router.post('/', 
  authMiddleware,
  CommentController.commentValidations, 
  CommentController.createComment
);

router.put('/:id', 
  authMiddleware,
  CommentController.commentValidations, 
  CommentController.updateComment
);

router.delete('/:id', 
  authMiddleware,
  CommentController.deleteComment
);

export default router;