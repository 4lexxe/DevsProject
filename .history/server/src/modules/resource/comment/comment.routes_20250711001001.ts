import express from 'express';
import { CommentController } from './comment.controller';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../../shared/middleware/permissionsMiddleware';

const router = express.Router();

// Rutas públicas
router.get('/resource/:resourceId', CommentController.getCommentsByResource);

// Rutas protegidas
router.post('/', 
  authMiddleware,
  permissionsMiddleware(['comment:resources']),
  CommentController.commentValidations, 
  CommentController.createComment
);

router.put('/:id', 
  authMiddleware,
  permissionsMiddleware(['manage:own_comments', 'moderate:all_comments']),
  CommentController.commentValidations, 
  CommentController.updateComment
);

router.delete('/:id', 
  authMiddleware,
  permissionsMiddleware(['manage:own_comments', 'moderate:all_comments']),
  CommentController.deleteComment
);

export default router;