import { Router, RequestHandler } from "express";
import { ForumVotePostController } from '../controllers/ForumVotePostController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Route to get all votes for a specific post
router.get('/posts/:postId/votes', ForumVotePostController.getVotesByPost);

// Route to get a user's vote for a specific post
router.get('/posts/:postId/votes/user', authMiddleware, ForumVotePostController.getUserVoteForPost as RequestHandler);

// Route to add a vote to a post
router.post('/posts/:postId/vote', authMiddleware, ForumVotePostController.voteOnPost as RequestHandler);

// Route to update a vote on a post
router.put('/posts/:postId/vote', authMiddleware, ForumVotePostController.updateVotePost as RequestHandler);

// Route to delete a vote from a post
router.delete('/posts/:postId/vote', authMiddleware, ForumVotePostController.deleteVotePost as RequestHandler);

// Route to get vote statistics for a post
router.get('/posts/:postId/vote-stats', ForumVotePostController.getPostVoteStats);

export default router;