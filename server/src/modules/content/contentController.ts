import { Request, Response, RequestHandler } from "express";
import Content from "./Content";
import Section from "../section/Section";
import User from "../user/User";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export default class ContentController {
  // Obtener todos los contenidos
  static getAll: RequestHandler = async (req, res) => {
    try {
      const contents = await Content.findAll({
        include: [{ model: Section, as: "section" }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos obtenidos correctamente",
        length: contents.length,
        data: contents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos",
        error,
      });
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
        res.status(404).json({ status: "error", message: "Contenido no encontrado" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido obtenido correctamente",
        data: content,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el contenido",
        error,
      });
    }
  };

  static getQuizById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const content = await Content.findByPk(id, {
          attributes: ['quiz', "id"], // Solo traer el campo 'quiz'
      });

      if (!content) {
          res.status(404).json({ status: "error", message: "Contenido no encontrado" });
          return;
      }

      res.status(200).json({
          ...metadata(req, res),
          message: content.quiz ? "Quiz obtenido correctamente" : "No hay quiz disponible para este contenido",
          data: content, // Si es null, se mantiene explícitamente
      });
  } catch (error) {
      res.status(500).json({
          status: "error",
          message: "Error al obtener el quiz",
          error,
      });
  }
};

  // Obtener un contenido por ID con IDs del siguiente y anterior contenido en la misma sección
  static getByIdWithNavigation: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const content = await Content.findByPk(id, {
        include: [{ model: Section, as: "section" }],
      });

      if (!content) {
        res.status(404).json({ status: "error", message: "Contenido no encontrado" });
        return;
      }

      const sectionContents = await Content.findAll({
        where: { sectionId: content.sectionId },
        order: [["position", "ASC"]],
      });

      const currentIndex = sectionContents.findIndex(c => c.id === content.id);
      const previousContentId = currentIndex > 0 ? sectionContents[currentIndex - 1].id : null;
      const nextContentId = currentIndex < sectionContents.length - 1 ? sectionContents[currentIndex + 1].id : null;

      res.status(200).json({
        ...metadata(req, res),
        message: "Contenido obtenido correctamente",
        data: {
          content,
          previousContentId,
          nextContentId,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el contenido",
        error,
      });
    }
  };

  // Obtener contenidos por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const { sectionId } = req.params;
      const contents = await Content.findAll({ where: { sectionId } });
      res.status(200).json({
        ...metadata(req, res),
        message: "Contenidos obtenidos correctamente para la sección especificada",
        length: contents.length,
        data: contents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los contenidos de la sección",
        error,
      });
    }
  };

  // Crear un contenido
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, text, markdown, linkType, link, quiz, resources, duration, position, sectionId } = req.body;
      const user = req.user as User;

      // Verificar permisos adicionales para crear contenido del curso
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('manage:course_content') && user.Role?.name !== 'superadmin') {
        res.status(403).json({
          ...metadata(req, res),
          status: "error",
          message: "No tienes permisos para crear contenido de curso",
        });
        return;
      }

      const content = await Content.create({
        title,
        text,
        markdown,
        linkType,
        link,
        quiz,
        resources,
        duration,
        position,
        sectionId,
      });

      res.status(201).json({
        ...metadata(req, res),
        status: "success",
        message: "Contenido creado correctamente",
        data: content,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear el contenido",
        error,
      });
    }
  };

  // Actualizar un contenido por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, text, markdown, linkType, link, quiz, resources, duration, position, sectionId } = req.body;
      const user = req.user as User;

      // Verificar permisos adicionales para actualizar contenido del curso
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('manage:course_content') && user.Role?.name !== 'superadmin') {
        res.status(403).json({
          ...metadata(req, res),
          status: "error",
          message: "No tienes permisos para actualizar contenido de curso",
        });
        return;
      }

      const content = await Content.findByPk(id);
      if (!content) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "Contenido no encontrado",
        });
        return;
      }
      
      await content.update({
        title,
        text,
        markdown,
        linkType,
        link,
        quiz,
        resources,
        duration,
        position,
        sectionId,
      });

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: "Contenido actualizado correctamente",
        data: content,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el contenido",
        error,
      });
    }
  };

  // Eliminar un contenido por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as User;

      // Verificar que el usuario tenga permisos para eliminar contenido
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('delete:content') && user.Role?.name !== 'superadmin') {
        res.status(403).json({
          ...metadata(req, res),
          status: "error",
          message: "No tienes permisos para eliminar contenido",
        });
        return;
      }

      const content = await Content.findByPk(id);
      if (!content) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "Contenido no encontrado",
        });
        return;
      }
      
      await content.destroy();

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
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
