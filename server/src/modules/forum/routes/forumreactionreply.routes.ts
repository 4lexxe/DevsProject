// server/src/modules/forum/routes/ForumReactionReplyRoutes.ts
import { Router, RequestHandler } from "express";
import { 
  getReactionsByReply,
  addReactionToReply,
  removeReactionFromReply
} from '../controllers/ForumReactionReplyController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Obtener reacciones de una respuesta
router.get('/replies/:replyId/reactions', 
  getReactionsByReply as RequestHandler
);

// Agregar reacción a una respuesta (autenticación requerida)
router.post('/replies/:replyId/reactions',
  authMiddleware,
  addReactionToReply as RequestHandler
);

// Eliminar reacción de una respuesta (autenticación requerida)
router.delete('/replies/:replyId/reactions/:emojiId',
  authMiddleware,
  removeReactionFromReply as RequestHandler
);

export default router;