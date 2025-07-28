import { Request, Response, RequestHandler } from "express";
import MPWebhookEvent from "./MPWebhookEvent";
import MercadoPagoController from "../subscription/controller/mercadopago.controller";
import SubscriptionPaymentController from "../subscription/controller/subcriptionPayment.controller";
import CoursePaymentController from "../purchase/controllers/CoursePayment.controller";
import { retryWithExponentialBackoff } from "../../shared/utils/retryService";
import  { MpConfig } from "../../infrastructure/config/mercadopagoConfig";
import { Payment } from "mercadopago";
/**
 * Controlador minimalista para webhooks de MercadoPago
 * Solo maneja la recepción del webhook y delega el procesamiento
 */
class WebhookController {
  /**
   * Maneja el webhook de MercadoPago
   * Funcionalidad mínima: recibe, guarda y delega
   */
  private static payment = new Payment(MpConfig);

  static handleMercadoPagoWebhook: RequestHandler = async (req, res) => {
    
    try {
      const eventData = req.body;
      console.log("Webhook recibido:", JSON.stringify(eventData, null, 2));

      // Extrae campos básicos
      const { action, type, data } = eventData;
      const eventId = data?.id || null;

      // Guarda el evento en la base de datos
      const newEvent = await MPWebhookEvent.create({
        action,
        type,
        eventId,
        payload: eventData,
      });

      console.log(`Evento guardado con ID: ${newEvent.id}`);

      // Delega el procesamiento al controlador principal
      try {
        await this.processWebhookEvent(action, type, eventId, newEvent.id);
        
        // Respuesta exitosa
        res.status(200).json({
          statusCode: 200,
          status: "success",
          message: "Webhook procesado correctamente",
          eventId: newEvent.id,
          timestamp: new Date().toISOString()
        });
      } catch (processingError) {
        console.error("Error procesando el evento:", processingError);
        
        // Aunque hubo error, responder 200 para evitar reintentos de MercadoPago
        res.status(200).json({
          statusCode: 200,
          status: "warning",
          message: "Evento guardado pero con errores en el procesamiento",
          eventId: newEvent.id,
          error: processingError instanceof Error ? processingError.message : String(processingError),
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error("Error al procesar webhook:", error);
      
      // Responder 200 para evitar reintentos de MercadoPago
      res.status(200).json({
        statusCode: 200,
        status: "error",
        message: "Error al procesar webhook",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  };



  // Método principal para procesar eventos de webhook (llamado desde WebhookController)
  static async processWebhookEvent(
    action: string,
    type: string,
    eventId: string,
    webhookEventId: number
  ): Promise<void> {
    try {
      // Manejar eventos según su tipo
      switch (type) {
        case "subscription_preapproval":
          await MercadoPagoController.handleSubscriptionEvent(action, eventId);
          break;

        case "payment":
          await this.handlePaymentEvent(action, eventId);
          break;

        case "subscription_authorized_payment":
          await MercadoPagoController.handleAuthorizedPaymentEvent(action, eventId);
          break;

        default:
          console.log(`Tipo de evento desconocido: ${type}`);
      }

      // Actualizar el estado del evento como procesado exitosamente
      await MPWebhookEvent.update(
        { status: "processed" },
        { where: { id: webhookEventId } }
      );

    } catch (processingError) {
      console.error("Error procesando el evento:", processingError);

      // Actualizar el evento con información del error
      await MPWebhookEvent.update(
        {
          status: "error",
          processingError:
            processingError instanceof Error
              ? processingError.message
              : String(processingError),
        },
        { where: { id: webhookEventId } }
      );

      // Re-lanzar el error para que el webhook lo maneje
      throw processingError;
    }
  }


  public static async handlePaymentEvent(action: string, eventId: string) {
    console.log(`Procesando evento de pago. Acción: ${action}, ID: ${eventId}`);

    if (!eventId) {
      throw new Error("ID de evento no proporcionado para pago");
    }

    const paymentData = await retryWithExponentialBackoff(() =>
      this.payment.get({ id: eventId })
    );
    if (action === "payment.created") {

      console.log("Datos de pago obtenidos:", paymentData?.id);

      switch (paymentData.operation_type) {
        case "recurring_payment":
            await SubscriptionPaymentController.createPaymentInDB(paymentData);
          
          break;
        case "regular_payment":
          await CoursePaymentController.createPaymentInDB(paymentData);
          break;
        default:
          console.log(`Tipo de operación no manejado: ${paymentData.operation_type}`);
      }
    } else if (action === "payment.updated") {
      
      switch (paymentData.operation_type) {
        case "recurring_payment":
          await SubscriptionPaymentController.updatePaymentInDB(paymentData, eventId);
          console.log("Datos de pago actualizados:", paymentData?.id);
        case "regular_payment":
          await CoursePaymentController.updatePaymentInDB(paymentData, eventId);
          console.log("Datos de pago actualizados:", paymentData?.id);
          break;
        default:
          console.log(`Tipo de operación no manejado: ${paymentData.operation_type}`);
      }
    } else {
      console.log(`Acción de pago no manejada: ${action}`);
    }
  }

}

export default WebhookController;
