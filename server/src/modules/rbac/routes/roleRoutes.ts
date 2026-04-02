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

import { requirePermission } from '../../../shared/middleware/permissionsMiddleware';

const router = Router();

router.get('/',
  authMiddleware,
  requirePermission('role:view'),
  getRoles
);

router.get('/:id',
  authMiddleware,
  requirePermission('role:view'),
  getRoleByIdValidation,
  getRoleById
);

router.post('/',
  authMiddleware,
  requirePermission('role:create'),
  createRoleValidation,
  createRole
);

router.put('/:id',
  authMiddleware,
  requirePermission('role:update'),
  updateRoleValidation,
  updateRole
);

router.delete('/:id',
  authMiddleware,
  requirePermission('role:delete'),
  deleteRoleValidation,
  deleteRole
);

// Asignar rol a usuario
router.put('/assign-user/:userId',
  authMiddleware,
  requirePermission('role:assign'),
  assignRoleToUserValidation,
  assignRoleToUser
);

export default router;
