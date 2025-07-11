import { Router, RequestHandler } from "express";
import RatingController from "./rating.controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { permissionsMiddleware } from "../../../shared/middleware/permissionsMiddleware";
import { geoMiddleware } from "../../../shared/middleware/geo.middleware";

const router = Router();

// Middleware global de geolocalización (opcional)
router.use(geoMiddleware);

// Rutas públicas
router.get("/:resourceId", RatingController.getRatingsByResource);
router.get("/star-count/:resourceId", RatingController.getStarCount);

// Rutas protegidas
router.post("/rate",
  authMiddleware,
  permissionsMiddleware(['rate:resources']),
  RatingController.rateResource as RequestHandler
);

router.delete("/",
  authMiddleware,
  permissionsMiddleware(['manage:own_ratings', 'moderate:all_ratings']),
  RatingController.deleteRating as RequestHandler
);

export default router;