import e, { Request, Response, RequestHandler } from "express";
import { PreApproval, PreApprovalPlan, Payment, Invoice } from "mercadopago";

import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";

import WebhookEvent from "../models/WebhookEvent";
import MPSubPlan from "../models/MPSubPlan";
import PaymentModel from "../models/Payment";
import Subscription from "../models/Subscription";

import PaymentController from "./paymentController";
import MPSubscriptionController from "./mpSubscriptionController";
import InvoiceController from "./invoiceController";
import SubscriptionController from "./subscriptionController";

class MercadoPagoController {
  // Instancias de las clases de MercadoPago
  private static preApproval = new PreApproval(MpConfig);
  private static preApprovalPlan = new PreApprovalPlan(MpConfig);
  private static payment = new Payment(MpConfig);
  private static invoice = new Invoice(MpConfig);

  // Función para generar metadata
  static generateMetadata(req: Request, res: Response) {
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
      ...this.generateMetadata(req, res),
      status: "error",
      message,
      error: error.message,
      fullError: error,
    });
  }

  // Método para manejar webhooks
  static handleWebhook: RequestHandler = async (req, res) => {

    try {
      const eventData = req.body; // Obtiene el JSON del cuerpo de la solicitud
      console.log("Webhook recibido:", JSON.stringify(eventData, null, 2));

      // Extrae los campos relevantes (manejando casos donde no estén presentes)
      const { action, type, data } = eventData;
      const eventId = data?.id || null;

      // Guarda el evento en la base de datos
      const newEvent = await WebhookEvent.create({
        action,
        type,
        eventId,
        payload: eventData, // Guarda el JSON completo
      });
      console.log(`Evento guardado con ID: ${newEvent.id}`);

      try {
        // Manejar eventos según su tipo
        switch (type) {
          case "subscription_preapproval":
            await this.handleSubscriptionEvent(action, eventId);
            break;

          case "payment":
            await this.handlePaymentEvent(action, eventId);
            break;

          case "subscription_authorized_payment":
            await this.handleAuthorizedPaymentEvent(action, eventId);
            break;

          default:
            console.log(`Tipo de evento desconocido: ${type}`);
        }

        // Respuesta exitosa
        res.status(200).json({
          ...this.generateMetadata(req, res),
          status: "success",
          message: "Evento procesado correctamente",
          event: newEvent,
        });
      } catch (processingError) {
        console.error("Error procesando el evento:", processingError);

        // Actualizar el evento con información del error
        await WebhookEvent.update(
          {
            status: "error",
            processingError:
              processingError instanceof Error
                ? processingError.message
                : String(processingError),
          },
          { where: { id: newEvent.id } }
        );

        // Aunque hubo un error procesando el evento, respondemos 200 para que MercadoPago no reintente
        res.status(200).json({
          ...this.generateMetadata(req, res),
          status: "warning",
          message: "Evento guardado pero con errores en el procesamiento",
          event: newEvent,
        });
      }
    } catch (error) {
      this.handleServerError(res, req, error, "Error al procesar el webhook");
    }
  };

  // Método para manejar eventos de suscripción
  private static async handleSubscriptionEvent(
    action: string,
    eventId: string,
  ) {
    console.log(
      `Procesando evento de suscripción. Acción: ${action}, ID: ${eventId}`
    );

    if (!eventId) {
      throw new Error("ID de evento no proporcionado para suscripción");
    }

    if (action === "created") {
      const subscriptionData = await this.preApproval.get({ id: eventId });
      console.log("Datos de suscripción obtenidos:", subscriptionData?.id);

      // También crear una suscripción en nuestro sistema
      try {
        // Buscar el plan asociado con esta suscripción
        let planId;
        if (subscriptionData?.preapproval_plan_id) {
          // Buscar el plan por el ID del plan de preaprobación
          const mpSubPlan = await MPSubPlan.findOne({
            where: { id: subscriptionData.preapproval_plan_id },
          });
          if (mpSubPlan) {
            planId = mpSubPlan.planId;
          }
        }

        const paymentp = await PaymentModel.findOne({
          where: { mpSubscriptionId: subscriptionData.id },
        });

        if (!planId) {
          throw new Error(
            "No se pudo determinar el plan asociado a la suscripción"
          );
        }

        // Calcular fechas de inicio y fin
        const startDate = new Date();
        if (subscriptionData.auto_recurring?.start_date) {
          startDate.setTime(
            new Date(subscriptionData.auto_recurring.start_date).getTime()
          );
        }

        const endDate = new Date(); 
        if (subscriptionData.auto_recurring?.end_date) {
          endDate.setTime(
            new Date(subscriptionData.auto_recurring.end_date).getTime()
          );
        }
        // Crear la suscripción en nuestro sistema
        const subscription = await SubscriptionController.updateSubscription(
          {planId: planId},
          {
          planId,
          startDate,
          endDate,
          paymentId: paymentp?.id,
          status: subscriptionData.status,
        });

        if (subscription) {
          // Crear la suscripción en MercadoPago DB
          const mpSubscription =
            await MPSubscriptionController.createSubscriptionInDB(
              subscriptionData,
              subscription?.id
            );
        }

        console.log(
          `Suscripción creada en el sistema con ID: ${subscription?.id}`
        );
      } catch (error) {
        console.error("Error al crear la suscripción en el sistema:", error);
        // No lanzamos el error para que no interrumpa el flujo principal
      }
    } else if (action === "updated") {
      const subscriptionData = await this.preApproval.get({ id: eventId });
      console.log("Datos de suscripción actualizados:", subscriptionData?.id);

      // También actualizar en nuestro sistema
      try {
        const mpSubscription =
          await MPSubscriptionController.updateSubscriptionInDB(
            eventId,
            subscriptionData
          );

        if (mpSubscription?.subscriptionId) {
          const paymentp = await PaymentModel.findOne({
            where: { mpSubscriptionId: subscriptionData.id },
          });

          // Obtener la suscripción actual
          const currentSubscription = await Subscription.findByPk( mpSubscription.subscriptionId);

          // Actualizar estado de la suscripción en nuestro sistema solo si paymentId es null
          await SubscriptionController.updateSubscription(
            {id: mpSubscription.subscriptionId},
            {
              paymentId: currentSubscription?.paymentId ? currentSubscription.paymentId : paymentp?.id,
              status: subscriptionData.status,
            }
          );
          console.log(
            `Suscripción actualizada en el sistema con ID: ${mpSubscription.subscriptionId}`
          );
        }
      } catch (error) {
        console.error(
          "Error al actualizar la suscripción en el sistema:",
          error
        );
        // No lanzamos el error para que no interrumpa el flujo principal
      }
    } else {
      console.log(`Acción de suscripción no manejada: ${action}`);
    }
  }


  // Método para manejar eventos de pago
  private static async handlePaymentEvent(action: string, eventId: string) {
    console.log(`Procesando evento de pago. Acción: ${action}, ID: ${eventId}`);

    if (!eventId) {
      throw new Error("ID de evento no proporcionado para pago");
    }

    if (action === "payment.created") {
      const paymentData = await this.payment.get({ id: eventId });

      console.log("Datos de pago obtenidos:", paymentData?.id);

      await PaymentController.createPaymentInDB(paymentData);
    } else if (action === "payment.updated") {
      const paymentData = await this.payment.get({ id: eventId });
      console.log("Datos de pago actualizados:", paymentData?.id);
      await PaymentController.updatePaymentInDB(paymentData, eventId);
    } else {
      console.log(`Acción de pago no manejada: ${action}`);
    }
  }


  // Método para manejar eventos de pago autorizado de suscripción
  private static async handleAuthorizedPaymentEvent(
    action: string,
    eventId: string
  ) {
    console.log(
      `Procesando evento de pago autorizado. Acción: ${action}, ID: ${eventId}`
    );

    if (!eventId) {
      throw new Error("ID de evento no proporcionado para pago autorizado");
    }

    if (action === "created" || action === "updated") {
      const invoiceData = await this.invoice.get({ id: eventId });
      console.log("Datos de factura obtenidos:", invoiceData?.id);

      if (action === "created") {
        await InvoiceController.createInvoiceInDB(invoiceData);
      } else if (action === "updated") {
        await InvoiceController.updateInvoiceInDB(invoiceData, eventId);
      }
    } else {
      console.log(`Acción de pago autorizado no manejada: ${action}`);
    }
  }
}

export default MercadoPagoController;
