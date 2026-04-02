import { Router } from 'express';
import { getAllPermissions } from '../controllers/permission.controller';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

import { requirePermission } from '../../../shared/middleware/permissionsMiddleware';

const router = Router();

// Obtener todos los permisos disponibles
router.get('/',
  authMiddleware,
  requirePermission('permission:view'),
  getAllPermissions
);

export default router;
