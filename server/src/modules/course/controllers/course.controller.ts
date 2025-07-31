import { Request, Response, RequestHandler } from "express";
import Course, { CourseCategory } from "../models/Course";
import Category from "../models/Category";
import User from "../../user/User";
import { BaseController } from "./BaseController";

export default class CourseController extends BaseController {
  
  // Crear un nuevo curso con categorías
  static create: RequestHandler = async (req, res) => {
    if (!CourseController.handleValidationErrors(req, res)) return;

    try {
      const {
        title,
        image,
        summary,
        about,
        careerTypeId,
        prerequisites,
        learningOutcomes,
        price,
        isActive,
        isInDevelopment,
        adminId,
        categoryIds,
      } = req.body;

      const newCourse = await Course.create({
        title,
        image,
        summary,
        about,
        careerTypeId,
        prerequisites,
        learningOutcomes,
        price,
        isActive,
        isInDevelopment,
        adminId,
      });

      if (categoryIds && categoryIds.length > 0) {
        const activeCategories = await Category.findAll({
          where: { id: categoryIds, isActive: true },
        });

        if (activeCategories.length !== categoryIds.length) {
          CourseController.sendError(res, req, "Una o más categorías no están activas", 400);
          return;
        }

        const courseCategories = categoryIds.map((categoryId: bigint) => ({
          courseId: newCourse.id,
          categoryId,
        }));

        await CourseCategory.bulkCreate(courseCategories);
      }

      CourseController.created(res, req, newCourse, "Curso creado correctamente");
    } catch (error) {
      CourseController.handleServerError(res, req, error, "Error al crear el curso");
    }
  };

  // Actualizar un curso por ID
  static update: RequestHandler = async (req, res) => {
    if (!CourseController.handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const {
        title,
        image,
        summary,
        prerequisites,
        about,
        careerTypeId,
        learningOutcomes,
        isActive,
        isInDevelopment,
        adminId,
        price,
        categoryIds,
      } = req.body;

      const course = await Course.findByPk(id);
      if (!course) {
        CourseController.notFound(res, req, "Curso");
        return;
      }

      await course.update({
        title,
        image,
        summary,
        about,
        prerequisites,
        careerTypeId,
        learningOutcomes,
        isActive,
        isInDevelopment,
        adminId,
        price,
      });

      if (Array.isArray(categoryIds)) {
        await CourseCategory.destroy({ where: { courseId: id } });
        const categoryRelations = categoryIds.map((categoryId: string) => ({
          courseId: id,
          categoryId,
        }));
        await CourseCategory.bulkCreate(categoryRelations);
      }

      const updatedCourse = await Course.findByPk(id, {
        include: [{ model: Category, as: "categories" }],
      });

      CourseController.updated(res, req, updatedCourse, "Curso actualizado correctamente");
    } catch (error) {
      CourseController.handleServerError(res, req, error, "Error al actualizar el curso");
    }
  };

  // Eliminar un curso por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as User;

      // Verificar que el usuario tenga permisos para eliminar cursos
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('delete:courses') && user.Role?.name !== 'superadmin') {
        CourseController.forbidden(res, req, "No tienes permisos para eliminar cursos");
        return;
      }

      const course = await Course.findByPk(id);
      if (!course) {
        CourseController.notFound(res, req, "Curso");
        return;
      }

      await course.destroy();
      
      CourseController.deleted(res, req, "Curso eliminado correctamente");
    } catch (error) {
      CourseController.handleServerError(res, req, error, "Error al eliminar el curso");
    }
  };
}