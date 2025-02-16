 import { Router } from "express";
 import CategoryController from "./categoryController";
 
 const router = Router();
 
 router.get("/category", CategoryController.getAll); // Obtener todos los tipos de carrera
 router.get("/category/:id", CategoryController.getById); // Obtener un tipo de carrera por ID
 router.post("/category", CategoryController.create); // Crear un nuevo tipo de carrera
 router.put("/category/:id", CategoryController.update); // Actualizar un tipo de carrera por ID
 router.delete("/category/:id", CategoryController.delete); // Eliminar un tipo de carrera por ID
 
 export default router;
 