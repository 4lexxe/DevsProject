import { Router } from "express";
import CareerTypeController from "./careerTypeController";

const router = Router();

router.get("/careerTypes", CareerTypeController.getAll); // Obtener todos los tipos de carrera
router.get("/careerTypes/actives", CareerTypeController.getAllActives); // Obtener todos los tipos de carrera activas
router.get("/careerTypes/:id", CareerTypeController.getById); // Obtener un tipo de carrera por ID
router.post("/careerTypes", CareerTypeController.create); // Crear un nuevo tipo de carrera
router.put("/careerTypes/:id", CareerTypeController.update); // Actualizar un tipo de carrera por ID
router.delete("/careerTypes/:id", CareerTypeController.delete); // Eliminar un tipo de carrera por ID

export default router;
