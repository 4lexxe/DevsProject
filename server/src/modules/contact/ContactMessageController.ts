// src/modules/contact/ContactMessageController.ts
import { Request, Response, RequestHandler } from "express";
import ContactMessage from "./ContactMessage";
import { sendContactEmail } from "./EmailService";

// Función auxiliar para generar metadata en las respuestas
const metadata = (req: Request, res: Response) => ({
  status: res.statusCode,
  url: req.protocol + "://" + req.get("host") + req.originalUrl,
});

export default class ContactMessageController {
  // Crear un nuevo mensaje de contacto
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const newMessage = await ContactMessage.create({ name, email, subject, message });

      // Enviar el correo utilizando el servicio
      await sendContactEmail({ name, email, subject, message });

      res.status(201).json({
        ...metadata(req, res),
        message: "Mensaje de contacto guardado correctamente",
        data: newMessage,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al guardar el mensaje de contacto",
        error,
      });
    }
  };

  // Obtener todos los mensajes de contacto
  static getAll: RequestHandler = async (req, res) => {
    try {
      const messages = await ContactMessage.findAll({ order: [["id", "ASC"]] });
      res.status(200).json({
        ...metadata(req, res),
        message: "Mensajes obtenidos correctamente",
        length: messages.length,
        data: messages,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los mensajes de contacto",
        error,
      });
    }
  };

  // Obtener un mensaje de contacto por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const message = await ContactMessage.findByPk(id);
      if (!message) {
        res.status(404).json({ status: "error", message: "Mensaje no encontrado" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Mensaje obtenido correctamente",
        data: message,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el mensaje de contacto",
        error,
      });
    }
  };

  // Actualizar un mensaje de contacto por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, subject, message } = req.body;
      const contactMessage = await ContactMessage.findByPk(id);
      if (!contactMessage) {
        res.status(404).json({ status: "error", message: "Mensaje no encontrado" });
        return;
      }
      await contactMessage.update({ name, email, subject, message });
      res.status(200).json({
        ...metadata(req, res),
        message: "Mensaje actualizado correctamente",
        data: contactMessage,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el mensaje de contacto",
        error,
      });
    }
  };

  // Eliminar un mensaje de contacto por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const contactMessage = await ContactMessage.findByPk(id);
      if (!contactMessage) {
        res.status(404).json({ status: "error", message: "Mensaje no encontrado" });
        return;
      }
      await contactMessage.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Mensaje eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el mensaje de contacto",
        error,
      });
    }
  };
}
