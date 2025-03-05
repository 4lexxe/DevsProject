import { Router } from 'express';
import { UserController } from '../user/userController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { geoMiddleware } from '../../shared/middleware/geo.middleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Middleware de geolocalización (opcional, aplica según necesidad)
router.use(geoMiddleware);

// Rutas públicas
router.get('/users', UserController.getUsers); // Obtener todos los usuarios (público)
router.get('/users/:id', UserController.getUserById); // Obtener un usuario por ID (público)

// Nueva ruta para obtener los permisos de un usuario
router.get('/users/:id/permissions',
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['read:permissions', 'manage:users']), // Verificar permisos
  UserController.getUserPermissions
);

// Rutas para permisos personalizados (deben definirse antes de las rutas dinámicas)
router.post('/users/assign-permission',
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  UserController.assignCustomPermission
);

router.post('/users/block-permission',
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  UserController.blockPermission
);

router.delete('/users/unblock-permission',
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  UserController.unblockPermission
);

// Rutas que requieren autenticación y permisos
router.get('/users/:id/security',
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['read:courses']),  // Verificar permisos
  UserController.getUserSecurityDetails
);

router.put('/users/:id', 
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  ...UserController.userValidations, 
  UserController.updateUser
);

router.delete('/users/:id', 
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  UserController.deleteUser
);

export default router;