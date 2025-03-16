// server/src/modules/forum/routes/forumCategory.routes.ts
import express from 'express';
import { ForumCategoryController } from '../controllers/forumCategoryController';
import { RequestHandler } from 'express';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = express.Router();

// Rutas públicas
router.get('/categories', ForumCategoryController.getAllCategories as RequestHandler);
router.get('/categories/:id', ForumCategoryController.getCategoryById as RequestHandler);

// Rutas protegidas con autenticación y validaciones
router.post(
  '/categories',
  authMiddleware,
  ForumCategoryController.createCategory as RequestHandler
);

router.put(
  '/categories/:id',
  authMiddleware,
  ForumCategoryController.updateCategory as RequestHandler
);

router.delete(
  '/categories/:id',
  authMiddleware,
  ForumCategoryController.deleteCategory as RequestHandler
);

export default router;