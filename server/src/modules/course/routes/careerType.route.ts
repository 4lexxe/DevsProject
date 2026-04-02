import { Router } from "express";
import CareerTypeController from "../controllers/careerType.controller";

import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { requirePermission } from "../../../shared/middleware/permissionsMiddleware";

const router = Router();

router.get("/careerTypes", CareerTypeController.getAll); // Obtener todos los tipos de carrera
router.get("/careerTypes/actives", CareerTypeController.getAllActives); // Obtener todos los tipos de carrera activas
router.get("/careerTypes/:id", CareerTypeController.getById); // Obtener un tipo de carrera por ID

router.post("/careerTypes", authMiddleware, requirePermission("career_type:create"), CareerTypeController.create); // Crear un nuevo tipo de carrera
router.put("/careerTypes/:id", authMiddleware, requirePermission("career_type:update"), CareerTypeController.update); // Actualizar un tipo de carrera por ID
router.delete("/careerTypes/:id", authMiddleware, requirePermission("career_type:delete"), CareerTypeController.delete); // Eliminar un tipo de carrera por ID

export default router;
