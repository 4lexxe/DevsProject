import { Router, Request, Response, NextFunction } from 'express';
import { RoadmapController } from './roadMapController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { AuthRequest } from './roadMapController';

const router = Router();

// Helper para convertir Request a AuthRequest
const handleRoute = (handler: (req: AuthRequest, res: Response) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as AuthRequest, res);
    } catch (error) {
      next(error);
    }
  };
};

// Rutas públicas
router.get('/roadmaps', handleRoute(RoadmapController.getAll));
router.get('/roadmaps/:id', handleRoute(RoadmapController.getById));

// Rutas protegidas
router.use(authMiddleware);

router.post('/roadmaps', handleRoute(RoadmapController.create));
router.put('/roadmaps/:id', handleRoute(RoadmapController.update));
router.delete('/roadmaps/:id', handleRoute(RoadmapController.delete));

export default router;