// server/src/modules/forum/routes/ForumThreadRoutes.ts
import { Router, RequestHandler } from "express";
import { ForumThreadController } from '../controllers/ForumThreadController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/threads', ForumThreadController.getAllThreads);
router.get('/threads/popular', ForumThreadController.getPopularThreads);
router.get('/threads/:id', ForumThreadController.getThreadById);
router.get('/threads/:threadId/posts', ForumThreadController.getThreadPosts);

// Rutas autenticadas con validaciones
router.post('/threads',
  authMiddleware,
  ForumThreadController.threadValidations,
  ForumThreadController.createThread as RequestHandler
);

router.put('/threads/:id',
  authMiddleware,
  ForumThreadController.threadValidations,
  ForumThreadController.updateThread as RequestHandler
);

router.delete('/threads/:id',
  authMiddleware,
  ForumThreadController.deleteThread as RequestHandler
);

// Rutas para moderación de hilos
router.patch('/threads/:id/pin',
  authMiddleware,
  ForumThreadController.pinThread as RequestHandler
);

router.patch('/threads/:id/lock',
  authMiddleware,
  ForumThreadController.lockThread as RequestHandler
);

router.patch('/threads/:id/announcement',
  authMiddleware,
  ForumThreadController.toggleAnnouncementStatus as RequestHandler
);

export default router;