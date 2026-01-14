import { Router, RequestHandler } from "express";
import RatingController from "./rating.controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
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
  RatingController.rateResource as RequestHandler
);

router.delete("/",
  authMiddleware,
  RatingController.deleteRating as RequestHandler
);

export default router;