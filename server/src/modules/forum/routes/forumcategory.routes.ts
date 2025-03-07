// server/src/modules/forum/routes/forumcategory.routes.ts
import express from 'express';
import { ForumCategoryController } from '../controllers/forumCategoryController';
import { body } from 'express-validator';
import { RequestHandler } from 'express';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get('/categories', ForumCategoryController.getAllCategories);
router.get('/categories/:id', ForumCategoryController.getCategoryById);

// Rutas que requieren autenticación y permisos de administrador
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

router.patch(
  '/categories/reorder', 
  [
    body('order')
      .isArray().withMessage('El orden debe ser un array')
      .custom(order => {
        return order.every((item: any) => 
          typeof item === 'object' && 
          !isNaN(Number(item.id)) && 
          !isNaN(Number(item.displayOrder))
        );
      }).withMessage('Cada elemento del orden debe tener id y displayOrder válidos')
  ],
  authMiddleware,
  ForumCategoryController.reorderCategories as RequestHandler
);

export default router;