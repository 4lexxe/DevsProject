 import { Router } from "express";
 import CategoryController from "../controllers/category.controller";
 
 const router = Router();
 
 router.get("/categories", CategoryController.getAll); // Obtener todas las categorias
 router.get("/categories/actives", CategoryController.getAllActives); // Obtener todas las categorias activas
 router.get("/categories/actives/limit", CategoryController.getAllActivesLimited)
 router.get("/categories/:id", CategoryController.getById); // Obtener una categoria
 router.post("/categories", CategoryController.create); // Crear una nueva categoria
 router.put("/categories/:id", CategoryController.update); // Actualizar una categoria
 router.delete("/categories/:id", CategoryController.delete); // Eliminar una categoria
 
 export default router;
  