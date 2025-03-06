import { Router } from 'express';
import { ForumReplyController } from '../controllers/ForumReplyController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Rutas principales para replies
router.post(
  '/posts/:postId/replies', 
  authMiddleware, 
  ForumReplyController.replyValidations, 
  ForumReplyController.createReply
);

// Obtener respuestas paginadas y anidadas de un post
router.get(
  '/posts/:postId/replies',
  ForumReplyController.getPaginatedNestedReplies // Reemplaza getAllReplies
);

// Carga bajo demanda de respuestas hijas
router.get(
  '/replies/:parentReplyId/children',
  ForumReplyController.getMoreChildren // Nueva ruta para hijos adicionales
);

// Resto de rutas
router.get('/replies/popular', ForumReplyController.getPopularReplies);
router.get('/replies/:replyId', ForumReplyController.getReplyById);
router.put(
  '/replies/:replyId', 
  authMiddleware, 
  ForumReplyController.replyValidations, 
  ForumReplyController.updateReply
);
router.delete(
  '/replies/:replyId', 
  authMiddleware, 
  ForumReplyController.deleteReply
);

export default router;