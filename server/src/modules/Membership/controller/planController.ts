import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import Plan from "../models/Plan"; // Importa el modelo Plan

class PlanController {
  // Función para generar metadata
  private static metadata(req: Request, res: Response) {
    return {
      statusCode: res.statusCode,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
      method: req.method,
    };
  }

  // Función para manejar errores de validación
  private static handleValidationErrors(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        ...this.metadata(req, res),
        status: "error",
        message: "Error de validaciones",
        errors: errors.array(),
      });
      return false; // Indica que hay errores
    }
    return true; // Indica que no hay errores
  }

  // Función para manejar errores internos del servidor
  private static handleServerError(
    res: Response,
    req: Request,
    error: any,
    message: string
  ) {
    console.error(message, error);
    res.status(500).json({
      ...this.metadata(req, res),
      status: "error",
      message,
      error: error.message,
    });
  }

  // Crear un nuevo plan
  static create: RequestHandler = async (req, res) => {
    // Validar los datos de entrada
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const plan = await Plan.create(req.body);
      res.status(201).json({
        status: "success",
        message: "Plan creado exitosamente",
        data: plan,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al crear el plan");
    }
  };

  // Obtener todos los planes
  static getAll: RequestHandler = async (req, res) => {
    try {
      const plans = await Plan.findAll();
      res.status(200).json({
        status: "success",
        message: "Planes obtenidos exitosamente",
        data: plans,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener los planes");
    }
  };

  // Obtener un plan por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const plan = await Plan.findByPk(req.params.id);
      if (!plan) {
        res.status(404).json({
          status: "error",
          message: "Plan no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "Plan obtenido exitosamente",
        data: plan,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener el plan");
    }
  };

  // Actualizar un plan por ID
  static update: RequestHandler = async (req, res) => {
    // Validar los datos de entrada
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const plan = await Plan.findByPk(req.params.id);
      if (!plan) {
        res.status(404).json({
          status: "error",
          message: "Plan no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }
      await plan.update(req.body);
      res.status(200).json({
        status: "success",
        message: "Plan actualizado exitosamente",
        data: plan,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al actualizar el plan");
    }
  };

  // Eliminar un plan por ID (soft delete)
  static delete: RequestHandler = async (req, res) => {
    try {
      const plan = await Plan.findByPk(req.params.id);
      if (!plan) {
        res.status(404).json({
          status: "error",
          message: "Plan no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }
      await plan.destroy();
      res.status(200).json({
        status: "success",
        message: "Plan eliminado exitosamente",
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al eliminar el plan");
    }
  };
}

export default PlanController; // Exporta la clase directamente
