import { Request, Response, RequestHandler } from "express";
import { Op, literal } from "sequelize";
import Subscription from "../models/Subscription";
import Plan from "../models/Plan";
import User from "../../user/User";
import MPSubPlan from "../models/MPSubPlan";
import MPSubscription from "../models/MPSubscription";
import Invoice from "../models/Invoice";
import Payment from "../models/Payment";
import { PreApproval } from "mercadopago";
import MPSubscriptionController from "./mpSubscriptionController";
import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";
import DiscountEvent from "../models/DiscountEvent";
import { retryWithExponentialBackoff } from "../../../shared/utils/retryService";

interface SubscriptionData {
  userId: bigint;
  planId: bigint;
  paymentId: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

class SubscriptionController {
  static preApproval = new PreApproval(MpConfig);

  // Función para generar metadata
  private static metadata(req: Request, res: Response) {
    return {
      statusCode: res.statusCode,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
      method: req.method,
    };
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

  static async updateSubscription(
    mpSubscriptionId: string,
    data: Partial<SubscriptionData>
  ): Promise<Subscription | null> {
    try {
      // Find the subscription by id or planId
      const subscription = await Subscription.findOne({
        where: {
          mpSubscriptionId: mpSubscriptionId,
        },
      });

      if (!subscription) {
        return null;
      }

      if(data.status === "authorized" && !data.startDate) {
        const plan = await Plan.findByPk(subscription.planId);
        if (!plan) {
          throw new Error("Plan not found");
        }

        const startDate = new Date();
        const endDate = new Date(startDate);

        // Calcular endDate basándose en duration y durationType
        if (plan.durationType === "meses") {
          endDate.setMonth(endDate.getMonth() + plan.duration);
        } else if (plan.durationType === "dias" || plan.durationType === "días") {
          endDate.setDate(endDate.getDate() + plan.duration);
        } else {
          throw new Error(`Tipo de duración no válido: ${plan.durationType}`);
        }

        data.startDate = startDate;
        data.endDate = endDate;
        
        // Update the subscription
        await subscription.update(data);
      }
      console.log(`Subscription updated successfully: ID ${subscription.id}`);
      return subscription;
    } catch (error) {
      console.error(`Error updating subscription ${mpSubscriptionId}:`, error);
      if (error instanceof Error) {
        throw new Error(`Error updating subscription: ${error.message}`);
      }
      throw new Error(`Unknown error updating subscription`);
    }
  }

  static async cancelSubscription(id: bigint): Promise<Subscription | null> {
    try {
      const subscription = await Subscription.findByPk(id, {
        include: [{ model: MPSubscription, as: "mpSubscription" }],
      });

      if (!subscription || !subscription.mpSubscription) {
        console.error(`No se encontró la suscripción con ID: ${id}`);
        return null;
      }

      const preApproval = new PreApproval(MpConfig);
      await retryWithExponentialBackoff(async () => {
        try {
          await preApproval.update({
            id: subscription.mpSubscription.id,
            body: { status: "cancelled" },
          });
        } catch (error: any) {
          if (
            error?.message?.includes(
              "You can not modify a cancelled preapproval."
            )
          ) {
            console.log("La suscripción ya estaba cancelada.");
            return; // No lanzar error, termina el proceso
          }
          throw error; // Otros errores sí se reintentan
        }
      });

      console.log(`Suscripción cancelada exitosamente: ID ${id}`);
      return subscription;
    } catch (error) {
      console.error(`Error al cancelar la suscripción ${id}:`, error);
      if (error instanceof Error) {
        throw new Error(`Error al cancelar suscripción: ${error.message}`);
      }
      throw new Error(`Error desconocido al cancelar suscripción`);
    }
  }

  static getData: RequestHandler = async (req, res) => {
    const userId = (req.session as any).passport?.user?.id;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Usuario no autenticado",
        metadata: this.metadata(req, res),
      });
    }

    try {
      const subscription = await Subscription.findOne({
        where: {
          userId: userId,
        },
        order: [["startDate", "DESC NULLS LAST"]],
        include: [
          { model: Plan, as: "plan", attributes: ["name"] },
          { model: User, as: "user", attributes: ["name", "email"] },
          {
            model: MPSubscription,
            as: "mpSubscription",
            attributes: [
              "nextPaymentDate",
              [
                literal("data->'auto_recurring'->>'transaction_amount'"),
                "transactionAmount",
              ],
            ],
          },
        ],
      });

      if (!subscription) {
        res.status(404).json({
          status: "error",
          message: "Suscripción no encontrada",
          metadata: this.metadata(req, res),
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Suscripción obtenida exitosamente",
        data: subscription,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al obtener la suscripción"
      );
    }
  };

  // Obtener una suscripción por ID
  static getById: RequestHandler = async (req, res) => {
    const userId = (req.session as any).passport?.user?.id;

    if (!userId) {
      res.status(400).json({
        status: "error",
        message: "Usuario no autenticado",
        metadata: this.metadata(req, res),
      });
      return;
    }

    try {
      const subscription = await Subscription.findOne({
        where: {
          userId: userId,
          status: "authorized",
        },
        order: [["startDate", "DESC NULLS LAST"]],
        include: [
          {
            model: Plan,
            as: "plan",
            attributes: [
              "name",
              "description",
              "totalPrice",
              "duration",
              "durationType",
              "features",
              "accessLevel",
              "installments",
              "installmentPrice",
            ],
            include: [{ model: DiscountEvent, as: "discountEvent" }],
          },
          {
            model: MPSubscription,
            as: "mpSubscription",
            attributes: ["nextPaymentDate"],
          },
          {
            model: Payment,
            as: "payments",
            attributes: [
              "id",
              "status",
              "transactionAmount",
              "paymentMethodId",
              "dateApproved",
              "paymentTypeId",
            ],
          },
        ],
      });

      if (!subscription) {
        res.status(404).json({
          status: "error",
          message: "Suscripción no encontrada",
          metadata: this.metadata(req, res),
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Suscripción obtenida exitosamente",
        data: subscription,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al obtener la suscripción"
      );
    }
  };

  static create: RequestHandler = async(req , res) => {
    const { planId, userId, payerEmail } = req.body;

    try {
      // Obtener información del plan
      const plan = await Plan.findByPk(planId, {
        include: [{
          model: DiscountEvent,
          as: "discountEvent",
          attributes: ["value", "event"]
        }],
      });
      if (!plan) {
        res.status(404).json({
          status: "error",
          message: "Plan no encontrado",
          metadata: this.metadata(req, res),
        });
        return;
      }

      // Verificar si el usuario ya tiene una suscripción activa
      const existingSubscription = await Subscription.findOne({
        where: {
          userId: userId,
          status: {
            [Op.in]: ["authorized", "pending"]
          }
        },
        include: [{
          model: MPSubscription,
          as: "mpSubscription",
          attributes: ["id", "status", "initPoint"]
        }]
      });

      if (existingSubscription?.status === "authorized") {
        res.status(400).json({
          status: "error",
          message: "El usuario ya tiene una suscripción activa",
          metadata: this.metadata(req, res),
        });
        return;
      } else if (existingSubscription?.status === "pending") {
        res.status(201).json({
          status: "success",
          message: "El usuario ya tiene una suscripción pendiente",
          metadata: this.metadata(req, res),
          data: {
            initPoint: existingSubscription.mpSubscription?.initPoint
          }
        });
        return;
      }
      // Calcular el precio con descuento si aplica
      let finalPrice = plan.installmentPrice || plan.totalPrice;

      if (plan.discountEvent && plan.discountEvent.value > 0) {
        const discountAmount = (finalPrice * plan.discountEvent.value) / 100;
        finalPrice = finalPrice - discountAmount;
        console.log(`Aplicando descuento: ${plan.discountEvent.value}% - Precio original: ${plan.installmentPrice || plan.totalPrice}, Precio con descuento: ${finalPrice}`);
      }

      // Crear la preaprobación en MercadoPago
      const preApprovalResponse = await this.preApproval.create({
        body: {
          payer_email: payerEmail,
          back_url: process.env.MP_BACK_URL,
          auto_recurring: {
            frequency: plan.durationType === "meses" ? 1 : 1, // Frecuencia de pago
            frequency_type: plan.durationType === "meses" ? "months" : "days",
            transaction_amount: finalPrice,
            currency_id: "ARS", 
          },
          reason: `Suscripción al plan ${plan.name}`,
          external_reference: `subscription_${userId}_${planId}_${Date.now()}`,
          status: "pending",
        }
      });      

      if (!preApprovalResponse || !preApprovalResponse.id) {
        res.status(400).json({
          status: "error",
          message: "Error al crear la suscripción en MercadoPago",
          metadata: this.metadata(req, res),
        });
        return;
      }

      // Crear registro en la tabla MPSubscription con los datos completos de MP
      const mpSubscription = await MPSubscription.create({
        id: preApprovalResponse.id,
        payerId: preApprovalResponse.payer_id || null,
        status: preApprovalResponse.status,
        dateCreated: new Date(preApprovalResponse.date_created || new Date()),
        nextPaymentDate: preApprovalResponse.next_payment_date ? 
          new Date(preApprovalResponse.next_payment_date) : null,
        lastModified: preApprovalResponse.last_modified ? 
          new Date(preApprovalResponse.last_modified) : null,
        applicationId: preApprovalResponse.application_id || null,
        reason: preApprovalResponse.reason || null,
        initPoint: preApprovalResponse.init_point,
        data: preApprovalResponse, // Guardar toda la respuesta de MP
      });

      // Crear registro en la tabla Subscription
      const subscription = await Subscription.create({
        userId: userId,
        planId: planId,
        mpSubscriptionId: preApprovalResponse.id,
        payerId: preApprovalResponse.payer_id,
        payerEmail: payerEmail,
        status: preApprovalResponse.status || "pending",
      });

      console.log(`Suscripción creada exitosamente: ID ${subscription.id}, MP ID ${preApprovalResponse.id}`);

      res.status(201).json({
        status: "success",
        message: "Suscripción creada exitosamente",
        data: {
          initPoint: preApprovalResponse.init_point, // URL para redirigir al usuario si es necesario
        },
        metadata: this.metadata(req, res),
      });

    } catch (error: any) {
      console.error("Error al crear la suscripción:", error);
      
      // Manejar errores específicos de MercadoPago
      if (error.cause) {
        res.status(400).json({
          status: "error",
          message: "Error en MercadoPago",
          details: error.cause,
          metadata: this.metadata(req, res),
        });
        return;
      }

      this.handleServerError(
        res,
        req,
        error,
        "Error interno al crear la suscripción"
      );
    }
  }

  static cancel: RequestHandler = async (req, res) => {
    const subscriptionId = req.params.id;

    try {
      const subscription = await this.cancelSubscription(
        BigInt(subscriptionId)
      );
      if (!subscription) {
        res.status(404).json({
          status: "error",
          message: "Suscripción no encontrada",
          metadata: this.metadata(req, res),
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Suscripción cancelada exitosamente",
        data: subscription,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al cancelar la suscripción"
      );
    }
  };
}

export default SubscriptionController;
