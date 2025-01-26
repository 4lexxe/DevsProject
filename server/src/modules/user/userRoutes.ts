// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../user/userController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { geoMiddleware } from '../../shared/middleware/geo.middleware';
import { RequestHandler } from 'express';

const router = Router();

// Middlewares
router.use(authMiddleware);
router.use(geoMiddleware);

// Configuración de rutas
router.get('/users', 
  UserController.getUsers as RequestHandler
);

router.get('/users/:id/security',
  ((
    req: import('express').Request,
    res: import('express').Response,
    next: import('express').NextFunction
  ) => {
    if (!req.user?.hasPermission('VIEW_SECURITY_DETAILS')) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  }) as RequestHandler,
  UserController.getUserSecurityDetails as RequestHandler
);

router.put('/users/:id',
  ...(UserController.userValidations as RequestHandler[]),
  UserController.updateUser as RequestHandler
);

router.delete('/users/:id',
  UserController.deleteUser as RequestHandler
);

export default router;