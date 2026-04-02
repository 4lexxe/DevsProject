import { Router } from 'express';
import { UserController } from '../user/userController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { geoMiddleware } from '../../shared/middleware/geo.middleware';
import validatorUser from './validators/userValidator';
import subscriptionDataValidator from './validators/SubscriptionDataValidator';


import { requirePermission } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Middleware de geolocalización (opcional, aplica según necesidad)
router.use(geoMiddleware);

// Rutas públicas (datos básicos únicamente)
router.get('/users/public', UserController.getPublicUsers);
router.get('/users/public/:id', UserController.getPublicUserById);

// Rutas protegidas (requieren permisos administrativos)
router.get('/users',
  authMiddleware,
  requirePermission('user:view'),
  UserController.getUsers
);

router.get('/users/:id',
  authMiddleware,
  requirePermission('user:view'),
  UserController.getUserById
);

// Rutas que requieren autenticación y permisos específicos
router.get('/users/:id/security',
  authMiddleware,
  requirePermission('user:view'),
  UserController.getUserSecurityDetails
);

//Actualizar datos necesarios del usuario para la suscripción
router.put('/users/:id/subscription',
  authMiddleware,
  requirePermission('user:update'),
  subscriptionDataValidator,
  UserController.updateForSubscription
);

router.put('/users/:id',
  authMiddleware, // Requiere autenticación
  requirePermission('user:update'),
  validatorUser,
  UserController.updateUser
);

router.delete('/users/:id',
  authMiddleware,
  requirePermission('user:delete'),
  UserController.deleteUser
);

export default router;