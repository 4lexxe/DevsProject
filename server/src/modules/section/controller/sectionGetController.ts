import { Request, Response, RequestHandler } from "express";
import sequelize from "../../../infrastructure/database/db";
import Section from "../Section";
import Course from "../../course/Course";
import Content from "../../content/Content";
import { Sequelize, Op } from "sequelize";
import { validationResult } from "express-validator";

// Función para generar metadata
const metadata = (req: Request, res: Response) => {
  return {
    statusCode: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
    method: req.method,
  };
};

// Función para manejar errores internos del servidor
const handleServerError = (res: Response, req: Request, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({
    ...metadata(req, res),
    status: "error",
    message,
    error: error.message,
  });
};
export default class SectionGetController{
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
        data: sections,
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener las secciones");
    }
  };

  // Obtener una sección por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const section = await Section.findByPk(req.params.id, {
        include: ["course", "contents"],
      });
      if (!section) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "Sección no encontrada",
        });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Sección obtenida correctamente",
        data: section,
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener la sección");
    }
  };

  // Obtener secciones por ID de curso
  static getByCourseId: RequestHandler = async (req, res) => {
    try {
      const sections = await Section.findAll({
        where: { courseId: req.params.courseId },
        include: [
          { model: Course, as: "course" },
          { model: Content, as: "contents" },
        ],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Secciones obtenidas correctamente",
        data: sections,
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener las secciones del curso");
    }
  };

  // Obtener el conteo de secciones
  static getSectionCount: RequestHandler = async (req, res) => {
    try {
      const count = await Section.count();
      res.status(200).json({
        ...metadata(req, res),
        message: "Conteo de secciones obtenido correctamente",
        data: { count },
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener el conteo de secciones");
    }
  };
}