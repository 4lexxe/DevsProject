import { Request, Response, RequestHandler } from "express";
import Category from "../models/Category";
import Course from "../models/Course";
import { Sequelize } from "sequelize";
import { BaseController } from "./BaseController";

export default class CategoryController extends BaseController {
  // Obtener todas las categorías
  static getAll: RequestHandler = async (req, res) => {
    try {
      const categories = await Category.findAll({ order: [["id", "ASC"]] });
      CategoryController.sendSuccess(res, req, categories, "Categorías obtenidas correctamente");
    } catch (error) {
      CategoryController.handleServerError(res, req, error, "Error al obtener las categorías");
    }
  };

  static getAllActives: RequestHandler = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["id", "ASC"]],
      where: { isActive: true },
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("courses->CourseCategory.courseId")),
            "coursesCount",
          ],
        ],
      },
      include: [
        {
          association: "courses",
          attributes: [], // No traer datos de los cursos, solo contar
          through: { attributes: [] }, // No incluir la tabla intermedia en los resultados
        },
      ],
      group: ["Category.id"], // Agrupar por categoría
    });

    CategoryController.sendSuccess(res, req, categories, "Categorías obtenidas correctamente");
  } catch (error) {
    CategoryController.handleServerError(res, req, error, "Error al obtener las categorías");
  }
};

static getAllActivesLimited: RequestHandler = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 2;

    const categories = await Category.findAll({
      order: [["id", "ASC"]],
      where: { isActive: true },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "CourseCategories" AS cc
              WHERE cc."categoryId" = "Category"."id"
            )`),
            "coursesCount",
          ],
        ],
      },
      include: [
        {
          association: "courses",
          attributes: [], // No traer datos de los cursos, solo contar
          through: { attributes: [] }, // No incluir la tabla intermedia en los resultados
        },
      ],
      limit: limit,
    });

    CategoryController.sendSuccess(res, req, categories, "Categorías obtenidas correctamente");
  } catch (error) {
    CategoryController.handleServerError(res, req, error, "Error al obtener las categorías");
  }
};



  

  // Obtener una categoría por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        CategoryController.notFound(res, req, "Categoría");
        return;
      }
      CategoryController.sendSuccess(res, req, category, "Categoría obtenida correctamente");
    } catch (error) {
      CategoryController.handleServerError(res, req, error, "Error al obtener la categoría");
    }
  };

  // Crear una nueva categoría
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, icon, description, isActive } = req.body;
      const newCategory = await Category.create({ name, icon, description, isActive });
      CategoryController.created(res, req, newCategory, "Categoría creada correctamente");
    } catch (error) {
      CategoryController.handleServerError(res, req, error, "Error al crear la categoría");
    }
  };

  // Actualizar una categoría por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, icon, description, isActive } = req.body;
      const category = await Category.findByPk(id);
      if (!category) {
        CategoryController.notFound(res, req, "Categoría");
        return;
      }
      await category.update({ name, icon, description, isActive });
      CategoryController.updated(res, req, category, "Categoría actualizada correctamente");
    } catch (error) {
      CategoryController.handleServerError(res, req, error, "Error al actualizar la categoría");
    }
  };

  // Eliminar una categoría por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        CategoryController.notFound(res, req, "Categoría");
        return;
      }
      await category.destroy();
      CategoryController.deleted(res, req, "Categoría eliminada correctamente");
    } catch (error) {
      CategoryController.handleServerError(res, req, error, "Error al eliminar la categoría");
    }
  };
}
