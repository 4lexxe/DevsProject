import { Request, Response, RequestHandler } from "express";
import sequelize from "../../../infrastructure/database/db";
import Section from "../models/Section";
import Course from "../models/Course";
import Content from "../models/Content";
import { Op } from "sequelize";
import { BaseController } from "./BaseController";
import { EncryptionUtils } from "../../../shared/utils/encryption.utils";

export default class SectionGetController extends BaseController {
  
  /**
   * Encripta los IDs de una sección para respuestas públicas
   */
  private static encryptSectionIds(section: any): any {
    return {
      ...section,
      id: EncryptionUtils.encryptId(section.id),
      courseId: EncryptionUtils.encryptId(section.courseId),
      // No incluir contenidos en respuestas públicas por seguridad
      contents: undefined
    };
  }
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

  // Obtener una sección por ID (sin contenidos por seguridad)
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Desencriptar ID si es necesario
      let sectionId: number;
      if (EncryptionUtils.isValidEncryptedId(id)) {
        sectionId = EncryptionUtils.decryptId(id);
      } else {
        sectionId = parseInt(id, 10);
      }
      
      const section = await Section.findByPk(sectionId, {
        include: ["course"],
        // No incluir contenidos en respuesta pública por seguridad
      });
      if (!section) {
        SectionGetController.notFound(res, req, "Sección");
        return;
      }
      
      // Encriptar IDs en la respuesta
      const encryptedSection = SectionGetController.encryptSectionIds(section.toJSON());
      SectionGetController.sendSuccess(res, req, encryptedSection, "Sección obtenida correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener la sección");
    }
  };

  // Obtener secciones por ID de curso (incluye títulos de contenido para propósitos de venta)
  static getByCourseId: RequestHandler = async (req, res) => {
    try {
      const { courseId } = req.params;
      
      // Desencriptar ID si es necesario
      let numericCourseId: number;
      if (EncryptionUtils.isValidEncryptedId(courseId)) {
        numericCourseId = EncryptionUtils.decryptId(courseId);
      } else {
        numericCourseId = parseInt(courseId, 10);
      }
      
      const sections = await Section.findAll({
        where: { courseId: numericCourseId },
        include: [
          { model: Course, as: "course" },
          {
            model: Content,
            as: "contents",
            attributes: ['id', 'title', 'duration', 'position'], // Solo información básica para venta
            order: [['position', 'ASC']]
          }
        ],
        order: [["id", "ASC"]],
      });
      
      // Encriptar IDs en la respuesta
      const encryptedSections = sections.map(section => {
        const sectionData = section.toJSON();
        return {
          ...SectionGetController.encryptSectionIds(sectionData),
          contents: sectionData.contents?.map((content: any) => ({
            ...content,
            id: EncryptionUtils.encryptId(content.id)
          })) || []
        };
      });
      
      SectionGetController.sendSuccess(res, req, encryptedSections, "Secciones obtenidas correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener las secciones del curso");
    }
  };

  // Obtener una sección con sus contenidos por ID (REQUIERE AUTENTICACIÓN Y ACCESO AL CURSO)
  static getByIdWithContents: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Desencriptar ID si es necesario
      let sectionId: number;
      if (EncryptionUtils.isValidEncryptedId(id)) {
        sectionId = EncryptionUtils.decryptId(id);
      } else {
        sectionId = parseInt(id, 10);
      }
      
      const section = await Section.findByPk(sectionId, {
        include: [{
          model: Content,
          as: "contents",
          order: [['position', 'ASC']]
        }],
      });
      if (!section) {
        SectionGetController.notFound(res, req, "Sección");
        return;
      }
      
      // Los contenidos se devuelven con IDs originales ya que el usuario tiene acceso
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
