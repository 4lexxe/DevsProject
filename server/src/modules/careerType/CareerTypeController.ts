import { Request, Response, RequestHandler } from "express";
import CareerType from "./CareerType";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export default class CareerTypeController {
  // Obtener todos los CareerTypes
  static getAll: RequestHandler = async (req, res) => {
    try {
      const careerTypes = await CareerType.findAll({ order: [["id", "ASC"]] });
      res.status(200).json({
        ...metadata(req, res),
        message: "Tipos de carrera obtenidos correctamente",
        length: careerTypes.length,
        data: careerTypes,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "error",
          message: "Error al obtener los tipos de carrera",
          error,
        });
    }
  };

  static getAllActives: RequestHandler = async (req, res) => {
    try {
      const careerTypes = await CareerType.findAll({ order: [["id", "ASC"]], where:{ isActive: true } });
      res.status(200).json({
        ...metadata(req, res),
        message: "Tipos de carrera obtenidos correctamente",
        length: careerTypes.length,
        data: careerTypes,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "error",
          message: "Error al obtener los tipos de carrera",
          error,
        });
    }
  };

  // Obtener un CareerType por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const careerType = await CareerType.findByPk(id);
      if (!careerType) {
        res
          .status(404)
          .json({ status: "error", message: "Tipo de carrera no encontrado" });
          return
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Tipo de carrera obtenido correctamente",
        data: careerType,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "error",
          message: "Error al obtener el tipo de carrera",
          error,
        });
    }
  };

  // Crear un nuevo CareerType
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, description, isActive } = req.body;
      const newCareerType = await CareerType.create({
        name,
        description,
        isActive,
      });
      res.status(201).json({
        ...metadata(req, res),
        message: "Tipo de carrera creado correctamente",
        data: newCareerType,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "error",
          message: "Error al crear el tipo de carrera",
          error,
        });
    }
  };

  // Actualizar un CareerType por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;
      const careerType = await CareerType.findByPk(id);
      if (!careerType) {
        res
          .status(404)
          .json({ status: "error", message: "Tipo de carrera no encontrado" });
        return;
      }
      await careerType.update({ name, description, isActive });
      res.status(200).json({
        ...metadata(req, res),
        message: "Tipo de carrera actualizado correctamente",
        data: careerType,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "error",
          message: "Error al actualizar el tipo de carrera",
          error,
        });
    }
  };

  // Eliminar un CareerType por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const careerType = await CareerType.findByPk(id);
      if (!careerType) {
        res
          .status(404)
          .json({ status: "error", message: "Tipo de carrera no encontrado" });
        return;
      }
      await careerType.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Tipo de carrera eliminado correctamente",
      });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "error",
          message: "Error al eliminar el tipo de carrera",
          error,
        });
    }
  };
}
