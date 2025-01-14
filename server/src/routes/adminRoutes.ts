import express from "express";
import { createAdminController, getAllAdminsController, deleteAdminController, updateAdminController } from "../controllers/adminController";

const router = express.Router();

// Ruta para crear un administrador
router.post("/admins", createAdminController);

// Ruta para obtener todos los administradores
router.get("/admins", getAllAdminsController);

// Ruta para eliminar un administrador
router.delete("/admins/:adminId", deleteAdminController); // Ruta para eliminar un administrador

// Ruta para actualizar un administrador
router.put('/admins/:id', updateAdminController);

export default router;