import { Request, Response, RequestHandler } from "express";
import Course, { CourseCategory } from "../models/Course";
import Category from "../models/Category";
import CareerType from "../models/CareerType";
import Section from "../models/Section";
import Content from "../models/Content";

// Función para generar metadata
const metadata = (req: Request, res: Response) => {
  return {
    statusCode: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
    method: req.method,
  };
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

export default class CourseGetController{
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
      handleServerError(res, req, error, "Error al obtener los cursos");
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
      handleServerError(res, req, error, "Error al obtener los cursos activos");
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
      handleServerError(res, req, error, "Error al obtener los cursos en desarrollo");
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
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cursos obtenidos correctamente para el admin especificado",
        length: courses.length,
        data: courses,
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener los cursos del admin");
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
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "Curso no encontrado",
        });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Curso obtenido correctamente",
        data: course,
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener el curso");
    }
  };

  // Obtener un curso por ID con secciones y contenidos para navegación
  static getCourseNavigation: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id, {
        attributes: ['id', 'title'],
        include: [
          {
            model: Section,
            as: "sections",
            attributes: ['id', 'title'],
            include: [
              {
                model: Content,
                as: "contents",
                attributes: ['id', 'title'],
              },
            ],
          },
        ],
        order: [
          [{ model: Section, as: "sections" }, 'id', 'ASC'],
          [{ model: Section, as: "sections" }, { model: Content, as: "contents" }, 'id', 'ASC'],
        ],
      });

      if (!course) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: "Curso no encontrado",
        });
        return;
      }

      res.status(200).json({
        ...metadata(req, res),
        message: "Curso obtenido correctamente",
        data: course,
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener el curso para navegación");
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
      handleServerError(res, req, error, "Error al obtener los cursos por categoría");
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
      handleServerError(res, req, error, "Error al obtener los cursos por tipo de carrera");
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
      handleServerError(res, req, error, "Error al obtener el conteo de cursos");
    }
  };


}