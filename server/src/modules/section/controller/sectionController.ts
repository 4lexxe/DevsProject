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

// Función para manejar errores de validación
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      ...metadata(req, res),
      status: "error",
      message: "Errores de validación",
      errors: errors.array(),
    });
    return false; // Indica que hay errores
  }
  return true; // Indica que no hay errores
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

export default class SectionController {


  // Crear una nueva sección
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, description, courseId, coverImage, moduleType } = req.body;
      const course = await Course.findByPk(courseId);
      if (!course) {
        res.status(400).json({
          ...metadata(req, res),
          status: "error",
          message: "Curso no encontrado",
        });
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
      handleServerError(res, req, error, "Error al crear la sección");
    }
  };

  // Crear una sección y sus contenidos
  static createSectionAndContents: RequestHandler = async (req, res) => {
    if (!handleValidationErrors(req, res)) return;

    const transaction = await sequelize.transaction();
    try {
      const { section, courseId } = req.body;

      const newSection = await Section.create(
        {
          title: section.title,
          courseId,
          description: section.description,
          moduleType: section.moduleType,
          coverImage: section.coverImage,
        },
        { transaction }
      );

      if (Array.isArray(section.contents) && section.contents.length > 0) {
        await Promise.all(
          section.contents.map((contentData: any) =>
            Content.create(
              {
                sectionId: newSection.id,
                title: contentData.title,
                text: contentData.text,
                markdown: contentData.markdown,
                linkType: contentData.linkType,
                link: contentData.link,
                quiz: contentData.quiz ? JSON.stringify(contentData.quiz) : null,
                resources: contentData.resources ? JSON.stringify(contentData.resources) : null,
                duration: contentData.duration,
                position: contentData.position,
              },
              { transaction }
            )
          )
        );
      }

      await transaction.commit();
      res.status(201).json({
        ...metadata(req, res),
        message: "Sección y contenidos creados exitosamente",
        data: newSection,
      });
    } catch (error) {
      await transaction.rollback();
      handleServerError(res, req, error, "Error al crear la sección y contenidos");
    }
  };

  // Actualizar una sección y sus contenidos
  static updateSectionAndContents: RequestHandler = async (req, res) => {
    if (!handleValidationErrors(req, res)) return;

    const transaction = await sequelize.transaction();
    try {
      const { section } = req.body;
      const { id } = req.params;

      const existingSection = await Section.findByPk(id, { transaction });
      if (!existingSection) {
        await transaction.rollback();
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "La sección no existe",
        });
        return;
      }

      await existingSection.update(
        {
          title: section.title,
          description: section.description,
          moduleType: section.moduleType,
          coverImage: section.coverImage,
        },
        { transaction }
      );

      const incomingContentIds = section.contents
        .map((c: any) => c.id)
        .filter(Boolean);

      await Content.destroy({
        where: {
          sectionId: id,
          id: { [Op.notIn]: incomingContentIds },
        },
        transaction,
      });

      const contentUpdates = section.contents.map(async (contentData: any) => {
        if (contentData.id) {
          await Content.update(
            {
              title: contentData.title,
              text: contentData.text,
              markdown: contentData.markdown,
              linkType: contentData.linkType,
              link: contentData.link,
              quiz: contentData.quiz ? JSON.stringify(contentData.quiz) : null,
              resources: contentData.resources ? JSON.stringify(contentData.resources) : null,
              duration: contentData.duration,
              position: contentData.position,
            },
            {
              where: { id: contentData.id, sectionId: id },
              transaction,
            }
          );
        } else {
          await Content.create(
            {
              sectionId: id,
              title: contentData.title,
              text: contentData.text,
              markdown: contentData.markdown,
              linkType: contentData.linkType,
              link: contentData.link,
              quiz: contentData.quiz ? JSON.stringify(contentData.quiz) : null,
              resources: contentData.resources ? JSON.stringify(contentData.resources) : null,
              duration: contentData.duration,
              position: contentData.position,
            },
            { transaction }
          );
        }
      });

      await Promise.all(contentUpdates);
      await transaction.commit();

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: "Sección y contenidos actualizados exitosamente",
        data: existingSection,
      });
    } catch (error) {
      await transaction.rollback();
      handleServerError(res, req, error, "Error al actualizar la sección y contenidos");
    }
  };

  // Actualizar una sección
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, courseId, coverImage, moduleType } = req.body;
      const section = await Section.findByPk(id);

      if (!section) {
        res.status(404).json({
          ...metadata(req, res),
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
      handleServerError(res, req, error, "Error al actualizar la sección");
    }
  };

  // Eliminar una sección
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const section = await Section.findByPk(id);
      if (!section) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "Sección no encontrada",
        });
        return;
      }
      await section.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Sección eliminada correctamente",
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al eliminar la sección");
    }
  };
}