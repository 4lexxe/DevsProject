// server/src/modules/forum/routes/forumpost.routes.ts

import { Router, RequestHandler } from "express";
import { ForumPostController } from '../controllers/ForumPostController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { ContentType } from '../models/ForumPost';

const router = Router();

// Rutas públicas
router.get('/posts', ForumPostController.getPosts);
router.get('/posts/popular', ForumPostController.getPopularPosts);
router.get('/posts/:id', ForumPostController.getPostDetail);

// Ruta para filtros avanzados
router.get('/posts/filter', ForumPostController.getFilteredPosts);

// Ruta para crear post - ahora acepta un parámetro type en la query para preseleccionar el tipo de contenido
router.post('/posts',
  authMiddleware,
  ForumPostController.postValidations,
  ForumPostController.createPost as RequestHandler
);

// Rutas para crear tipos específicos de post (ayudan con enrutamiento en el frontend)
router.post('/posts/submit',
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