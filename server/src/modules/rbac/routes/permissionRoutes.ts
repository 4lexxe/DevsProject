import { Router } from 'express';
import { getAllPermissions } from '../controllers/permission.controller';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Obtener todos los permisos disponibles
router.get('/', 
  authMiddleware,
  getAllPermissions
);

export default router;
