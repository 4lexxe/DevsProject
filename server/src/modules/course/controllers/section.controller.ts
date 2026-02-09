import { Request, Response, RequestHandler } from "express";
import sequelize from "../../../infrastructure/database/db";
import Section from "../models/Section";
import Course from "../models/Course";
import Content from "../models/Content";
import User from "../../user/User";
import { Sequelize, Op } from "sequelize";
import { BaseController } from "./BaseController";
import DriveService from "../../drive/services/driveService";
import { drive } from "googleapis/build/src/apis/drive";
import { generateSlug, generateUniqueSlug } from "../../../shared/utils/slugGenerator";

export default class SectionController extends BaseController {
  static driveService = new DriveService();
  // Crear una nueva sección
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, description, courseId, coverImage, moduleType, colorGradient } = req.body;
      const user = req.user as User;

      // Verificar que el curso existe
      const course = await Course.findByPk(courseId);
      if (!course) {
        SectionController.sendError(res, req, "Curso no encontrado", 400);
        return;
      }

      // Verificar permisos adicionales para crear contenido del curso
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('manage:course_content') && user.Role?.name !== 'superadmin') {
        SectionController.forbidden(res, req, "No tienes permisos para crear secciones de curso");
        return;
      }

      const response = await SectionController.driveService.createFolder(title, course.driveFolderId);

      // Generar slug único
      const existingSlugs = await Section.findAll({
        attributes: ['slug'],
        raw: true,
      }).then(sections => sections.map((s: any) => s.slug).filter(Boolean));
      
      const slug = generateUniqueSlug(title, existingSlugs);

      const newSection = await Section.create({
        title,
        slug,
        description,
        courseId,
        coverImage,
        moduleType,
        colorGradient,
        driveFolderId: response.folderId, // Guardar el ID de la carpeta creada
      });

      SectionController.created(res, req, newSection, "Sección creada correctamente");
    } catch (error) {
      SectionController.handleServerError(res, req, error, "Error al crear la sección");
    }
  };

  // Crear una sección y sus contenidos
  static createSectionAndContents: RequestHandler = async (req, res) => {
    if (!SectionController.handleValidationErrors(req, res)) return;

    const transaction = await sequelize.transaction();
    try {
      const { section, courseId } = req.body;

      const course = await Course.findByPk(courseId);
      if (!course) {
        await transaction.rollback();
        SectionController.sendError(res, req, "Curso no encontrado", 400);
        return;
      }

      const response = await SectionController.driveService.createFolder(section.title, course.driveFolderId);
      const sectionFolderId = response.folderId;
      
      // Generar slug único
      const existingSlugs = await Section.findAll({
        attributes: ['slug'],
        raw: true,
        transaction,
      }).then(sections => sections.map((s: any) => s.slug).filter(Boolean));
      
      const slug = generateUniqueSlug(section.title, existingSlugs);
      
      const newSection = await Section.create(
        {
          title: section.title,
          slug,
          courseId,
          description: section.description,
          moduleType: section.moduleType,
          coverImage: section.coverImage,
          colorGradient: section.colorGradient,
          driveFolderId: sectionFolderId,
        },
        { transaction }
      );

      if (Array.isArray(section.contents) && section.contents.length > 0) {
        await Promise.all(
          section.contents.map(async (contentData: any) => {
            const response = await SectionController.driveService.createFolder(contentData.title, sectionFolderId);
            return await Content.create(
              {
                sectionId: newSection.id,
                title: contentData.title,
                text: contentData.text,
                markdown: contentData.markdown,
                quiz: contentData.quiz,
                resources: contentData.resources,
                duration: contentData.duration,
                position: contentData.position,
                driveFolderId: response.folderId, // Guardar el ID de la carpeta del contenido
              },
              { transaction }
            );
          })
        );
      }

      await transaction.commit();
      SectionController.created(res, req, newSection, "Sección y contenidos creados exitosamente");
    } catch (error) {
      await transaction.rollback();
      SectionController.handleServerError(res, req, error, "Error al crear la sección y contenidos");
    }
  };

  // Actualizar una sección y sus contenidos
  static updateSectionAndContents: RequestHandler = async (req, res) => {
    if (!SectionController.handleValidationErrors(req, res)) return;
    const { section } = req.body;
    const identifier = req.params.id;

    const transaction = await sequelize.transaction();
    try {
      const { section } = req.body;
      const identifier = req.params.id;

      const isNumeric = /^\d+$/.test(identifier);
      let existingSection;
      if (isNumeric) {
        existingSection = await Section.findByPk(identifier, { transaction });
      } else {
        existingSection = await Section.findOne({ where: { slug: identifier }, transaction });
      }
      
      if (!existingSection) {
        await transaction.rollback();
        SectionController.notFound(res, req, "Sección");
        return;
      }

      // Generar slug único si el título cambió
      let slug = existingSection.slug;
      if (section.title !== existingSection.title) {
        const existingSlugs = await Section.findAll({
          attributes: ['slug'],
          raw: true,
          transaction,
        }).then(sections => sections.map((s: any) => s.slug).filter(Boolean).filter((s: string) => s !== existingSection.slug));
        
        slug = generateUniqueSlug(section.title, existingSlugs);
      }

      await existingSection.update(
        {
          title: section.title,
          slug,
          description: section.description,
          moduleType: section.moduleType,
          coverImage: section.coverImage,
          colorGradient: section.colorGradient,
        },
        { transaction }
      );

      const incomingContentIds = section.contents
        .map((c: any) => c.id)
        .filter(Boolean);

      // Obtener contenidos que van a ser eliminados para eliminar sus carpetas de Drive
      const contentsToDelete = await Content.findAll({
        where: {
          sectionId: existingSection.id,
          id: { [Op.notIn]: incomingContentIds },
        },
        transaction,
      });

      // Eliminar carpetas de Drive de contenidos que van a ser eliminados
      for (const contentToDelete of contentsToDelete) {
        if (contentToDelete.driveFolderId) {
          try {
            await SectionController.driveService.deleteFolder(contentToDelete.driveFolderId);
            console.log(` Carpeta de Drive eliminada para contenido: ${contentToDelete.title}`);
          } catch (error) {
            console.warn(` Error al eliminar carpeta de Drive para contenido ${contentToDelete.title}:`, error);
          }
        }
      }

      await Content.destroy({
        where: {
          sectionId: existingSection.id,
          id: { [Op.notIn]: incomingContentIds },
        },
        transaction,
      });

      const contentUpdates = section.contents.map(async (contentData: any) => {
        if (contentData.id) {
          // Actualizar contenido existente
          await Content.update(
            {
              title: contentData.title,
              text: contentData.text,
              markdown: contentData.markdown,
              quiz: contentData.quiz,
              resources: contentData.resources,
              duration: contentData.duration,
              position: contentData.position,
            },
            {
              where: { id: contentData.id, sectionId: existingSection.id },
              transaction,
            }
          );
        } else {
          // Crear nuevo contenido con su carpeta de Drive
          let contentFolderId: string | undefined;
          
          try {
            const folderResponse = await this.driveService.createFolder(
              contentData.title, 
              existingSection.driveFolderId
            );
            if (folderResponse.success && folderResponse.folderId) {
              contentFolderId = folderResponse.folderId;
              console.log(` Carpeta de Drive creada para contenido: ${contentData.title} (ID: ${contentFolderId})`);
            } else {
              console.warn(` No se pudo crear carpeta de Drive para contenido: ${contentData.title}`);
            }
          } catch (error) {
            console.warn(` Error al crear carpeta de Drive para contenido ${contentData.title}:`, error);
          }

          await Content.create(
            {
              sectionId: existingSection.id,
              title: contentData.title,
              text: contentData.text,
              markdown: contentData.markdown,
              quiz: contentData.quiz,
              resources: contentData.resources,
              duration: contentData.duration,
              position: contentData.position,
              driveFolderId: contentFolderId, // Asignar el ID de la carpeta creada
            },
            { transaction }
          );
        }
      });

      await Promise.all(contentUpdates);
      await transaction.commit();

      SectionController.updated(res, req, existingSection, "Sección y contenidos actualizados exitosamente");
    } catch (error) {
      await transaction.rollback();
      SectionController.handleServerError(res, req, error, "Error al actualizar la sección y contenidos");
    }
  };

  // Actualizar una sección
  static update: RequestHandler = async (req, res) => {
    try {
      const identifier = req.params.id;
      const { title, description, courseId, coverImage, moduleType, colorGradient } = req.body;
      const user = req.user as User;

      // Verificar permisos adicionales
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('manage:course_content') && user.Role?.name !== 'superadmin') {
        SectionController.forbidden(res, req, "No tienes permisos para actualizar secciones de curso");
        return;
      }

      const isNumeric = /^\d+$/.test(identifier);
      let section;
      if (isNumeric) {
        section = await Section.findByPk(identifier);
      } else {
        section = await Section.findOne({ where: { slug: identifier } });
      }
      
      if (!section) {
        SectionController.notFound(res, req, "Sección");
        return;
      }

      // Generar slug único si el título cambió
      let slug = section.slug;
      if (title !== section.title) {
        const existingSlugs = await Section.findAll({
          attributes: ['slug'],
          raw: true,
        }).then(sections => sections.map((s: any) => s.slug).filter(Boolean).filter((s: string) => s !== section.slug));
        
        slug = generateUniqueSlug(title, existingSlugs);
      }

      await section.update({
        title,
        slug,
        description,
        courseId,
        coverImage,
        moduleType,
        colorGradient,
      });

      SectionController.updated(res, req, section, "Sección actualizada correctamente");
    } catch (error) {
      SectionController.handleServerError(res, req, error, "Error al actualizar la sección");
    }
  };

  // Eliminar una sección
  static delete: RequestHandler = async (req, res) => {
    try {
      const identifier = req.params.id;
      const user = req.user as User;

      // Verificar que el usuario tenga permisos para eliminar contenido
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('delete:content') && user.Role?.name !== 'superadmin') {
        SectionController.forbidden(res, req, "No tienes permisos para eliminar secciones");
      }

      const isNumeric = /^\d+$/.test(identifier);
      let section;
      if (isNumeric) {
        section = await Section.findByPk(identifier);
      } else {
        section = await Section.findOne({ where: { slug: identifier } });
      }
      
      if (!section) {
        SectionController.notFound(res, req, "Sección");
        return;
      }

      if(section.driveFolderId) {
        await this.driveService.deleteFolder(section.driveFolderId);
      }
      await section.destroy();
      
      SectionController.deleted(res, req, "Sección eliminada correctamente");
    } catch (error) {
      SectionController.handleServerError(res, req, error, "Error al eliminar la sección");
    }
  };
}
