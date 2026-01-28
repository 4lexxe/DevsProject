import { Router } from 'express';
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignRoleToUser,
} from '../controllers/role.controller';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import {
  createRoleValidation,
  updateRoleValidation,
  getRoleByIdValidation,
  deleteRoleValidation,
  assignRoleToUserValidation
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

// Asignar rol a usuario
router.put('/assign-user/:userId',
  authMiddleware,
  assignRoleToUserValidation,
  assignRoleToUser
);

export default router;
