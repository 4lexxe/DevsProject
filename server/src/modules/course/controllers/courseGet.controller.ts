import { Request, Response, RequestHandler } from "express";
import Course, { CourseCategory } from "../models/Course";
import Category from "../models/Category";
import CareerType from "../models/CareerType";
import Section from "../models/Section";
import Content from "../models/Content";
import CourseDiscountEvent from "../../purchase/models/CourseDiscountEvent";
import { Op } from "sequelize";
import { BaseController } from "./BaseController";
// Importar asociaciones para asegurar que están cargadas
import "../../purchase/models/Associations";

export default class CourseGetController extends BaseController {
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
      CourseGetController.sendSuccess(res, req, courses, "Cursos obtenidos correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos");
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
          {
            model: CourseDiscountEvent,
            as: "discountEvents",
            where: {
              isActive: true,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() },
            },
            required: false, // LEFT JOIN para incluir cursos sin descuentos
          },
        ],
        order: [["id", "ASC"]],
      });

      // Procesar precios y descuentos para cada curso
      const coursesWithPricing = courses.map(course => {
        const courseData = course.toJSON() as any;
        const originalPrice = parseFloat(courseData.price.toString());
        let finalPrice = originalPrice;
        let totalDiscountPercentage = 0;
        let totalDiscountAmount = 0;

        // Si hay descuentos activos, calcular el total acumulado
        if (courseData.discountEvents && courseData.discountEvents.length > 0) {
          // Sumar todos los porcentajes de descuento
          totalDiscountPercentage = courseData.discountEvents.reduce((total: number, discount: any) => {
            return total + discount.value;
          }, 0);

          // Calcular el monto total de descuento
          totalDiscountAmount = (originalPrice * totalDiscountPercentage) / 100;
          finalPrice = originalPrice - totalDiscountAmount;

          // Asegurar que el precio final no sea negativo
          if (finalPrice < 0) {
            finalPrice = 0;
            totalDiscountAmount = originalPrice;
          }
        }

        return {
          ...courseData,
          pricing: {
            originalPrice,
            finalPrice: Math.round(finalPrice * 100) / 100, // Redondear a 2 decimales
            hasDiscount: courseData.discountEvents && courseData.discountEvents.length > 0,
            discountEvents: courseData.discountEvents || [],
            totalDiscountPercentage,
            savings: Math.round(totalDiscountAmount * 100) / 100, // Redondear a 2 decimales
          },
        };
      });

      CourseGetController.sendSuccess(res, req, coursesWithPricing, "Cursos activos obtenidos correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos activos");
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
      CourseGetController.sendSuccess(res, req, courses, "Cursos en desarrollo obtenidos correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos en desarrollo");
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
      CourseGetController.sendSuccess(res, req, courses, "Cursos obtenidos correctamente para el admin especificado");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos del admin");
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
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      CourseGetController.sendSuccess(res, req, course, "Curso obtenido correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener el curso");
    }
  };

  // Obtener un curso por ID con todos los descuentos aplicados
  static getByIdWithPrices: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id, {
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          { model: Section, as: "sections" },
          {
            model: CourseDiscountEvent,
            as: "discountEvents",
            where: {
              isActive: true,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() },
            },
            required: false, // LEFT JOIN para incluir cursos sin descuentos
          },
        ],
      });
      if (!course) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      // Calcular precio con TODOS los descuentos aplicados
      const courseData = course.toJSON() as any;
      const originalPrice = parseFloat(courseData.price.toString());
      let finalPrice = originalPrice;
      let totalDiscountPercentage = 0;
      let totalDiscountAmount = 0;

      // Si hay descuentos activos, calcular el total acumulado
      if (courseData.discountEvents && courseData.discountEvents.length > 0) {
        // Sumar todos los porcentajes de descuento
        totalDiscountPercentage = courseData.discountEvents.reduce((total: number, discount: any) => {
          return total + discount.value;
        }, 0);

        // Calcular el monto total de descuento
        totalDiscountAmount = (originalPrice * totalDiscountPercentage) / 100;
        finalPrice = originalPrice - totalDiscountAmount;

        // Asegurar que el precio final no sea negativo
        if (finalPrice < 0) {
          finalPrice = 0;
          totalDiscountAmount = originalPrice;
        }
      }

      // Agregar información de precios al objeto de respuesta
      const responseData = {
        ...courseData,
        pricing: {
          originalPrice,
          finalPrice: Math.round(finalPrice * 100) / 100, // Redondear a 2 decimales
          hasDiscount: courseData.discountEvents && courseData.discountEvents.length > 0,
          discountEvents: courseData.discountEvents || [],
          totalDiscountPercentage,
          savings: Math.round(totalDiscountAmount * 100) / 100, // Redondear a 2 decimales
        },
      };

      CourseGetController.sendSuccess(res, req, responseData, "Curso obtenido correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener el curso");
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
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      CourseGetController.sendSuccess(res, req, course, "Curso obtenido correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener el curso para navegación");
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
      CourseGetController.sendSuccess(res, req, courses, "Cursos obtenidos correctamente por categoría");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos por categoría");
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
      CourseGetController.sendSuccess(res, req, courses, "Cursos obtenidos correctamente por tipo de carrera");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos por tipo de carrera");
    }
  };

  // Obtener el conteo total de cursos
  static getTotalCount: RequestHandler = async (req, res) => {
    try {
      const count = await Course.count();
      CourseGetController.sendSuccess(res, req, { total: count }, "Conteo total de cursos obtenido correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener el conteo de cursos");
    }
  };

}