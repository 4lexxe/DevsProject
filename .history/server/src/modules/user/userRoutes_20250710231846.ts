import { Router } from 'express';
import { UserController } from '../user/userController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { geoMiddleware } from '../../shared/middleware/geo.middleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Middleware de geolocalización (opcional, aplica según necesidad)
router.use(geoMiddleware);

// Rutas públicas (datos básicos únicamente)
router.get('/users/public', UserController.getPublicUsers);
router.get('/users/public/:id', UserController.getPublicUserById);

// Rutas protegidas (requieren permisos administrativos)
router.get('/users', 
  authMiddleware,
  permissionsMiddleware(['read:users', 'manage:all_users']),
  UserController.getUsers
);

router.get('/users/:id', 
  authMiddleware,
  permissionsMiddleware(['read:users', 'manage:all_users']),
  UserController.getUserById
);

// Rutas que requieren autenticación y permisos específicos
router.get('/users/:id/security',
  authMiddleware,
  permissionsMiddleware(['read:users', 'manage:all_users']),
  UserController.getUserSecurityDetails
);

router.put('/users/:id', 
  authMiddleware,
  permissionsMiddleware(['write:users', 'manage:all_users']),
  ...UserController.userValidations, 
  UserController.updateUser
);

router.delete('/users/:id', 
  authMiddleware,
  permissionsMiddleware(['delete:users']),
  UserController.deleteUser
);

export default router;