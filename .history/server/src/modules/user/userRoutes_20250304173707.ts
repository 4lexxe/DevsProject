import { Router } from 'express';
import { UserController } from '../user/userController';
import { geoMiddleware } from '../../shared/middleware/geo.middleware';

const router = Router();

// Middleware de geolocalización (opcional, aplica según necesidad)
router.use(geoMiddleware);

// Rutas públicas
router.get('/users', UserController.getUsers); // Obtener todos los usuarios (público)
router.get('/users/:id', UserController.getUserById); // Obtener un usuario por ID (público)

// Nueva ruta para obtener los permisos de un usuario (sin autenticación por ahora)
router.get('/users/:id/permissions', UserController.getUserPermissions);

// Rutas para permisos personalizados (sin autenticación por ahora)
router.post('/users/assign-permission', UserController.assignCustomPermission);
router.post('/users/block-permission', UserController.blockPermission);
router.delete('/users/unblock-permission', UserController.unblockPermission);

// Otras rutas (sin autenticación por ahora)
router.get('/users/:id/security', UserController.getUserSecurityDetails);
router.put('/users/:id', ...UserController.userValidations, UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

export default router;