import { Request, Response, RequestHandler } from "express";
import sequelize from "../../../infrastructure/database/db";
import Section from "../models/Section";
import Course from "../models/Course";
import Content from "../models/Content";
import { Op } from "sequelize";
import { BaseController } from "./BaseController";

export default class SectionGetController extends BaseController {
  // Obtener todas las secciones
  static getAll: RequestHandler = async (req, res) => {
    try {
      const sections = await Section.findAll({
        include: [{ model: Course, as: "course" }],
        order: [["id", "ASC"]],
      });
      SectionGetController.sendSuccess(res, req, sections, "Secciones obtenidas correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener las secciones");
    }
  };

  // Obtener una sección por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const section = await Section.findByPk(req.params.id, {
        include: ["course", "contents"],
      });
      if (!section) {
        SectionGetController.notFound(res, req, "Sección");
        return;
      }
      SectionGetController.sendSuccess(res, req, section, "Sección obtenida correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener la sección");
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
      SectionGetController.sendSuccess(res, req, sections, "Secciones obtenidas correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener las secciones del curso");
    }
  };

  // Obtener el conteo de secciones
  static getSectionCount: RequestHandler = async (req, res) => {
    try {
      const count = await Section.count();
      SectionGetController.sendSuccess(res, req, { count }, "Conteo de secciones obtenido correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener el conteo de secciones");
    }
  };
}
