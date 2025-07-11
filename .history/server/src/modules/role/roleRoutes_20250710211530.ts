import { Router } from 'express';
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from './roleController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Rutas públicas (solo lectura básica para algunos casos)
router.get('/roles', 
  authMiddleware,
  permissionsMiddleware(['read:users', 'manage:roles']),
  getRoles
);

router.get('/roles/:id', 
  authMiddleware,
  permissionsMiddleware(['read:users', 'manage:roles']),
  getRoleById
);

// Rutas protegidas (requieren permisos administrativos)
router.post('/roles',
  authMiddleware,
  permissionsMiddleware(['manage:roles']),
  createRole
);

router.put('/roles/:id',
  authMiddleware,
  permissionsMiddleware(['manage:roles']),
  updateRole
);

router.delete('/roles/:id',
  authMiddleware,
  permissionsMiddleware(['delete:roles']),
  deleteRole
);

export default router;
