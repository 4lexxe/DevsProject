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
        include: [
          { 
            model: Course, 
            as: "course",
            attributes: ["id", "title", "image", "isActive"]
          }
        ],
        order: [["id", "ASC"]],
      });
      SectionGetController.sendSuccess(res, req, sections, "Secciones obtenidas correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener las secciones");
    }
  };

  // Obtener una sección por ID o slug
  static getById: RequestHandler = async (req, res) => {
    try {
      const identifier = req.params.id;
      const isNumeric = /^\d+$/.test(identifier);
      
      let section;
      if (isNumeric) {
        // Buscar por ID
        section = await Section.findByPk(identifier, {
          include: ["course", "contents"],
        });
      } else {
        // Buscar por slug
        section = await Section.findOne({
          where: { slug: identifier },
          include: ["course", "contents"],
        });
      }
      
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

  // Obtener una seccion con sus contenidos por ID o slug de la seccion
  static getByIdWithContents: RequestHandler = async (req, res) => {
    try {
      const identifier = req.params.id;
      const isNumeric = /^\d+$/.test(identifier);
      
      let section;
      if (isNumeric) {
        // Buscar por ID
        section = await Section.findByPk(identifier, {
          include: ["contents"],
        });
      } else {
        // Buscar por slug
        section = await Section.findOne({
          where: { slug: identifier },
          include: ["contents"],
        });
      }
      
      if (!section) {
        SectionGetController.notFound(res, req, "Sección");
        return;
      }
      SectionGetController.sendSuccess(res, req, section, "Sección obtenida correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener la sección");
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
