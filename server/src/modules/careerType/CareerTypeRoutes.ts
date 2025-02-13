import { Router } from "express";
import CareerTypeController from "./careerTypeController";

const router = Router();

router.get("/careerType", CareerTypeController.getAll); // Obtener todos los tipos de carrera
router.get("/careerType/:id", CareerTypeController.getById); // Obtener un tipo de carrera por ID
router.post("/careerType", CareerTypeController.create); // Crear un nuevo tipo de carrera
router.put("/careerType/:id", CareerTypeController.update); // Actualizar un tipo de carrera por ID
router.delete("/careerType/:id", CareerTypeController.delete); // Eliminar un tipo de carrera por ID

export default router;
