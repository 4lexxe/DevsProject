import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import Content from "../models/Content";
import Section from "../models/Section";
import User from "../../user/User";
import { BaseController } from "./BaseController";
import ContentFiles from "../models/ContentFiles";

export default class ContentController extends BaseController {
  // Obtener todos los contenidos
  static getAll: RequestHandler = async (req, res) => {
    try {
      const contents = await Content.findAll({
        include: [{ model: Section, as: "section" }],
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
      const { id } = req.params;
      const content = await Content.findByPk(id, {
        include: [{ model: Section, as: "section" }],
      });
      if (!content) {
        ContentController.notFound(res, req, "Contenido");
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

  // Obtener un contenido por ID con IDs del siguiente y anterior contenido en la misma sección
  static getByIdWithNavigation: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const content = await Content.findByPk(id, {
        include: [{ model: Section, as: "section" }, { model: ContentFiles, as: "files", separate: true, order: [["position", "ASC"]] }],
      });

      if (!content) {
        ContentController.notFound(res, req, "Contenido");
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
      });

      const currentIndex = sectionContents.findIndex(c => c.id === content.id);
      const previousContentId = currentIndex > 0 ? sectionContents[currentIndex - 1].id : null;
      const nextContentId = currentIndex < sectionContents.length - 1 ? sectionContents[currentIndex + 1].id : null;

      const navigationData = {
        content: contentData,
        previousContentId,
        nextContentId,
      };

      ContentController.sendSuccess(res, req, navigationData, "Contenido obtenido correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al obtener el contenido");
    }
  };

  // Obtener contenidos por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const { sectionId } = req.params;
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

      const content = await Content.create({
        title,
        text,
        markdown,
        quiz,
        resources,
        duration,
        position,
        sectionId,
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
      
      await content.update({
        title,
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
      
      await content.destroy();

      ContentController.deleted(res, req, "Contenido eliminado correctamente");
    } catch (error) {
      ContentController.handleServerError(res, req, error, "Error al eliminar el contenido");
    }
  };
}
