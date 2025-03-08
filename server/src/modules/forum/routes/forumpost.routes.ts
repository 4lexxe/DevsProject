// server/src/modules/forum/routes/forumpost.routes.ts

import { Router, RequestHandler } from "express";
import { ForumPostController } from '../controllers/ForumPostController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/posts/popular', ForumPostController.getPopularPosts);
router.get('/posts/:id', ForumPostController.getPostById);

// Nueva ruta para obtener publicaciones por hilo
router.get('/threads/:threadId/posts', ForumPostController.getPostsByThread);

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

export default router;