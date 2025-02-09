import { Router } from "express";
import { ResourceController } from "./resourceController";
import { authMiddleware } from "../../shared/middleware/authMiddleware";
import { RequestHandler } from "express";

const router = Router();

// Ruta para crear un recurso
router.post("/resources", authMiddleware as RequestHandler, ResourceController.createResource as RequestHandler);

// Ruta para actualizar un recurso
router.put("/resources/:id", authMiddleware as RequestHandler, ResourceController.updateResource as RequestHandler);

// Ruta para eliminar un recurso
router.delete("/resources/:id", authMiddleware as RequestHandler, ResourceController.deleteResource as RequestHandler);

// Ruta para obtener un recurso por ID
router.get("/resources/:id", ResourceController.getResource as RequestHandler);

// Ruta para obtener todos los recursos
router.get("/resources", ResourceController.getAllResources as RequestHandler);

export default router;