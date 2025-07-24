import { Request, Response, RequestHandler } from "express";
import Category from "../models/Category";
import Course from "../models/Course";
import { Sequelize } from "sequelize";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export default class CategoryController {
  // Obtener todas las categorías
  static getAll: RequestHandler = async (req, res) => {
    try {
      const categories = await Category.findAll({ order: [["id", "ASC"]] });
      res.status(200).json({
        ...metadata(req, res),
        message: "Categorías obtenidas correctamente",
        length: categories.length,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener las categorías",
        error,
      });
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

    res.status(200).json({
      ...metadata(req, res),
      message: "Categorías obtenidas correctamente",
      length: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener las categorías",
      error,
    });
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

    res.status(200).json({
      ...metadata(req, res),
      message: "Categorías obtenidas correctamente",
      length: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener las categorías",
      error,
    });
  }
};



  

  // Obtener una categoría por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        res.status(404).json({ status: "error", message: "Categoría no encontrada" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Categoría obtenida correctamente",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener la categoría",
        error,
      });
    }
  };

  // Crear una nueva categoría
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, icon, description, isActive } = req.body;
      const newCategory = await Category.create({ name, icon, description, isActive });
      res.status(201).json({
        ...metadata(req, res),
        message: "Categoría creada correctamente",
        data: newCategory,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear la categoría",
        error,
      });
    }
  };

  // Actualizar una categoría por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, icon, description, isActive } = req.body;
      const category = await Category.findByPk(id);
      if (!category) {
        res.status(404).json({ status: "error", message: "Categoría no encontrada" });
        return;
      }
      await category.update({ name, icon, description, isActive });
      res.status(200).json({
        ...metadata(req, res),
        message: "Categoría actualizada correctamente",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar la categoría",
        error,
      });
    }
  };

  // Eliminar una categoría por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        res.status(404).json({ status: "error", message: "Categoría no encontrada" });
        return;
      }
      await category.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Categoría eliminada correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar la categoría",
        error,
      });
    }
  };
}
