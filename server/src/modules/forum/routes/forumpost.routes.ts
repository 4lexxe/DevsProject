// server/src/modules/forum/routes/ForumPostRoutes.ts
import { Router, RequestHandler } from "express";
import { ForumPostController } from '../controllers/ForumPostController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/posts/popular', ForumPostController.getPopularPosts);
router.get('/posts/:id', ForumPostController.getPostById);

// Rutas autenticadas con validaciones
router.post('/posts',
  authMiddleware,
  ForumPostController.postValidations,
  ForumPostController.createPost as RequestHandler
);

router.put('/posts/:id',
  authMiddleware,
  ForumPostController.postValidations,
  ForumPostController.updatePost as RequestHandler
);

router.delete('/posts/:id',
  authMiddleware,
  ForumPostController.deletePost as RequestHandler
);

// Rutas para modificar estados específicos
router.patch('/posts/:id/nsfw',
  authMiddleware,
  ForumPostController.toggleNSFWStatus as RequestHandler
);

router.patch('/posts/:id/spoiler',
  authMiddleware,
  ForumPostController.toggleSpoilerStatus as RequestHandler
);

export default router;