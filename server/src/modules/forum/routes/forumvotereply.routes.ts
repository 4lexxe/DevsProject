import { RequestHandler, Router } from "express";
import { ForumVoteReplyController } from '../controllers/forumVoteReplyController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Ruta para obtener todos los votos de una respuesta específica
router.get('/replies/:replyId/votes', ForumVoteReplyController.getReplyVotes);

// Ruta para obtener el voto de un usuario para una respuesta específica (requiere autenticación)
router.get('/replies/:replyId/votes/user', authMiddleware, ForumVoteReplyController.getUserReplyVote as RequestHandler);

// Ruta para votar en una respuesta (requiere autenticación)
router.post('/replies/:replyId/vote', authMiddleware, ForumVoteReplyController.voteReply as RequestHandler);

// Ruta para actualizar un voto en una respuesta (requiere autenticación)
router.put('/replies/:replyId/vote', authMiddleware, ForumVoteReplyController.updateVoteReply as RequestHandler);

// Ruta para eliminar un voto de una respuesta (requiere autenticación)
router.delete('/replies/:replyId/vote', authMiddleware, ForumVoteReplyController.deleteReplyVote as RequestHandler);

// Ruta para obtener estadísticas de votos de una respuesta
router.get('/replies/:replyId/vote-stats', ForumVoteReplyController.getReplyVoteStats);

export default router;