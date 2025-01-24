import { Router } from 'express';
import { AuthController } from '../controllers/authController';
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