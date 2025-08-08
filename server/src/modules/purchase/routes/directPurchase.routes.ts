import { Router } from 'express';
import DirectPurchaseController from '../controllers/directPurchase.controller';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Verificar si un curso es gratuito (público)
router.get('/course/:courseId/check-free', DirectPurchaseController.checkIfCourseFree);

// Verificar si el usuario tiene acceso a un curso (requiere autenticación)
router.get('/course/:courseId/check-access', 
  authMiddleware, 
  DirectPurchaseController.checkCourseAccess
);

// Otorgar acceso automático a curso gratuito (requiere autenticación)
router.post('/course/:courseId/grant-free-access', 
  authMiddleware, 
  DirectPurchaseController.grantFreeCourseAccess
);

// Compra directa de curso (requiere autenticación)
router.post('/course/:courseId/direct-purchase', 
  authMiddleware, 
  DirectPurchaseController.directPurchase
);

export default router;