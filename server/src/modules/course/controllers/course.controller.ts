import { Request, Response, RequestHandler } from "express";
import Course, { CourseCategory } from "../models/Course";
import Category from "../models/Category";
import CareerType from "../models/CareerType";
import User from "../../user/User";
import { BaseController } from "./BaseController";
import { Op } from "sequelize";

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

  // Búsqueda general de cursos
  static search: RequestHandler = async (req, res) => {
    try {
      const { 
        q, // término de búsqueda general
        title,
        category,
        careerType,
        minPrice,
        maxPrice,
        isActive,
        isInDevelopment,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      const whereConditions: any = {};
      const includeConditions: any[] = [
        { model: Category, as: "categories" },
        { model: CareerType, as: "careerType" }
      ];

      // Búsqueda general por término
      if (q) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${q}%` } },
          { summary: { [Op.iLike]: `%${q}%` } },
          { about: { [Op.iLike]: `%${q}%` } },
          { learningOutcomes: { [Op.contains]: [q as string] } },
          { prerequisites: { [Op.contains]: [q as string] } }
        ];
      }

      // Búsqueda específica por título
      if (title) {
        whereConditions.title = { [Op.iLike]: `%${title}%` };
      }

      // Filtro por rango de precios
      if (minPrice || maxPrice) {
        whereConditions.price = {};
        if (minPrice) whereConditions.price[Op.gte] = Number(minPrice);
        if (maxPrice) whereConditions.price[Op.lte] = Number(maxPrice);
      }

      // Filtros booleanos
      if (isActive !== undefined) {
        whereConditions.isActive = isActive === 'true';
      }
      if (isInDevelopment !== undefined) {
        whereConditions.isInDevelopment = isInDevelopment === 'true';
      }

      // Filtro por categoría
      if (category) {
        includeConditions[0] = {
          model: Category,
          as: "categories",
          where: {
            [Op.or]: [
              { name: { [Op.iLike]: `%${category}%` } },
              { id: isNaN(Number(category)) ? null : Number(category) }
            ]
          }
        };
      }

      // Filtro por tipo de carrera
      if (careerType) {
        includeConditions[1] = {
          model: CareerType,
          as: "careerType",
          where: {
            [Op.or]: [
              { name: { [Op.iLike]: `%${careerType}%` } },
              { id: isNaN(Number(careerType)) ? null : Number(careerType) }
            ]
          }
        };
      }

      const { count, rows: courses } = await Course.findAndCountAll({
        where: whereConditions,
        include: includeConditions,
        limit: Number(limit),
        offset,
        order: [[sortBy as string, sortOrder as string]],
        distinct: true
      });

      const totalPages = Math.ceil(count / Number(limit));

      const searchResults = {
        courses,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: count,
          itemsPerPage: Number(limit),
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        },
        searchParams: {
          q, title, category, careerType, minPrice, maxPrice,
          isActive, isInDevelopment, sortBy, sortOrder
        }
      };

      CourseController.sendSuccess(res, req, searchResults, "Búsqueda de cursos realizada correctamente");
    } catch (error) {
      CourseController.handleServerError(res, req, error, "Error al realizar la búsqueda de cursos");
    }
  };

  // Búsqueda avanzada con filtros múltiples
  static advancedSearch: RequestHandler = async (req, res) => {
    try {
      const {
        keywords = [],
        categories = [],
        careerTypes = [],
        priceRange,
        difficulty,
        duration,
        rating,
        isActive = true,
        page = 1,
        limit = 10
      } = req.body;

      const offset = (Number(page) - 1) * Number(limit);
      const whereConditions: any = { isActive };
      const includeConditions: any[] = [];

      // Búsqueda por múltiples palabras clave
      if (keywords.length > 0) {
        const keywordConditions = keywords.map((keyword: string) => ({
          [Op.or]: [
            { title: { [Op.iLike]: `%${keyword}%` } },
            { summary: { [Op.iLike]: `%${keyword}%` } },
            { about: { [Op.iLike]: `%${keyword}%` } },
            { learningOutcomes: { [Op.contains]: [keyword] } }
          ]
        }));
        whereConditions[Op.and] = keywordConditions;
      }

      // Filtro por múltiples categorías
      if (categories.length > 0) {
        includeConditions.push({
          model: Category,
          as: "categories",
          where: {
            [Op.or]: [
              { id: { [Op.in]: categories.filter((c: any) => !isNaN(Number(c))) } },
              { name: { [Op.in]: categories.filter((c: any) => isNaN(Number(c))) } }
            ]
          }
        });
      } else {
        includeConditions.push({ model: Category, as: "categories" });
      }

      // Filtro por múltiples tipos de carrera
      if (careerTypes.length > 0) {
        includeConditions.push({
          model: CareerType,
          as: "careerType",
          where: {
            [Op.or]: [
              { id: { [Op.in]: careerTypes.filter((ct: any) => !isNaN(Number(ct))) } },
              { name: { [Op.in]: careerTypes.filter((ct: any) => isNaN(Number(ct))) } }
            ]
          }
        });
      } else {
        includeConditions.push({ model: CareerType, as: "careerType" });
      }

      // Filtro por rango de precios
      if (priceRange) {
        if (priceRange.min !== undefined) {
          whereConditions.price = { ...whereConditions.price, [Op.gte]: priceRange.min };
        }
        if (priceRange.max !== undefined) {
          whereConditions.price = { ...whereConditions.price, [Op.lte]: priceRange.max };
        }
      }

      const { count, rows: courses } = await Course.findAndCountAll({
        where: whereConditions,
        include: includeConditions,
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      const totalPages = Math.ceil(count / Number(limit));

      const searchResults = {
        courses,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: count,
          itemsPerPage: Number(limit)
        },
        filters: {
          keywords, categories, careerTypes, priceRange, difficulty, duration, rating, isActive
        }
      };

      CourseController.sendSuccess(res, req, searchResults, "Búsqueda avanzada realizada correctamente");
    } catch (error) {
      CourseController.handleServerError(res, req, error, "Error en la búsqueda avanzada");
    }
  };

  // Autocompletado para búsquedas
  static autocomplete: RequestHandler = async (req, res) => {
    try {
      const { q, type = 'all' } = req.query;

      if (!q || (q as string).length < 2) {
        CourseController.sendSuccess(res, req, [], "Término de búsqueda muy corto");
        return;
      }

      const suggestions: any = {
        courses: [],
        categories: [],
        careerTypes: []
      };

      // Sugerencias de cursos
      if (type === 'all' || type === 'courses') {
        const courses = await Course.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: `%${q}%` } },
              { summary: { [Op.iLike]: `%${q}%` } }
            ],
            isActive: true
          },
          attributes: ['id', 'title', 'summary'],
          limit: 5
        });
        suggestions.courses = courses;
      }

      // Sugerencias de categorías
      if (type === 'all' || type === 'categories') {
        const categories = await Category.findAll({
          where: {
            name: { [Op.iLike]: `%${q}%` },
            isActive: true
          },
          attributes: ['id', 'name'],
          limit: 5
        });
        suggestions.categories = categories;
      }

      // Sugerencias de tipos de carrera
      if (type === 'all' || type === 'careerTypes') {
        const careerTypes = await CareerType.findAll({
          where: {
            name: { [Op.iLike]: `%${q}%` },
            isActive: true
          },
          attributes: ['id', 'name'],
          limit: 5
        });
        suggestions.careerTypes = careerTypes;
      }

      CourseController.sendSuccess(res, req, suggestions, "Sugerencias obtenidas correctamente");
    } catch (error) {
      CourseController.handleServerError(res, req, error, "Error al obtener sugerencias");
    }
  };
}