import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import {
  MpConfig,
  MP_BACK_URL,
} from "../../../infrastructure/config/mercadopagoConfig";
import sequelize from "../../../infrastructure/database/db"; // Import sequelize instance
import Plan from "../models/Plan"; // Importa el modelo Plan
import DiscountEvent from "../models/PlanDiscountEvent";
import { PreApprovalPlan } from "mercadopago";
import { retryWithExponentialBackoff } from "../../../shared/utils/retryService";

class PlanController {
  private static preApprovalPlan = new PreApprovalPlan(MpConfig);

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

  // Función para manejar la respuesta exitosa
  private static sendSuccessResponse(
    res: Response,
    statusCode: number,
    message: string,
    data: any,
    req: Request
  ) {
    res.status(statusCode).json({
      status: "success",
      message,
      data,
      ...this.metadata(req, res),
    });
  }

  // Obtener todos los planes
  static getAll: RequestHandler = async (req, res) => {
    try {
      const plans = await Plan.findAll({
        include: [
          { model: DiscountEvent, as: "discountEvent" },
        ],
      });
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
      const plan = await Plan.findByPk(req.params.id, {
        include: [
          { model: DiscountEvent, as: "discountEvent" },
        ],
      });
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

  // Obtener un plan por ID
  static getByIdForSubscription: RequestHandler = async (req, res) => {
    try {
      const plan = await Plan.findByPk(req.params.id, {
        include: [
          { model: DiscountEvent, as: "discountEvent", attributes: ["value", "event"] },
        ],
        attributes: [
          "id",
          "name",
          "description",
          "totalPrice",
          "installments",
          "installmentPrice",
          "duration",
          "durationType",
          "accessLevel",
        ],
      });
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

  // Obtener tres planes destacados por defecto
  static getDefaultPlans: RequestHandler = async (req, res) => {
    try {
      // Buscar planes que estén marcados como destacados o usar otro criterio
      // como popularidad, precio más bajo, o una propiedad específica
      const defaultPlans = await Plan.findAll({
        where: {
          isActive: true,
        },
        include: [
          {
            model: DiscountEvent,
            as: "discountEvent",
            where: {
              isActive: true,
            },
            required: false, // Permitir planes sin eventos de descuento activos
          },
        ],
        order: [["position", "ASC"]],
        limit: 3,
      });

      this.sendSuccessResponse(
        res,
        200,
        "Planes por defecto obtenidos exitosamente",
        defaultPlans,
        req
      );
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al obtener los planes por defecto"
      );
    }
  };

  static createPlan: RequestHandler = async (req, res) => {
    // Validar los datos de entrada
    if (!this.handleValidationErrors(req, res)) return;

    const transaction = await sequelize.transaction();
    let isTransactionFinalized = false; // Flag para rastrear el estado de la transacción

    try {
      // Crear el plan en la base de datos
      const plan = await Plan.create(req.body, { transaction });

      // Commit the transaction if not a subscription plan
      await transaction.commit();
      isTransactionFinalized = true; // Marcar la transacción como finalizada

      // Respuesta exitosa
      this.sendSuccessResponse(
        res,
        201,
        "Plan creado exitosamente",
        { plan },
        req
      );
    } catch (error) {
      // Rollback solo si la transacción no ha sido finalizada
      if (!isTransactionFinalized) {
        await transaction.rollback();
      }
      this.handleServerError(res, req, error, "Error al crear el plan");
    }
  };

  static updatePlan: RequestHandler = async (req, res) => {
    // Validar los datos de entrada
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const plan = await Plan.findByPk(req.params.id);
      if (!plan) {
        res.status(404).json({
          status: "error",
          message: "Plan no encontrado",
          ...this.metadata(req, res),
        });
        return;
      }

      // Actualizar el plan en la base de datos
      await plan.update(req.body);


      // Respuesta exitosa
      this.sendSuccessResponse(
        res,
        200,
        "Plan actualizado exitosamente",
        { plan },
        req
      );
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
