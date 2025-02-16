import { Request, Response, RequestHandler } from "express";
import VideoContent from "../models/VideoContent";
import Section from "../../section/Section";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export class VideoContentController {
  // Obtener todos los contenidos de video
  static getAll: RequestHandler = async (req, res) => {
    try {
      const videoContents = await VideoContent.findAll({
        include: [{ model: Section, as: "section" }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos de video obtenidos correctamente",
        length: videoContents.length,
        data: videoContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de video",
        error,
      });
    }
  };

  // Obtener un contenido de video por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const videoContent = await VideoContent.findByPk(id, {
        include: [{ model: Section, as: "section" }],
      });
      if (!videoContent) {
        res.status(404).json({ status: "error", message: "Contenido de video no encontrado" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de video obtenido correctamente",
        data: videoContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el contenido de video",
        error,
      });
    }
  };

  // Obtener contenidos de video por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const { sectionId } = req.params;
      const videoContents = await VideoContent.findAll({ where: { sectionId } });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos de video obtenidos correctamente para la sección especificada",
        length: videoContents.length,
        data: videoContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de video de la sección",
        error,
      });
    }
  };

  // Crear un contenido de video
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, content, duration, position, sectionId } = req.body;
      const videoContent = await VideoContent.create({
        title,
        content,
        duration,
        position,
        sectionId,
      });
      res.status(201).json({
        ...metadata(req, res),
        message: "Contenido de video creado correctamente",
        data: videoContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear el contenido de video",
        error,
      });
    }
  };

  // Actualizar un contenido de video por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, duration, position, sectionId } = req.body;
      const videoContent = await VideoContent.findByPk(id);
      
      if (!videoContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de video no encontrado",
        });
        return;
      }
      
      await videoContent.update({ title, content, duration, position, sectionId });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de video actualizado correctamente",
        data: videoContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el contenido de video",
        error,
      });
    }
  };

  // Eliminar un contenido de video por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const videoContent = await VideoContent.findByPk(id);
      
      if (!videoContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de video no encontrado",
        });
        return;
      }
      
      await videoContent.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de video eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el contenido de video",
        error,
      });
    }
  };
}
