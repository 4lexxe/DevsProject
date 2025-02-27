// src/modules/contact/ContactMessageRoutes.ts
import { Router } from "express";
import ContactMessageController from "./ContactMessageController";

const router = Router();

router.post("/contactMessages", ContactMessageController.create);       // Crear un mensaje
router.get("/contactMessages", ContactMessageController.getAll);         // Obtener todos los mensajes
router.get("/contactMessages/:id", ContactMessageController.getById);      // Obtener un mensaje por ID
router.put("/contactMessages/:id", ContactMessageController.update);       // Actualizar un mensaje
router.delete("/contactMessages/:id", ContactMessageController.delete);    // Eliminar un mensaje

export default router;
