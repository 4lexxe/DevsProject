// server/src/modules/forum/routes/forumpost.routes.ts

import { Router, RequestHandler } from "express";
import { ForumPostController } from '../controllers/ForumPostController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/posts', ForumPostController.getPosts);
router.get('/posts/popular', ForumPostController.getPopularPosts);
router.get('/posts/:id', ForumPostController.getPostDetail);

// Rutas autenticadas con validaciones
router.post('/posts',
  authMiddleware,
  ForumPostController.postValidations,
  ForumPostController.createPost as RequestHandler
);

// Ruta para actualizar un post existente
router.put('/posts/:id',
  authMiddleware,
  ForumPostController.postValidations,
  ForumPostController.updatePost as RequestHandler
);

// Rutas para actualizar estados especiales de posts
router.put('/posts/:id/pin',
  authMiddleware,
  ForumPostController.updatePostStatus as RequestHandler
);

router.put('/posts/:id/lock',
  authMiddleware,
  ForumPostController.updatePostStatus as RequestHandler
);

router.put('/posts/:id/announcement',
  authMiddleware,
  ForumPostController.updatePostStatus as RequestHandler
);

router.delete('/posts/:id',
  authMiddleware,
  ForumPostController.deletePost as RequestHandler
);

export default router;