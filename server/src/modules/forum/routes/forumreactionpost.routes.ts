// server/src/modules/forum/routes/ForumReactionPostRoutes.ts
import { Router, RequestHandler } from "express";
import { 
  getReactionsByPost,
  addReactionToPost,
  removeReactionFromPost
} from '../controllers/ForumReactionPostController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Obtener reacciones de un post
router.get('/posts/:postId/reactions', 
  getReactionsByPost as RequestHandler
);

// Agregar reacción a un post (autenticación requerida)
router.post('/posts/:postId/reactions',
  authMiddleware,
  addReactionToPost as RequestHandler
);

// Eliminar reacción de un post (autenticación requerida)
router.delete('/posts/:postId/reactions/:emojiId',
  authMiddleware,
  removeReactionFromPost as RequestHandler
);

export default router;