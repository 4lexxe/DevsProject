import { Router } from 'express';
import { UserController } from './userController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { checkRole } from '../../shared/middleware/checkRole';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas que requieren rol de administrador
router.get('/users', checkRole(['admin']), UserController.getUsers);
router.get('/users/:id', checkRole(['admin']), UserController.getUserById);
router.put('/users/:id', 
  checkRole(['admin']), 
  UserController.userValidations,
  UserController.updateUser
);
router.delete('/users/:id', checkRole(['admin']), UserController.deleteUser);

export default router;