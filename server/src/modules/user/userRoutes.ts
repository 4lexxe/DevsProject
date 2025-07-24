import { Router } from 'express';
import { UserController } from '../user/userController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { geoMiddleware } from '../../shared/middleware/geo.middleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';
import validatorUser from './validators/userValidator';
import subscriptionDataValidator from './validators/subscriptionDataValidator';


const router = Router();

// Middleware de geolocalización (opcional, aplica según necesidad)
router.use(geoMiddleware);

// Rutas públicas
router.get('/users', UserController.getUsers); // Obtener todos los usuarios (público)
router.get('/users/:id', UserController.getUserById); // Obtener un usuario por ID (público)

// Rutas que requieren autenticación y permisos
router.get('/users/:id/security',
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['view:security_details']),  // Verificar permisos
  UserController.getUserSecurityDetails
);

//Actualizar datos necesarios del usuario para la suscripción
router.put('/users/:id/subscription',  subscriptionDataValidator, UserController.updateForSubscription);

router.put('/users/:id', 
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  validatorUser,
  UserController.updateUser
);

router.delete('/users/:id', 
  authMiddleware, // Requiere autenticación
  checkRole(['admin', 'superadmin']),  // Verificar roles (como en adminRoutes.ts)
  UserController.deleteUser
);

export default router;