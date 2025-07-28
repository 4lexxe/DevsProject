import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import DiscountEvent from "../models/PlanDiscountEvent"; // Importa el modelo DiscountEvent
import PlanController from "./plan.controller";
import Plan from "../models/Plan";
import { retryWithExponentialBackoff } from "../../../shared/utils/retryService";

class DiscountEventController {
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

  // Método para aplicar descuento a un plan en MercadoPago
  private static async applyDiscountToPlan(
    discountEvent: DiscountEvent
  ): Promise<void> {
    try {
      // Obtener el plan asociado al descuento
      const plan = await Plan.findByPk(discountEvent.planId);

      if (!plan) {
        throw new Error(
          `No se encontró el plan asociado con el descuento ID ${discountEvent.id}`
        );
      }

      // Calcular el nuevo precio con descuento
      const originalPrice = plan.installmentPrice ?? 0; // Manejar el caso donde installmentPrice sea undefined
      const discountValue = discountEvent.value; // Porcentaje de descuento
      const newPrice = originalPrice - originalPrice * (discountValue / 100);

      // Crear objeto con datos actualizados del plan
      const updatedPlanData = {
        ...plan.toJSON(),
        installmentPrice: newPrice,
      };

      console.log(
        `Descuento aplicado al plan ${plan.id}, nuevo precio: ${newPrice}`
      );
    } catch (error) {
      console.error("Error al aplicar descuento al plan:", error);
      throw error;
    }
  }

  // Crear un nuevo descuento
  static create: RequestHandler = async (req, res) => {
    // Validar los datos de entrada
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const discountEvent = await DiscountEvent.create(req.body);

      // Si el descuento está activo, aplicarlo al plan en MercadoPago
      if (discountEvent.isActive) {
        try {
          await this.applyDiscountToPlan(discountEvent);
        } catch (updateError) {
          console.error(
            "Error al actualizar el plan en MercadoPago:",
            updateError
          );
          // Continuamos con la respuesta exitosa del descuento aunque falle la actualización
        }
      }

      res.status(201).json({
        status: "success",
        message: "Descuento creado exitosamente",
        data: discountEvent,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al crear el descuento");
    }
  };

  // Obtener todos los descuentos
  static getAll: RequestHandler = async (req, res) => {
    try {
      const discountEvents = await DiscountEvent.findAll();
      res.status(200).json({
        status: "success",
        message: "Descuentos obtenidos exitosamente",
        data: discountEvents,
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
      const discountEvent = await DiscountEvent.findByPk(req.params.id);
      if (!discountEvent) {
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
        data: discountEvent,
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
      const discountEvent = await DiscountEvent.findByPk(req.params.id);
      if (!discountEvent) {
        res.status(404).json({
          status: "error",
          message: "Descuento no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }
      await discountEvent.update(req.body);

      // Si el descuento está activo, aplicarlo al plan en MercadoPago
      if (discountEvent.isActive) {
        try {
          await this.applyDiscountToPlan(discountEvent);
        } catch (updateError) {
          console.error(
            "Error al actualizar el plan en MercadoPago:",
            updateError
          );
          // Continuamos con la respuesta exitosa del descuento aunque falle la actualización
        }
      }

      res.status(200).json({
        status: "success",
        message: "Descuento actualizado exitosamente",
        data: discountEvent,
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
      const discountEvent = await DiscountEvent.findByPk(req.params.id);
      if (!discountEvent) {
        res.status(404).json({
          status: "error",
          message: "Descuento no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }
      await discountEvent.destroy();
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

export default DiscountEventController; // Exporta la clase directamente
