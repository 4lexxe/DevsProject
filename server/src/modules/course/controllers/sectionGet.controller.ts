import { Request, Response, RequestHandler } from "express";
import sequelize from "../../../infrastructure/database/db";
import Section from "../models/Section";
import Course from "../models/Course";
import Content from "../models/Content";
import User from "../../user/User";
import Admin from "../../admin/Admin";
import { Op } from "sequelize";
import { BaseController } from "./BaseController";
import { checkCourseAccessAndPermissions, verifyUserPermissions } from "../utils/courseAccessHelper";

export default class SectionGetController extends BaseController {
  // Obtener estructura pública del curso (solo títulos y duraciones) - SIN AUTENTICACIÓN
  // Para mostrar preview del curso a usuarios no logueados o sin acceso
  static getPublicCourseStructure: RequestHandler = async (req, res) => {
    try {
      const { courseId } = req.params;
      
      // Buscar el curso por ID o slug
      const course = await Course.findOne({
        where: {
          [Op.or]: [
            { id: courseId },
            { slug: courseId }
          ]
        },
        attributes: ["id", "title", "slug", "isActive"]
      });

      if (!course || !course.isActive) {
        SectionGetController.notFound(res, req, "Curso");
        return;
      }

      // Obtener secciones con solo información básica
      const sections = await Section.findAll({
        where: { courseId: course.id },
        attributes: ["id", "title", "slug", "description", "moduleType"],
        include: [
          {
            model: Content,
            as: "contents",
            attributes: ["id", "title", "slug", "duration", "position"],
            order: [["position", "ASC"]]
          }
        ],
        order: [["id", "ASC"]],
      });

      // Formatear respuesta para solo mostrar estructura
      // Mantener formato compatible con la interfaz Section del frontend
      const structure = sections.map((section: any) => ({
        id: section.id,
        title: section.title,
        slug: section.slug,
        description: section.description || "",
        moduleType: section.moduleType || "Introductorio",
        coverImage: section.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
        colorGradient: section.colorGradient || ["#3b82f6", "#8b5cf6"],
        courseId: course.id.toString(),
        lessonsCount: (section.contents || []).length,
        duration: (section.contents || []).reduce((sum: number, c: any) => sum + (c.duration || 0), 0),
        contents: (section.contents || []).map((content: any) => ({
          id: content.id,
          title: content.title,
          slug: content.slug,
          duration: content.duration || 0,
          position: content.position
        }))
      }));

      // Devolver solo las secciones en el mismo formato que getByCourseId
      // para que el frontend pueda usar la misma interfaz
      SectionGetController.sendSuccess(res, req, structure, "Estructura del curso obtenida correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener la estructura del curso");
    }
  };

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
      const user = req.user as User | undefined;
      const identifier = req.params.id;
      const isNumeric = /^\d+$/.test(identifier);
      
      let section;
      if (isNumeric) {
        // Buscar por ID
        section = await Section.findByPk(identifier, {
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "title", "slug", "price", "adminId"],
              include: [
                {
                  model: Admin,
                  as: "admin",
                  attributes: ["id", "userId"]
                }
              ]
            },
            "contents"
          ],
        });
      } else {
        // Buscar por slug
        section = await Section.findOne({
          where: { slug: identifier },
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "title", "slug", "price", "adminId"],
              include: [
                {
                  model: Admin,
                  as: "admin",
                  attributes: ["id", "userId"]
                }
              ]
            },
            "contents"
          ],
        });
      }
      
      if (!section) {
        SectionGetController.notFound(res, req, "Sección");
        return;
      }

      // Verificar permisos y acceso al curso
      const course = (section as any).course as Course;
      if (!course) {
        SectionGetController.notFound(res, req, "Curso asociado a la sección");
        return;
      }

      // Verificar permisos básicos
      if (!verifyUserPermissions(user, ["read:course_details", "access:course_content"])) {
        if (!user) {
          res.status(403).json({
            status: "error",
            message: "Debes iniciar sesión para acceder a este recurso",
            requiresAuth: true,
            requiresAccess: false,
          });
          return;
        }
        SectionGetController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
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
      const user = req.user as User | undefined;
      const { courseId } = req.params;

      // Primero obtener el curso para verificar acceso
      const course = await Course.findByPk(courseId, {
        attributes: ["id", "title", "slug", "price", "adminId"],
        include: [
          {
            model: Admin,
            as: "admin",
            attributes: ["id", "userId"]
          }
        ]
      });

      if (!course) {
        SectionGetController.notFound(res, req, "Curso");
        return;
      }

      // Verificar permisos básicos
      if (!verifyUserPermissions(user, ["read:course_details", "access:course_content"])) {
        if (!user) {
          res.status(403).json({
            status: "error",
            message: "Debes iniciar sesión para acceder a este recurso",
            requiresAuth: true,
            requiresAccess: false,
          });
          return;
        }
        SectionGetController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      const sections = await Section.findAll({
        where: { courseId },
        include: [
          { 
            model: Course, 
            as: "course",
            attributes: ["id", "title", "slug", "image", "isActive"]
          },
          { model: Content, as: "contents" },
        ],
        order: [["id", "ASC"]],
      });
      SectionGetController.sendSuccess(res, req, sections, "Secciones obtenidas correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener las secciones del curso");
    }
  };

  // Obtener solo nombre de secciones y nombres de contenidos por ID de curso
  static getCourseSectionsSummary: RequestHandler = async (req, res) => {
    try {
      const user = req.user as User | undefined;
      const { courseId } = req.params;

      // Primero obtener el curso para verificar acceso
      const course = await Course.findByPk(courseId, {
        attributes: ["id", "title", "slug", "price", "adminId"],
        include: [
          {
            model: Admin,
            as: "admin",
            attributes: ["id", "userId"]
          }
        ]
      });

      if (!course) {
        SectionGetController.notFound(res, req, "Curso");
        return;
      }

      // Verificar permisos básicos
      if (!verifyUserPermissions(user, ["read:course_details", "access:course_content"])) {
        if (!user) {
          res.status(403).json({
            status: "error",
            message: "Debes iniciar sesión para acceder a este recurso",
            requiresAuth: true,
            requiresAccess: false,
          });
          return;
        }
        SectionGetController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      // Solo nombre de secciones y nombres de contenidos
      const sections = await Section.findAll({
        where: { courseId },
        attributes: ["id", "title", "slug"],
        include: [
          {
            model: Content,
            as: "contents",
            attributes: ["id", "title", "slug"],
            order: [["position", "ASC"]],
          },
        ],
        order: [["id", "ASC"]],
      });

      SectionGetController.sendSuccess(res, req, sections, "Resumen de secciones y contenidos obtenido correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener el resumen de secciones del curso");
    }
  };

  // Obtener una seccion con sus contenidos por ID o slug de la seccion
  static getByIdWithContents: RequestHandler = async (req, res) => {
    try {
      const user = req.user as User | undefined;
      const identifier = req.params.id;
      const isNumeric = /^\d+$/.test(identifier);
      
      let section;
      if (isNumeric) {
        // Buscar por ID
        section = await Section.findByPk(identifier, {
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "title", "slug", "price", "adminId"],
              include: [
                {
                  model: Admin,
                  as: "admin",
                  attributes: ["id", "userId"]
                }
              ]
            },
            "contents"
          ],
        });
      } else {
        // Buscar por slug
        section = await Section.findOne({
          where: { slug: identifier },
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "title", "slug", "price", "adminId"],
              include: [
                {
                  model: Admin,
                  as: "admin",
                  attributes: ["id", "userId"]
                }
              ]
            },
            "contents"
          ],
        });
      }
      
      if (!section) {
        SectionGetController.notFound(res, req, "Sección");
        return;
      }

      // Verificar permisos y acceso al curso
      const course = (section as any).course as Course;
      if (!course) {
        SectionGetController.notFound(res, req, "Curso asociado a la sección");
        return;
      }

      // Verificar permisos básicos
      if (!verifyUserPermissions(user, ["read:course_details", "access:course_content"])) {
        if (!user) {
          res.status(403).json({
            status: "error",
            message: "Debes iniciar sesión para acceder a este recurso",
            requiresAuth: true,
            requiresAccess: false,
          });
          return;
        }
        SectionGetController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      SectionGetController.sendSuccess(res, req, section, "Sección obtenida correctamente");
    } catch (error) {
      SectionGetController.handleServerError(res, req, error, "Error al obtener la sección");
    }
  };

  // Obtener una sección por courseSlug y sectionSlug
  static getByCourseAndSectionSlug: RequestHandler = async (req, res) => {
    try {
      const user = req.user as User | undefined;
      const { courseSlug, sectionSlug } = req.params;
      
      // Primero buscar el curso por slug con información completa
      const course = await Course.findOne({
        where: { slug: courseSlug },
        attributes: ["id", "title", "slug", "price", "adminId"],
        include: [
          {
            model: Admin,
            as: "admin",
            attributes: ["id", "userId"]
          }
        ]
      });

      if (!course) {
        SectionGetController.notFound(res, req, "Curso");
        return;
      }

      // Verificar permisos básicos
      if (!verifyUserPermissions(user, ["read:course_details", "access:course_content"])) {
        if (!user) {
          res.status(403).json({
            status: "error",
            message: "Debes iniciar sesión para acceder a este recurso",
            requiresAuth: true,
            requiresAccess: false,
          });
          return;
        }
        SectionGetController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      // Buscar la sección por slug dentro del curso
      const section = await Section.findOne({
        where: {
          slug: sectionSlug,
          courseId: course.id
        },
        include: [
          {
            model: Course,
            as: "course",
            attributes: ["id", "title", "slug", "image", "isActive"]
          },
          {
            model: Content,
            as: "contents",
            order: [["position", "ASC"]]
          }
        ]
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
