import { Request, Response, RequestHandler } from "express";
import CareerType from "../models/CareerType";
import { BaseController } from "./BaseController";

export default class CareerTypeController extends BaseController {
  // Obtener todos los CareerTypes
  static getAll: RequestHandler = async (req, res) => {
    try {
      const careerTypes = await CareerType.findAll({ order: [["id", "ASC"]] });
      CareerTypeController.sendSuccess(res, req, careerTypes, "Tipos de carrera obtenidos correctamente");
    } catch (error) {
      CareerTypeController.handleServerError(res, req, error, "Error al obtener los tipos de carrera");
    }
  };

  static getAllActives: RequestHandler = async (req, res) => {
    try {
      const careerTypes = await CareerType.findAll({ order: [["id", "ASC"]], where:{ isActive: true } });
      CareerTypeController.sendSuccess(res, req, careerTypes, "Tipos de carrera obtenidos correctamente");
    } catch (error) {
      CareerTypeController.handleServerError(res, req, error, "Error al obtener los tipos de carrera");
    }
  };

  // Obtener un CareerType por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const careerType = await CareerType.findByPk(id);
      if (!careerType) {
        CareerTypeController.notFound(res, req, "Tipo de carrera");
        return;
      }
      CareerTypeController.sendSuccess(res, req, careerType, "Tipo de carrera obtenido correctamente");
    } catch (error) {
      CareerTypeController.handleServerError(res, req, error, "Error al obtener el tipo de carrera");
    }
  };

  // Crear un nuevo CareerType
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, description, isActive, icon } = req.body;
      const newCareerType = await CareerType.create({
        name,
        description,
        icon,
        isActive,
      });
      CareerTypeController.created(res, req, newCareerType, "Tipo de carrera creado correctamente");
    } catch (error) {
      CareerTypeController.handleServerError(res, req, error, "Error al crear el tipo de carrera");
    }
  };

  // Actualizar un CareerType por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, isActive, icon } = req.body;
      const careerType = await CareerType.findByPk(id);
      if (!careerType) {
        CareerTypeController.notFound(res, req, "Tipo de carrera");
        return;
      }
      await careerType.update({ name, description, isActive, icon });
      CareerTypeController.updated(res, req, careerType, "Tipo de carrera actualizado correctamente");
    } catch (error) {
      CareerTypeController.handleServerError(res, req, error, "Error al actualizar el tipo de carrera");
    }
  };

  // Eliminar un CareerType por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const careerType = await CareerType.findByPk(id);
      if (!careerType) {
        CareerTypeController.notFound(res, req, "Tipo de carrera");
        return;
      }
      await careerType.destroy();
      CareerTypeController.deleted(res, req, "Tipo de carrera eliminado correctamente");
    } catch (error) {
      CareerTypeController.handleServerError(res, req, error, "Error al eliminar el tipo de carrera");
    }
  };
}
