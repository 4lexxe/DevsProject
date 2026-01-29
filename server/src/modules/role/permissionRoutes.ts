import { Router } from 'express';
import {
  createPermission,
  getPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
} from './permissionController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Rutas para permisos
router.get('/permissions', 
  authMiddleware,
  permissionsMiddleware(['read:users', 'manage:permissions']),
  getPermissions
);

router.get('/permissions/:id', 
  authMiddleware,
  permissionsMiddleware(['read:users', 'manage:permissions']),
  getPermissionById
);

// Rutas protegidas (requieren permisos administrativos)
router.post('/permissions',
  authMiddleware,
  permissionsMiddleware(['manage:permissions']),
  createPermission
);

router.put('/permissions/:id',
  authMiddleware,
  permissionsMiddleware(['manage:permissions']),
  updatePermission
);

router.delete('/permissions/:id',
  authMiddleware,
  permissionsMiddleware(['delete:permissions']),
  deletePermission
);

export default router;
