import { Router, RequestHandler } from "express";
import RatingController from "./rating.controller"; // Ajusta la ruta según tu estructura
import { authMiddleware } from "../../../shared/middleware/authMiddleware"; // Middleware de autenticación
import { geoMiddleware } from "../../../shared/middleware/geo.middleware"; // Middleware de geolocalización (opcional)

const router = Router();

// Middleware global de geolocalización (opcional, aplica según necesidad)
router.use(geoMiddleware);

// Ruta para obtener todas las calificaciones de un recurso específico
router.get(
  "/:resourceId",
  authMiddleware, // Requiere autenticación
  RatingController.getRatingsByResource
);

// Ruta para agregar o actualizar la calificación de un usuario a un recurso
router.post(
  "/rate",
  authMiddleware, // Requiere autenticación
  RatingController.rateResource as RequestHandler
);

// Ruta para eliminar una calificación
router.delete(
  "/",
  authMiddleware, // Requiere autenticación
  RatingController.deleteRating as RequestHandler
);

// Ruta para obtener la cantidad total de estrellas de un recurso
router.get(
  "/star-count/:resourceId",
  authMiddleware, // Requiere autenticación
  RatingController.getStarCount
);

export default router;