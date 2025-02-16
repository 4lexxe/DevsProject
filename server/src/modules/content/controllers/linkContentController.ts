import { Request, Response, RequestHandler } from "express";
import LinkContent from "../models/LinkContent";
import Section from "../../section/Section";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export class LinkContentController {
  // Obtener todos los contenidos de enlace
  static getAll: RequestHandler = async (req, res) => {
    try {
      const linkContents = await LinkContent.findAll({
        include: [{ model: Section, as: "section" }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos de enlace obtenidos correctamente",
        length: linkContents.length,
        data: linkContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de enlace",
        error,
      });
    }
  };

  // Obtener un contenido de enlace por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const linkContent = await LinkContent.findByPk(id, {
        include: [{ model: Section, as: "section" }],
      });
      if (!linkContent) {
        res.status(404).json({ status: "error", message: "Contenido de enlace no encontrado" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de enlace obtenido correctamente",
        data: linkContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el contenido de enlace",
        error,
      });
    }
  };

  // Obtener contenidos de enlace por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const { sectionId } = req.params;
      const linkContents = await LinkContent.findAll({ where: { sectionId } });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos de enlace obtenidos correctamente para la sección especificada",
        length: linkContents.length,
        data: linkContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de enlace de la sección",
        error,
      });
    }
  };

  // Crear un contenido de enlace
  static create: RequestHandler = async (req, res) => {
    try {
      const { externalLink, title, duration, position, sectionId } = req.body;
      const linkContent = await LinkContent.create({ externalLink, title, duration, position, sectionId });
      res.status(201).json({
        ...metadata(req, res),
        message: "Contenido de enlace creado correctamente",
        data: linkContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear el contenido de enlace",
        error,
      });
    }
  };

  // Actualizar un contenido de enlace por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { externalLink, title, duration, position, sectionId } = req.body;
      const linkContent = await LinkContent.findByPk(id);
      
      if (!linkContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de enlace no encontrado",
        });
        return;
      }
      
      await linkContent.update({ externalLink, title, duration, position, sectionId });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de enlace actualizado correctamente",
        data: linkContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el contenido de enlace",
        error,
      });
    }
  };

  // Eliminar un contenido de enlace por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const linkContent = await LinkContent.findByPk(id);
      
      if (!linkContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido de enlace no encontrado",
        });
        return;
      }
      
      await linkContent.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido de enlace eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el contenido de enlace",
        error,
      });
    }
  };
}
