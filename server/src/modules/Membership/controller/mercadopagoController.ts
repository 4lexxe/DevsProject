import { Request, Response, RequestHandler } from "express";
import { PreApproval, PreApprovalPlan, MercadoPagoConfig } from "mercadopago";

import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";
import { MP_BACK_URL } from "../../../infrastructure/config/mercadopagoConfig";

import JsonFileHandler from "../../../infrastructure/config/ficheroJSON";

class MercadoPagoController {
  // Instancia de las clases de suscripcion y suscripcionPlan
  static config = new MercadoPagoConfig({
    accessToken: "APP_USR-4832380742964303-022610-ceb2dc7161d8ed7338977cea9e1d80d6-2290216045", // Reemplaza con tu Access Token
  });
  
  private static preApproval = new PreApproval(this.config);
  private static preApprovalPlan = new PreApprovalPlan(this.config);

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

  // Método estático para crear un plan de suscripción
  static async createSubscriptionPlan(req: Request, res: Response) {
    const planData = {
      reason: "Plan de papitas",
      autoRecurring: {
        frequency: 1,
        frequency_type: "days",
        transaction_amount: 100,
        repetitions: 3,
        currency_id: "ARS",
      },
      backUrl: MP_BACK_URL,
    };

    try {
      // Crear el plan en Mercado Pago
      const plan = await this.preApprovalPlan.create({
        body: {
          reason: planData.reason,
          auto_recurring: planData.autoRecurring,
          back_url: planData.backUrl
        },
      });

      // Respuesta exitosa
      res.status(201).json({
        status: "success",
        message: "Plan de suscripción creado exitosamente",
        data: plan,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al crear el plan de suscripción"
      );
    }
  }

  // Crear una suscripción
  static createSubscription: RequestHandler = async (req, res) => {
    const {} = req.body;

    const suscripcion = {
      preApprovalPlanId: "",
      reason: "",
      externalReference: "",
      payerEmail: "test_user_695200991@testuser.com",
      cardTokenId: "",
      autoRecurring: {
        frequency: 1,
        frequency_type: "days",
        transaction_amount: 100,
        currency_id: "ARS",
        /* startDate: "",
        endDate: "", */
      },
      status: "pending",
      backUrl: MP_BACK_URL,
    };

    try {
      // Crear la suscripción en Mercado Pago
      const subscription = await this.preApproval.create({
        body: {
          reason: suscripcion.reason,
          payer_email: suscripcion.payerEmail,
          auto_recurring: suscripcion.autoRecurring,
          back_url: suscripcion.backUrl,
          status: suscripcion.status,
        },
      });

      // Respuesta exitosa
      res.status(201).json({
        status: "success",
        message: "Suscripción creada exitosamente",
        data: subscription,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al crear la suscripción");
    }
  };

  static weebhook: RequestHandler = async (req, res) => {
    const body = req.body;
    JsonFileHandler.insertRecord(body);

    console.log("Esto es lo recibido del weebhook para mercado pago: ");
    console.log(body);

    res.status(200).json({ message: "Webhook received" });
  };
}

export default MercadoPagoController; // Exporta la clase directamente
