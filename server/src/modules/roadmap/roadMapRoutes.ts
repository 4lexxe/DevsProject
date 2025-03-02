import { Router, Request, Response, NextFunction } from 'express';
import { RoadmapController } from './roadMapController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { AuthRequest } from './roadMapController';
import { RequestHandler } from 'express';
import User from "../../modules/user/User";
import Roadmap from "../../modules/roadmap/RoadMap";
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';

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

interface CustomRequest extends Request {
  user?: User;
  roadmap?: Roadmap;
}

const checkPublicRoadmap: RequestHandler = async (req, res, next) => {
  try {
    const roadmapId = req.params.id;
    const roadmap = await Roadmap.findByPk(roadmapId);

    if (!roadmap) {
      res.status(404).json({ message: 'Roadmap no encontrado' });
      return;
    }

    if (!roadmap.isPublic) {
      const customReq = req as CustomRequest;
      if (!customReq.user) {
        res.status(401).json({ message: 'No autorizado' });
        return ;
      }
      if (roadmap.userId !== customReq.user.id) {
        res.status(403).json({ message: 'Prohibido' });
        return;
      }
    }

    (req as CustomRequest).roadmap = roadmap;
    next();
  } catch (error) {
    next(error);
  }
};

// The routes remain the same
// Rutas públicas
router.get('/roadmaps',permissionsMiddleware(['read:courses']),  handleRoute(RoadmapController.getAll));
router.get('/roadmaps/:id', checkPublicRoadmap, permissionsMiddleware(['read:courses']), handleRoute(RoadmapController.getById));

// Rutas protegidas
router.use(authMiddleware);

router.post('/roadmaps', handleRoute(RoadmapController.create));
router.put('/roadmaps/:id', handleRoute(RoadmapController.update));
router.delete('/roadmaps/:id', handleRoute(RoadmapController.delete));

export default router;