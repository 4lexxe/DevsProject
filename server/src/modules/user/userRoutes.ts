import { Router } from 'express';
import { UserController } from '../user/userController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { geoMiddleware } from '../../shared/middleware/geo.middleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';
import validatorUser from './validators/userValidator';
import subscriptionDataValidator from './validators/SubscriptionDataValidator';
<<<<<<< HEAD
=======
import { checkRole } from './../../shared/middleware/checkRole';
>>>>>>> feature/dashboard


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

//Actualizar datos necesarios del usuario para la suscripción
router.put('/users/:id/subscription',  subscriptionDataValidator, UserController.updateForSubscription);

router.put('/users/:id', 
  authMiddleware, // Requiere autenticación
  permissionsMiddleware(['manage:users']),  // Verificar permisos
  validatorUser,
<<<<<<< HEAD
  authMiddleware,
  permissionsMiddleware(['write:users', 'manage:all_users']),
=======
>>>>>>> feature/dashboard
  UserController.updateUser
);

router.delete('/users/:id', 
<<<<<<< HEAD
  authMiddleware,
  permissionsMiddleware(['delete:users']),
=======
  authMiddleware, // Requiere autenticación
  checkRole(['admin', 'superadmin']),  // Verificar roles (como en adminRoutes.ts)
>>>>>>> feature/dashboard
  UserController.deleteUser
);

export default router;