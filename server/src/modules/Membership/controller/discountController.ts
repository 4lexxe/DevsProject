import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import Discount from "../models/Discount"; // Importa el modelo Discount

class DiscountController {
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

  // Crear un nuevo descuento
  static create: RequestHandler = async (req, res) => {
    // Validar los datos de entrada
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const discount = await Discount.create(req.body);
      res.status(201).json({
        status: "success",
        message: "Descuento creado exitosamente",
        data: discount,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al crear el descuento");
    }
  };

  // Obtener todos los descuentos
  static getAll: RequestHandler = async (req, res) => {
    try {
      const discounts = await Discount.findAll();
      res.status(200).json({
        status: "success",
        message: "Descuentos obtenidos exitosamente",
        data: discounts,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al obtener los descuentos"
      );
    }
  };

  // Obtener un descuento por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const discount = await Discount.findByPk(req.params.id);
      if (!discount) {
        res.status(404).json({
          status: "error",
          message: "Descuento no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "Descuento obtenido exitosamente",
        data: discount,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener el descuento");
    }
  };

  // Actualizar un descuento por ID
  static update: RequestHandler = async (req, res) => {
    // Validar los datos de entrada
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const discount = await Discount.findByPk(req.params.id);
      if (!discount) {
        res.status(404).json({
          status: "error",
          message: "Descuento no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }
      await discount.update(req.body);
      res.status(200).json({
        status: "success",
        message: "Descuento actualizado exitosamente",
        data: discount,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al actualizar el descuento"
      );
    }
  };

  // Eliminar un descuento por ID (soft delete)
  static delete: RequestHandler = async (req, res) => {
    try {
      const discount = await Discount.findByPk(req.params.id);
      if (!discount) {
        res.status(404).json({
          status: "error",
          message: "Descuento no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }
      await discount.destroy();
      res.status(200).json({
        status: "success",
        message: "Descuento eliminado exitosamente",
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al eliminar el descuento");
    }
  };
}

export default DiscountController; // Exporta la clase directamente
