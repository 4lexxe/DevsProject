// auth.route.ts

// Descripción: En este archivo se definen las rutas relacionadas con la autenticación y autorización de usuarios. Estas rutas se utilizan para manejar las operaciones de registro, inicio de sesión, verificación de autenticación, autenticación OAuth, gestión de sesiones y tokens, entre otras funcionalidades relacionadas con la autenticación y autorización de usuarios en la aplicación.

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { Request, Response } from 'express';

const router = Router();

// Rutas de autenticación local (email)
router.post('/register', 
  AuthController.registerValidations,
  (req: Request, res: Response) => AuthController.register(req, res)
);

router.post('/login',
  AuthController.loginValidations,
  (req: Request, res: Response) => AuthController.login(req, res)
);

// Rutas existentes de Discord
router.get('/discord/login', AuthController.discordAuth);
router.get('/discord/callback', AuthController.discordCallback);
router.get('/discord/register', AuthController.discordAuth);

// Rutas existentes de GitHub
router.get('/github/login', AuthController.githubAuth);
router.get('/github/callback', AuthController.githubCallback);
router.get('/github/register', AuthController.githubAuth);

// Otras rutas existentes
router.get('/verify', (req: Request, res: Response) => AuthController.verifyAuth(req, res));

router.delete('/logout', (req: Request, res: Response) => AuthController.logout(req, res));

export default router;