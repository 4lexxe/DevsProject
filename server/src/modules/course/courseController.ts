import { Request, Response, RequestHandler } from "express";
import Course, { CourseCategory } from "./Course";
import Category from "../category/Category";
import CareerType from "../careerType/CareerType";
import Admin from "../admin/Admin";
import { validationResult } from "express-validator";
import Section from "../section/Section";

const metadata = (req: any, res: any) => {
  return {
    statusCode: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export class CourseController {
  // Obtener todos los cursos
  static getAll: RequestHandler = async (req, res) => {
    try {
      const courses = await Course.findAll({
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
        ],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cursos obtenidos correctamente",
        length: courses.length,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los cursos",
        error,
      });
    }
  };

  // Obtener cursos activos
  static getActiveCourses: RequestHandler = async (req, res) => {
    try {
      const courses = await Course.findAll({
        where: { isActive: true },
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
        ],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cursos activos obtenidos correctamente",
        length: courses.length,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los cursos activos",
        error,
      });
    }
  };

  // Obtener cursos en desarrollo
  static getInDevelopmentCourses: RequestHandler = async (req, res) => {
    try {
      const courses = await Course.findAll({
        where: { isInDevelopment: true },
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
        ],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cursos en desarrollo obtenidos correctamente",
        length: courses.length,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los cursos en desarrollo",
        error,
      });
    }
  };

  // Obtener un curso por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id, {
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          { model: Section, as: "sections" },
        ],
      });
      if (!course) {
        res
          .status(404)
          .json({ status: "error", message: "Curso no encontrado" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Curso obtenido correctamente",
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el curso",
        error,
      });
    }
  };

  // Obtener cursos por el ID de un admin
  static getByAdminId: RequestHandler = async (req, res) => {
    try {
      const { adminId } = req.params;
      const courses = await Course.findAll({
        where: { adminId },
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          { model: Section, as: "sections" },
        ],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cursos obtenidos correctamente para el admin especificado",
        length: courses.length,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los cursos del admin",
        error,
      });
    }
  };

  // Obtener el conteo total de cursos
  static getTotalCount: RequestHandler = async (req, res) => {
    try {
      const count = await Course.count();
      res.status(200).json({
        ...metadata(req, res),
        message: "Conteo total de cursos obtenido correctamente",
        total: count,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el conteo de cursos",
        error,
      });
    }
  };

  // Obtener cursos por categoría
  static getByCategory: RequestHandler = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const courses = await Course.findAll({
        include: [
          { model: Category, as: "categories", where: { id: categoryId } },
          { model: CareerType, as: "careerType" },
        ],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cursos obtenidos correctamente por categoría",
        length: courses.length,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los cursos por categoría",
        error,
      });
    }
  };

  // Obtener cursos por tipo de carrera

  static getByCareerType: RequestHandler = async (req, res) => {
    try {
      const { careerTypeId } = req.body;
      const courses = await Course.findAll({
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType", where: { id: careerTypeId } },
        ],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cursos obtenidos correctamente por tipo de carrera",
        length: courses.length,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los cursos por tipo de carrera",
        error,
      });
    }
  };

  // Crear un nuevo curso con categorías
  static create: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Error de validaciones",
        errors: errors.array(),
      });
      return;
    }

    try {
      const {
        title,
        image,
        summary,
        about,
        careerTypeId,
        prerequisites,
        learningOutcomes,
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
        isActive,
        isInDevelopment,
        adminId,
      });

      if (categoryIds && categoryIds.length > 0) {
        const activeCategories = await Category.findAll({
          where: { id: categoryIds, isActive: true },
        });

        if (activeCategories.length !== categoryIds.length) {
          res.status(400).json({
            ...metadata(req, res),
            status: "error",
            message: "Una o más categorías no están activas",
          });
          return;
        }

        const courseCategories = categoryIds.map((categoryId: bigint) => ({
          courseId: newCourse.id,
          categoryId,
        }));

        await CourseCategory.bulkCreate(courseCategories);
      }

      res.status(201).json({
        ...metadata(req, res),
        status: "success",
        message: "Curso creado correctamente",
        data: newCourse,
      });
    } catch (error) {
      res.status(500).json({
        ...metadata(req, res),
        status: "error",
        message: "Error al crear el curso",
        error,
      });
    }
  };

  // Actualizar un curso por ID
  static update: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Error de validaciones",
        errors: errors.array(),
      });
      return;
    }

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
        categoryIds, // 🔹 Nuevo campo
      } = req.body;

      // Buscar el curso
      const course = await Course.findByPk(id);

      if (!course) {
        res.status(404).json({ status: "error", message: "Curso no encontrado" });
        return
      }

      // Actualizar los datos del curso
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
      });

      // 🔹 Si `categoryIds` existe, actualizar la relación
      if (Array.isArray(categoryIds)) {
        // 1️⃣ Eliminar relaciones previas del curso en la tabla intermedia
        await CourseCategory.destroy({ where: { courseId: id } });

        // 2️⃣ Insertar nuevas relaciones en la tabla intermedia
        const categoryRelations = categoryIds.map((categoryId: string) => ({
          courseId: id,
          categoryId,
        }));

        await CourseCategory.bulkCreate(categoryRelations);
      }

      // Obtener el curso actualizado con sus relaciones
      const updatedCourse = await Course.findByPk(id, {
        include: [{ model: Category, as: "categories" }],
      });

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: "Curso actualizado correctamente",
        data: updatedCourse,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el curso",
        error,
      });
    }
  };

  // Eliminar un curso por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id);
      if (!course) {
        res
          .status(404)
          .json({ status: "error", message: "Curso no encontrado" });
        return;
      }
      await course.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Curso eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el curso",
        error,
      });
    }
  };
}
