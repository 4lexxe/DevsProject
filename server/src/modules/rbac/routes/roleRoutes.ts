import { Router } from 'express';
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from '../controllers/role.controller';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import {
  createRoleValidation,
  updateRoleValidation,
  getRoleByIdValidation,
  deleteRoleValidation
} from '../validators/role.validators';

const router = Router();

// Rutas públicas (solo lectura básica para algunos casos)
router.get('/', 
  authMiddleware,
  getRoles
);

router.get('/:id', 
  authMiddleware,
  getRoleByIdValidation,
  getRoleById
);

// Rutas protegidas (requieren permisos administrativos)
router.post('/',
  authMiddleware,
  createRoleValidation,
  createRole
);

router.put('/:id',
  authMiddleware,
  updateRoleValidation,
  updateRole
);

router.delete('/:id',
  authMiddleware,
  deleteRoleValidation,
  deleteRole
);

export default router;
