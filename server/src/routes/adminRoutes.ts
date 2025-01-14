import express from "express";
import { createAdminController, getAllAdminsController } from "../controllers/adminController";

const router = express.Router();

// Ruta para crear un administrador
router.post("/admins", createAdminController);

// Ruta para obtener todos los administradores
router.get("/admins", getAllAdminsController);

export default router;