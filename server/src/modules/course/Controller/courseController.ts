import { Request, Response, RequestHandler } from "express";
import Course, { CourseCategory } from "../Course";
import Category from "../../category/Category";
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
      message: "Error de validaciones",
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

export default class CourseController {
  
  // Crear un nuevo curso con categorías
  static create: RequestHandler = async (req, res) => {
    if (!handleValidationErrors(req, res)) return;

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
      handleServerError(res, req, error, "Error al crear el curso");
    }
  };

  // Actualizar un curso por ID
  static update: RequestHandler = async (req, res) => {
    if (!handleValidationErrors(req, res)) return;

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
        categoryIds,
      } = req.body;

      const course = await Course.findByPk(id);
      if (!course) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "Curso no encontrado",
        });
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

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: "Curso actualizado correctamente",
        data: updatedCourse,
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al actualizar el curso");
    }
  };

  // Eliminar un curso por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id);
      if (!course) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "Curso no encontrado",
        });
        return;
      }
      await course.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Curso eliminado correctamente",
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al eliminar el curso");
    }
  };
}