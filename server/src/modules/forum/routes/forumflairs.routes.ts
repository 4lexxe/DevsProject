import { Router } from 'express';
import { ForumFlairController } from '../controllers/forumFlairController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Rutas básicas de flairs
router.get('/flairs', ForumFlairController.getAllFlairs);
router.get('/flairs/type/:type', ForumFlairController.getFlairsByType);
router.get('/flairs/:id', ForumFlairController.getFlairById);
router.post('/flairs', authMiddleware, ForumFlairController.createFlair);
router.put('/flairs/:id', authMiddleware, ForumFlairController.updateFlair);
router.delete('/flairs/:id', authMiddleware, ForumFlairController.deleteFlair);

// Rutas de flairs para usuarios
router.get('/users/:userId/flairs', ForumFlairController.getUserFlairs);
router.post(
  '/users/:userId/flairs/:flairId',
  authMiddleware,
  ForumFlairController.assignFlairToUser
);
router.delete(
  '/users/:userId/flairs/:flairId',
  authMiddleware,
  ForumFlairController.removeFlairFromUser
);

// Rutas de flairs para posts
router.get('/posts/:postId/flairs', ForumFlairController.getPostFlairs);
router.post(
  '/posts/:postId/flairs/:flairId',
  authMiddleware,
  ForumFlairController.assignFlairToPost
);
router.delete(
  '/posts/:postId/flairs/:flairId',
  authMiddleware,
  ForumFlairController.removeFlairFromPost
);

export default router;