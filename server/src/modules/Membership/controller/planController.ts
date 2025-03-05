import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import {
  MpConfig,
  MP_BACK_URL,
} from "../../../infrastructure/config/mercadopagoConfig";
import sequelize from "../../../infrastructure/database/db"; // Import sequelize instance
import Plan from "../models/Plan"; // Importa el modelo Plan
import MPSubPlan from "../models/MPSubPlan"; // Importa el modelo MPSubPlan
import { PreApprovalPlan } from "mercadopago";

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

  // Función para crear un plan en Mercado Pago
  private static async createMercadoPagoPlan(planData: any) {
    return await this.preApprovalPlan.create({
      body: {
        reason: planData.name,
        auto_recurring: {
          frequency: planData.duration / planData.installments,
          frequency_type: (planData.durationType === "días") ? "days" : "months",
          transaction_amount: planData.installmentPrice,
          repetitions: planData.installments,
          currency_id: "ARS",
        },
        payment_methods_allowed: {
          payment_types: [
            { id: "debit_card" },
            { id: "prepaid_card" },
            { id: "account_money" },
          ],
        },
        back_url: MP_BACK_URL,
      },
    });
  }

  private static async saveMercadoPagoSubscriptionPlan(
    mpPlanResponse: any,
    planId: bigint,
    transaction: any
  ) {
    return await MPSubPlan.create(
      {
        id: mpPlanResponse.id,
        planId: planId,
        reason: mpPlanResponse.reason,
        status: mpPlanResponse.status,
        initPoint: mpPlanResponse.init_point,
        autoRecurring: mpPlanResponse.auto_recurring,
        data: mpPlanResponse,
      },
      { transaction }
    );
  }

  // Función para actualizar un plan en Mercado Pago
  private static async updateMercadoPagoPlan(planData: any, mpPlanId: string) {
    return await this.preApprovalPlan.update({
      id: mpPlanId,
      updatePreApprovalPlanRequest: {
        reason: planData.name,
        auto_recurring: {
          frequency: planData.duration / planData.installments,
          frequency_type: (planData.durationType) === "días" ? "days" : "months",
          transaction_amount: planData.installmentPrice,
          repetitions: planData.installmentss,
          currency_id: "ARS",
        },
        payment_methods_allowed: {
          payment_types: [
            { id: "debit_card" },
            { id: "prepaid_card" },
            { id: "account_money" },
          ],
        },
        back_url: MP_BACK_URL,
      },
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

  static createPlan: RequestHandler = async (req, res) => {
    // Validar los datos de entrada
    if (!this.handleValidationErrors(req, res)) return;

    const transaction = await sequelize.transaction();
    let isTransactionFinalized = false; // Flag para rastrear el estado de la transacción

    try {
      // Crear el plan en la base de datos
      const plan = await Plan.create(req.body, { transaction });

      // Si es un plan de suscripción, crear también en Mercado Pago
      if (req.body.saveInMp) {
        try {
          const mpPlanResponse = await this.createMercadoPagoPlan(plan);
          const mpSubPlan = await this.saveMercadoPagoSubscriptionPlan(
            mpPlanResponse,
            plan.id,
            transaction
          );

          // Commit the transaction
          await transaction.commit();
          isTransactionFinalized = true; // Marcar la transacción como finalizada

          // Respuesta exitosa
          this.sendSuccessResponse(
            res,
            201,
            "Plan de suscripción creado exitosamente",
            { plan, mpSubPlan },
            req
          );
          return;
        } catch (error) {
          // Rollback solo si la transacción no ha sido finalizada
          if (!isTransactionFinalized) {
            await transaction.rollback();
            isTransactionFinalized = true; // Marcar la transacción como finalizada
          }
          throw error; // Relanzar el error para que sea manejado por el catch externo
        }
      }

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
      const plan = await Plan.findByPk(req.params.id, {
        include: ["mpSubPlan"],
      });
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

      // Si es un plan de suscripción, actualizar también en Mercado Pago
      if (req.body.saveInMp) {
        if (!plan.mpSubPlan) {
          // Si el plan no existe en Mercado Pago, crear uno nuevo
          const mpPlanResponse = await this.createMercadoPagoPlan(plan);
          const mpSubPlan = await this.saveMercadoPagoSubscriptionPlan(
            mpPlanResponse,
            plan.id,
            null
          );

          // Respuesta exitosa
          this.sendSuccessResponse(
            res,
            201,
            "Plan de suscripción creado exitosamente",
            { plan, mpSubPlan },
            req
          );
        } else {
          const mpPlanResponse = await this.updateMercadoPagoPlan(
            plan,
            plan.mpSubPlan.id
          );

          await plan.mpSubPlan.update({
            reason: mpPlanResponse.reason,
            status: mpPlanResponse.status,
            dateCreated: mpPlanResponse.date_created,
            lastModified: mpPlanResponse.last_modified,
            initPoint: mpPlanResponse.init_point,
            frequency: mpPlanResponse.auto_recurring?.frequency,
            frequencyType: mpPlanResponse.auto_recurring?.frequency_type,
            repetitions: mpPlanResponse.auto_recurring?.repetitions,
            transactionAmount:
              mpPlanResponse.auto_recurring?.transaction_amount,
            data: mpPlanResponse,
          });

          // Respuesta exitosa
          this.sendSuccessResponse(
            res,
            200,
            "Plan de suscripción actualizado exitosamente",
            { plan },
            req
          );
        }

        return;
      }

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
