import { Router } from 'express';
import { ForumReplyController } from '../controllers/ForumReplyController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware'; // Import your auth middleware

const router = Router();

// Define routes for ForumReplyController
// Obtener las respuestas populares
router.get('/replies/popular', ForumReplyController.getPopularReplies);
router.get('/replies', ForumReplyController.getAllReplies); // Get all replies
router.post('/replies', authMiddleware, ForumReplyController.createReply); // Create a new reply
router.get('/replies/:replyId', ForumReplyController.getReplyById); // Get a specific reply by ID
router.put('/replies/:replyId', authMiddleware, ForumReplyController.replyValidations, ForumReplyController.updateReply); // Update a specific reply
router.delete('/replies/:replyId', authMiddleware, ForumReplyController.deleteReply); // Delete a specific reply

export default router;