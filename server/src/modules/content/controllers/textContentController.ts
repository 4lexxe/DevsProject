import { Request, Response, RequestHandler } from "express";
import TextContent from "../models/TextContent";
import Section from "../../section/Section";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export default class TextContentController {
  // Obtener todos los contenidos de texto
  static getAll: RequestHandler = async (req, res) => {
    try {
      const textContents = await TextContent.findAll({
        include: [{ model: Section, as: "section" }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos de texto obtenidos correctamente",
        length: textContents.length,
        data: textContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de texto",
        error,
      });
    }
  };

  // Obtener un contenido de texto por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const textContent = await TextContent.findByPk(id, {
        include: [{ model: Section, as: "section" }],
      });
      if (!textContent) {
        res.status(404).json({ status: "error", message: "Contenido de texto no encontrado" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de texto obtenido correctamente",
        data: textContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el contenido de texto",
        error,
      });
    }
  };

  // Obtener contenidos de texto por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const { sectionId } = req.params;
      const textContents = await TextContent.findAll({ where: { sectionId } });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos de texto obtenidos correctamente para la sección especificada",
        length: textContents.length,
        data: textContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de texto de la sección",
        error,
      });
    }
  };

  // Crear un contenido de texto
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, content, duration, position, sectionId } = req.body;
      const textContent = await TextContent.create({
        title,
        content,
        duration,
        position,
        sectionId,
      });
      res.status(201).json({
        ...metadata(req, res),
        message: "Contenido de texto creado correctamente",
        data: textContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear el contenido de texto",
        error,
      });
    }
  };

  // Actualizar un contenido de texto por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, duration, position, sectionId } = req.body;
      const textContent = await TextContent.findByPk(id);
      
      if (!textContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de texto no encontrado",
        });
        return;
      }
      
      await textContent.update({
        title,
        content,
        duration,
        position,
        sectionId,
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de texto actualizado correctamente",
        data: textContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el contenido de texto",
        error,
      });
    }
  };

  // Eliminar un contenido de texto por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const textContent = await TextContent.findByPk(id);
      
      if (!textContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de texto no encontrado",
        });
        return;
      }
      
      await textContent.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de texto eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el contenido de texto",
        error,
      });
    }
  };
}
