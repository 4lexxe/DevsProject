import { Router } from 'express';
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from './roleController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

const router = Router();

// Rutas públicas (solo lectura básica para algunos casos)
router.get('/roles', 
  authMiddleware,
  getRoles
);

router.get('/roles/:id', 
  authMiddleware,
  getRoleById
);

// Rutas protegidas (requieren permisos administrativos)
router.post('/roles',
  authMiddleware,
  createRole
);

router.put('/roles/:id',
  authMiddleware,
  updateRole
);

router.delete('/roles/:id',
  authMiddleware,
  deleteRole
);

export default router;
