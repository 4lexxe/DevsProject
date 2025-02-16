import { Request, Response, RequestHandler } from "express";
import Section from "./Section";
import Course from "../course/Course";
import Content from "../content/Content";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export default class SectionController {
  // Obtener todas las secciones
  static getAll: RequestHandler = async (req, res) => {
    try {
      const sections = await Section.findAll({
        include: [{ model: Course, as: "course" }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Secciones obtenidas correctamente",
        length: sections.length,
        data: sections,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener las secciones",
        error,
      });
    }
  };

  // Obtener una sección por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const section = await Section.findByPk(id, {
        include: ["course", "contents"],
      });
      if (!section) {
        res
          .status(404)
          .json({ status: "error", message: "Sección no encontrada" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Sección obtenida correctamente",
        data: section,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener la sección",
        error,
      });
    }
  };

  // Obtener secciones por courseId
  static getByCourseId: RequestHandler = async (req, res) => {
    try {
      const { courseId } = req.params;
      const sections = await Section.findAll({
        where: { courseId },
        include: ["course", "contents"],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Secciones obtenidas correctamente para el curso especificado",
        length: sections.length,
        data: sections,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener las secciones del curso",
        error,
      });
    }
  };

  // Obtener conteo total de secciones
  static getSectionCount: RequestHandler = async (req, res) => {
    try {
      const count = await Section.count();
      res.status(200).json({
        ...metadata(req, res),
        message: "Conteo de secciones obtenido correctamente",
        count,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el conteo de secciones",
        error,
      });
    }
  };

  // Crear una nueva sección
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, description, courseId, coverImage, moduleType } = req.body;
      const course = await Course.findByPk(courseId);
      if (!course) {
        res
          .status(400)
          .json({ status: "error", message: "Curso no encontrado" });
        return;
      }
      const newSection = await Section.create({
        title,
        description,
        courseId,
        coverImage,
        moduleType,
      });
      res.status(201).json({
        ...metadata(req, res),
        message: "Sección creada correctamente",
        data: newSection,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear la sección",
        error,
      });
    }
  };

  // Actualizar una sección por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, courseId, coverImage, moduleType } = req.body;
      const section = await Section.findByPk(id);

      if (!section) {
        res.status(404).json({
          status: "error",
          message: "Sección no encontrada",
        });
        return;
      }

      await section.update({
        title,
        description,
        courseId,
        coverImage,
        moduleType,
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Sección actualizada correctamente",
        data: section,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar la sección",
        error,
      });
    }
  };

  // Eliminar una sección por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const section = await Section.findByPk(id);
      if (!section) {
        res
          .status(404)
          .json({ status: "error", message: "Sección no encontrada" });
        return;
      }
      await section.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Sección eliminada correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar la sección",
        error,
      });
    }
  };
}
