import { RequestHandler } from "express";
import FileContent from "../models/FileContent";
import Section from "../../section/Section";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export default class FileContentController {
  // Obtener todos los FileContents
  static getAll: RequestHandler = async (req, res) => {
    try {
      const fileContents = await FileContent.findAll({
        include: [{ model: Section, as: "section" }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos obtenidos correctamente",
        length: fileContents.length,
        data: fileContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos",
        error,
      });
    }
  };

  // Obtener FileContents por id
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const fileContents = await FileContent.findAll({ where: { id } });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido obtenido correctamente por id especificado",
        length: fileContents.length,
        data: fileContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de la sección",
        error,
      });
    }
  };

  // Obtener FileContents por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const { sectionId } = req.params;
      const fileContents = await FileContent.findAll({ where: { sectionId } });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos obtenidos correctamente para la sección especificada",
        length: fileContents.length,
        data: fileContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de la sección",
        error,
      });
    }
  };

  // Crear un nuevo FileContent
  static create: RequestHandler = async (req, res) => {
    try {
      const { content, title, duration, position, sectionId } = req.body;
      const newFileContent = await FileContent.create({
        content,
        title,
        duration,
        position,
        sectionId,
      });
      res.status(201).json({
        ...metadata(req, res),
        message: "Contenido creado correctamente",
        data: newFileContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear el contenido",
        error,
      });
    }
  };

  // Actualizar un FileContent por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { content, title, duration, position, sectionId } = req.body;
      const fileContent = await FileContent.findByPk(id);
      
      if (!fileContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido no encontrado",
        });
        return;
      }
      
      await fileContent.update({ content, title, duration, position, sectionId });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido actualizado correctamente",
        data: fileContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el contenido",
        error,
      });
    }
  };

  // Eliminar un FileContent por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const fileContent = await FileContent.findByPk(id);
      if (!fileContent) {
        res.status(404).json({
          status: "error",
          message: "Contenido no encontrado",
        });
        return;
      }
      await fileContent.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el contenido",
        error,
      });
    }
  };
}
