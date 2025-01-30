// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../user/userController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { geoMiddleware } from '../../shared/middleware/geo.middleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware'; // Importa el middleware de permisos

const router = Router();

// Middleware de autenticación
router.use(authMiddleware);
router.use(geoMiddleware);

// Configuración de rutas

// Obtener la lista de usuarios (requiere permisos de 'read:users')
router.get('/users', 
  permissionsMiddleware(['read:users']),  // Verificar permisos
  UserController.getUsers
);

// Obtener los detalles de seguridad de un usuario (requiere permisos de 'view:security_details')
router.get('/users/:id/security',
  permissionsMiddleware(['view:security_details']),  // Verificar permisos
  UserController.getUserSecurityDetails
);

// Actualizar un usuario (requiere permisos de 'manage:users')
router.put('/users/:id', 
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  ...UserController.userValidations, 
  UserController.updateUser
);

// Eliminar un usuario (requiere permisos de 'manage:users')
router.delete('/users/:id', 
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  UserController.deleteUser
);

export default router;