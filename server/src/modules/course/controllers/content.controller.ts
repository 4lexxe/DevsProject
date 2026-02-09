import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import Content from "../models/Content";
import Section from "../models/Section";
import Course from "../models/Course";
import User from "../../user/User";
import Admin from "../../admin/Admin";
import { BaseController } from "./BaseController";
import ContentFiles from "../models/ContentFiles";
import DriveService from "../../drive/services/driveService";
import CourseAccess from "../../purchase/models/CourseAccess";
import { Op } from "sequelize";
import { checkCourseAccessAndPermissions, verifyUserPermissions } from "../utils/courseAccessHelper";
import { generateSlug, generateUniqueSlug } from "../../../shared/utils/slugGenerator";

export default class ContentController extends BaseController {
  static driveService = new DriveService();
  // Obtener todos los contenidos
  static getAll: RequestHandler = async (req, res) => {
    try {
      const contents = await Content.findAll({
        include: [
          { 
            model: Section, 
            as: "section",
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "image", "isActive"]
              }
            ],
            attributes: ["id", "title", "courseId", "moduleType"]
          }
        ],
        order: [["id", "ASC"]],
      });
      ContentController.sendSuccess(res, req, contents, "Contenidos obtenidos correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al obtener los contenidos");
    }
  };

  // Obtener un contenido por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const user = req.user as User | undefined;
      const { id } = req.params;
      const content = await Content.findByPk(id, {
        include: [
          {
            model: Section,
            as: "section",
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
              }
            ]
          }
        ],
      });
      if (!content) {
        ContentController.notFound(res, req, "Contenido");
        return;
      }

      // Obtener el curso desde la sección
      const section = (content as any).section;
      const course = section?.course as Course;
      
      if (!course) {
        ContentController.notFound(res, req, "Curso asociado al contenido");
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
        ContentController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      ContentController.sendSuccess(res, req, content, "Contenido obtenido correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al obtener el contenido");
    }
  };

  static getQuizById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const content = await Content.findByPk(id, {
          attributes: ['quiz', "id"], // Solo traer el campo 'quiz'
      });

      if (!content) {
          ContentController.notFound(res, req, "Contenido");
          return;
      }

      const message = content.quiz ? "Quiz obtenido correctamente" : "No hay quiz disponible para este contenido";
      ContentController.sendSuccess(res, req, content, message);
  } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al obtener el quiz");
  }
};

  // Obtener un contenido por courseSlug, sectionSlug y contentSlug con navegación
  static getByCourseSectionAndContentSlug: RequestHandler = async (req, res) => {
    try {
      const { courseSlug, sectionSlug, contentSlug } = req.params as {
        courseSlug: string;
        sectionSlug: string;
        contentSlug: string;
      };
      const user = req.user as User | undefined;

      const course = await Course.findOne({
        where: { slug: courseSlug },
        attributes: ["id", "title", "slug", "price", "isActive", "adminId"],
        include: [
          {
            model: Admin,
            as: "admin",
            attributes: ["id", "userId"],
          },
        ],
      });

      if (!course) {
        ContentController.notFound(res, req, "Curso");
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
        ContentController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      const section = await Section.findOne({
        where: { slug: sectionSlug, courseId: course.id },
        attributes: ["id", "title", "slug", "courseId"],
      });

      if (!section) {
        ContentController.notFound(res, req, "Sección");
        return;
      }

      const content = await Content.findOne({
        where: { slug: contentSlug, sectionId: section.id },
        include: [
          {
            model: Section,
            as: "section",
            attributes: ["id", "title", "slug", "courseId"],
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "slug", "price", "isActive", "adminId"],
                include: [
                  {
                    model: Admin,
                    as: "admin",
                    attributes: ["id", "userId"],
                  },
                ],
              },
            ],
          },
          { model: ContentFiles, as: "files", separate: true, order: [["position", "ASC"]] },
        ],
      });

      if (!content) {
        ContentController.notFound(res, req, "Contenido");
        return;
      }

      // Filtrar campos de archivos de video por seguridad
      const contentData = content.toJSON() as any;
      if (contentData.files && contentData.files.length > 0) {
        contentData.files = contentData.files.map((file: any) => {
          if (file.fileType === "video") {
            return {
              id: file.id,
              originalName: file.originalName,
              fileType: file.fileType,
              position: file.position,
            };
          }
          return file;
        });
      }

      const sectionContents = await Content.findAll({
        where: { sectionId: section.id },
        order: [["position", "ASC"]],
        attributes: ["id", "slug", "position"],
      });

      const currentIndex = sectionContents.findIndex((c) => c.id === content.id);
      const previousContent = currentIndex > 0 ? sectionContents[currentIndex - 1] : null;
      const nextContent = currentIndex < sectionContents.length - 1 ? sectionContents[currentIndex + 1] : null;

      const navigationData = {
        content: contentData,
        previousContentId: previousContent?.id || null,
        nextContentId: nextContent?.id || null,
        previousContentSlug: (previousContent as any)?.slug || null,
        nextContentSlug: (nextContent as any)?.slug || null,
      };

      ContentController.sendSuccess(res, req, navigationData, "Contenido obtenido correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al obtener el contenido");
    }
  };

  // Obtener un contenido por ID con IDs del siguiente y anterior contenido en la misma sección
  static getByIdWithNavigation: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as User | undefined;
      
      // DEBUG: Verificar estado del usuario
      console.log(`[DEBUG] getByIdWithNavigation - User ID: ${user?.id || 'undefined'}, User exists: ${!!user}`);
      
      const content = await Content.findByPk(id, {
        include: [
          { 
            model: Section, 
            as: "section",
            attributes: ["id", "title", "slug", "courseId"],
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "slug", "price", "isActive", "adminId"],
                include: [
                  {
                    model: Admin,
                    as: "admin",
                    attributes: ["id", "userId"]
                  }
                ]
              }
            ]
          }, 
          { model: ContentFiles, as: "files", separate: true, order: [["position", "ASC"]] }
        ],
      });

      if (!content) {
        ContentController.notFound(res, req, "Contenido");
        return;
      }

      // Obtener el curso desde la sección
      const course = (content.section as any)?.course;
      if (!course) {
        ContentController.notFound(res, req, "Curso asociado al contenido");
        return;
      }

      // Verificar permisos básicos PRIMERO (antes de verificar acceso al curso)
      if (!verifyUserPermissions(user, ["read:course_details", "access:course_content"])) {
        console.log(`[DEBUG] Usuario sin permisos - User: ${user?.id || 'undefined'}`);
        if (!user) {
          res.status(403).json({
            status: "error",
            message: "Debes iniciar sesión para acceder a este recurso",
            requiresAuth: true,
            requiresAccess: false,
          });
          return;
        }
        ContentController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.) usando la misma lógica que otros controladores
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        console.log(`[DEBUG] Acceso denegado - User: ${user?.id || 'undefined'}, Reason: ${accessCheck.errorResponse?.message}`);
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      // Filtrar campos de archivos de video por seguridad
      const contentData = content.toJSON() as any;
      if (contentData.files && contentData.files.length > 0) {
        contentData.files = contentData.files.map((file: any) => {
          if (file.fileType === 'video') {
            // Para videos, solo retornar id, originalName, fileType y position por seguridad
            return {
              id: file.id,
              originalName: file.originalName,
              fileType: file.fileType,
              position: file.position
            };
          }
          // Para otros tipos de archivo, retornar todos los campos
          return file;
        });
      }

      const sectionContents = await Content.findAll({
        where: { sectionId: content.sectionId },
        order: [["position", "ASC"]],
        attributes: {
          exclude: [], // Incluir todos los atributos disponibles (slug se incluirá si existe)
        }
      });

      const currentIndex = sectionContents.findIndex(c => c.id === content.id);
      const previousContent = currentIndex > 0 ? sectionContents[currentIndex - 1] : null;
      const nextContent = currentIndex < sectionContents.length - 1 ? sectionContents[currentIndex + 1] : null;

      const navigationData = {
        content: contentData,
        previousContentId: previousContent?.id || null,
        nextContentId: nextContent?.id || null,
        previousContentSlug: (previousContent as any)?.slug || null,
        nextContentSlug: (nextContent as any)?.slug || null,
      };

      ContentController.sendSuccess(res, req, navigationData, "Contenido obtenido correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al obtener el contenido");
    }
  };

  // Obtener contenidos por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const user = req.user as User | undefined;
      const { sectionId } = req.params;
      
      // Obtener la sección con el curso para verificar acceso
      const section = await Section.findByPk(sectionId, {
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
          }
        ]
      });

      if (!section) {
        ContentController.notFound(res, req, "Sección");
        return;
      }

      const course = (section as any).course as Course;
      if (!course) {
        ContentController.notFound(res, req, "Curso asociado a la sección");
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
        ContentController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, course);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      const contents = await Content.findAll({ where: { sectionId } });
      ContentController.sendSuccess(res, req, contents, "Contenidos obtenidos correctamente para la sección especificada");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al obtener los contenidos de la sección");
    }
  };


  // Crear un contenido
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, text, markdown, quiz, resources, duration, position, sectionId } = req.body;
      const user = req.user as User;

      // Verificar permisos adicionales para crear contenido del curso
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('manage:course_content') && user.Role?.name !== 'superadmin') {
        ContentController.forbidden(res, req, "No tienes permisos para crear contenido de curso");
        return;
      }

      const section = await Section.findByPk(sectionId);
      if (!section) {
        ContentController.notFound(res, req, "Sección");
        return;
      }

      const response = await this.driveService.createFolder(title, section.driveFolderId);

      // Generar slug único para el contenido
      const existingSlugs = await Content.findAll({
        attributes: ['slug'],
        where: { slug: { [Op.ne]: null } }
      }).then(contents => contents.map(c => (c as any).slug).filter(Boolean));

      const slug = generateUniqueSlug(title, existingSlugs);

      const content = await Content.create({
        title,
        slug,
        text,
        markdown,
        quiz,
        resources,
        duration,
        position,
        sectionId,
        driveFolderId: response.folderId,
      });

      ContentController.created(res, req, content, "Contenido creado correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al crear el contenido");
    }
  }

  // Actualizar un contenido por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, text, markdown, quiz, resources, duration, position, sectionId } = req.body;
      const user = req.user as User;

      // Verificar permisos adicionales para actualizar contenido del curso
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('manage:course_content') && user.Role?.name !== 'superadmin') {
        ContentController.forbidden(res, req, "No tienes permisos para actualizar contenido de curso");
        return;
      }

      const content = await Content.findByPk(id);
      if (!content) {
        ContentController.notFound(res, req, "Contenido");
        return;
      }
      
      // Si el título cambió, generar nuevo slug
      let slug = (content as any).slug;
      if (title && title !== content.title) {
        const existingSlugs = await Content.findAll({
          attributes: ['slug'],
          where: { 
            slug: { [Op.ne]: null },
            id: { [Op.ne]: content.id }
          }
        }).then(contents => contents.map(c => (c as any).slug).filter(Boolean));
        
        slug = generateUniqueSlug(title, existingSlugs);
      }
      
      await content.update({
        title,
        slug,
        text,
        markdown,
        quiz,
        resources,
        duration,
        position,
        sectionId,
      });

      ContentController.updated(res, req, content, "Contenido actualizado correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al actualizar el contenido");
    }
  };

  static updateContentQuiz: RequestHandler = async (req, res) => {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Errores de validación",
          errors: errors.array()
        });
        return;
      }

      const { contentId } = req.params;
      const { quiz } = req.body;

      // Verificar que el contenido exista
      const content = await Content.findByPk(contentId);
      if (!content) {
        ContentController.notFound(res, req, "Contenido");
        return;
      }

      // Actualizar el contenido con el nuevo quiz
      await content.update({ quiz });

      ContentController.updated(res, req, content, "Quiz actualizado correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al actualizar el quiz del contenido");
    }
  }

  // Eliminar un quiz de un contenido por ID
  static deleteQuiz: RequestHandler = async (req, res) => {
    try {
      const { contentId } = req.params;

      // Verificar que el contenido exista
      const content = await Content.findByPk(contentId);
      if (!content) {
        ContentController.notFound(res, req, "Contenido");
        return;
      }

      // Eliminar el quiz del contenido
      await content.update({ quiz: null });

      ContentController.updated(res, req, content, "Quiz eliminado del contenido correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al eliminar el quiz del contenido");
    }
  }

  // Eliminar un contenido por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as User;

      // Verificar que el usuario tenga permisos para eliminar contenido
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('delete:content') && user.Role?.name !== 'superadmin') {
        ContentController.forbidden(res, req, "No tienes permisos para eliminar contenido");
        return;
      }

      const content = await Content.findByPk(id);
      if (!content) {
        ContentController.notFound(res, req, "Contenido");
        return;
      }

      if(content.driveFolderId) {
        await this.driveService.deleteFolder(content.driveFolderId);
      }
      
      await content.destroy();

      ContentController.deleted(res, req, "Contenido eliminado correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al eliminar el contenido");
    }
  };
}
