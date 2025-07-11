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
  permissionsMiddleware(['manage:community_posts']),
  RatingController.rateResource as RequestHandler
);

router.delete("/",
  authMiddleware,
  permissionsMiddleware(['delete:content']),
  RatingController.deleteRating as RequestHandler
);

export default router;