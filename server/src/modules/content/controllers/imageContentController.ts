import { Request, Response, RequestHandler } from "express";
import ImageContent from "../models/ImageContent";
import Section from "../../section/Section";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export default class ImageContentController {
  // Obtener todos los contenidos de imagen
  static getAll: RequestHandler = async (req, res) => {
    try {
      const imageContents = await ImageContent.findAll({
        include: [{ model: Section, as: "section" }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos de imagen obtenidos correctamente",
        length: imageContents.length,
        data: imageContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de imagen",
        error,
      });
    }
  };

  // Obtener contenido de imagen por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const imageContent = await ImageContent.findByPk(id, {
        include: [{ model: Section, as: "section" }],
      });
      if (!imageContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de imagen no encontrado",
        });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de imagen obtenido correctamente",
        data: imageContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el contenido de imagen",
        error,
      });
    }
  };

  // Obtener contenidos de imagen por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const { sectionId } = req.params;
      const imageContents = await ImageContent.findAll({
        where: { sectionId },
      });
      res.status(200).json({
        ...metadata(req, res),
        message:
          "Contenidos de imagen obtenidos correctamente para la sección especificada",
        length: imageContents.length,
        data: imageContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de imagen de la sección",
        error,
      });
    }
  };

  // Crear un nuevo contenido de imagen
  static create: RequestHandler = async (req, res) => {
    try {
      const { content, title, duration, position, sectionId } = req.body;
      const newImageContent = await ImageContent.create({
        content,
        title,
        duration,
        position,
        sectionId,
      });
      res.status(201).json({
        ...metadata(req, res),
        message: "Contenido de imagen creado correctamente",
        data: newImageContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear el contenido de imagen",
        error,
      });
    }
  };

  // Actualizar contenido de imagen por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { content, title, duration, position, sectionId } = req.body;
      const imageContent = await ImageContent.findByPk(id);
      if (!imageContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de imagen no encontrado",
        });
        return;
      }
      await imageContent.update({
        content,
        title,
        duration,
        position,
        sectionId,
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de imagen actualizado correctamente",
        data: imageContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el contenido de imagen",
        error,
      });
    }
  };

  // Eliminar contenido de imagen por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const imageContent = await ImageContent.findByPk(id);
      if (!imageContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de imagen no encontrado",
        });
        return;
      }
      await imageContent.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de imagen eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el contenido de imagen",
        error,
      });
    }
  };
}
