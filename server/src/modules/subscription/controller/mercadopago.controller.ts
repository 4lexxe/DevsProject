import e, { Request, Response, RequestHandler } from "express";
import { PreApproval, PreApprovalPlan, Payment, Invoice } from "mercadopago";

import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";

import SubscriptionPaymentController from "./subcriptionPayment.controller";
import MPSubscriptionController from "./mpSubscription.controller";
import InvoiceController from "./invoice.controller";
import SubscriptionController from "./subscription.controller";

import { retryWithExponentialBackoff } from "../../../shared/utils/retryService";

class MercadoPagoController {
  // Instancias de las clases de MercadoPago
  private static preApproval = new PreApproval(MpConfig);
  /* private static preApprovalPlan = new PreApprovalPlan(MpConfig); */
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


  // Método para manejar eventos de suscripción
  public static async handleSubscriptionEvent(
    action: string,
    eventId: string
  ) {
    console.log(
      `Procesando evento de suscripción. Acción: ${action}, ID: ${eventId}`
    );

    if (!eventId) {
      throw new Error("ID de evento no proporcionado para suscripción");
    }

    if (action === "created") {
      const subscriptionData = await retryWithExponentialBackoff(() =>
        this.preApproval.get({ id: eventId })
      );
      console.log("Datos de suscripción obtenidos:", subscriptionData?.id);

      // También crear una suscripción en nuestro sistema
      try {
        // Crear la suscripción en MercadoPago DB
        const mpSubscription =
          await MPSubscriptionController.createSubscriptionInDB(
            subscriptionData
          );

        console.log(
          `Suscripción creada en el sistema con ID: ${mpSubscription?.id}`
        );
      } catch (error) {
        console.error("Error al crear la suscripción en el sistema:", error);
        // No lanzamos el error para que no interrumpa el flujo principal
      }
    } else if (action === "updated") {
      const subscriptionData = await retryWithExponentialBackoff(() =>
        this.preApproval.get({ id: eventId })
      ) as any;

      // También actualizar en nuestro sistema
      try {
        const mpSubscription =
          await MPSubscriptionController.updateSubscriptionInDB(
            eventId,
            subscriptionData
          );

        if (mpSubscription) {

          // Actualizar estado de la suscripción en nuestro sistema solo si paymentId es null
          await SubscriptionController.updateSubscription(
              mpSubscription.id,
            {
              status: subscriptionData.status
            }
          );
          console.log(
            `Suscripción actualizada en el sistema con ID: ${mpSubscription?.id}`
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
  public static async handlePaymentEvent(action: string, eventId: string) {
    console.log(`Procesando evento de pago. Acción: ${action}, ID: ${eventId}`);

    if (!eventId) {
      throw new Error("ID de evento no proporcionado para pago");
    }

    if (action === "payment.created") {
      const paymentData = await retryWithExponentialBackoff(() =>
        this.payment.get({ id: eventId })
      );

      console.log("Datos de pago obtenidos:", paymentData?.id);

      await SubscriptionPaymentController.createPaymentInDB(paymentData);
    } else if (action === "payment.updated") {
      const paymentData = await retryWithExponentialBackoff(() =>
        this.payment.get({ id: eventId })
      );
      console.log("Datos de pago actualizados:", paymentData?.id);
      await SubscriptionPaymentController.updatePaymentInDB(paymentData, eventId);
    } else {
      console.log(`Acción de pago no manejada: ${action}`);
    }
  }

  // Método para manejar eventos de pago autorizado de suscripción
  public static async handleAuthorizedPaymentEvent(
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
      const invoiceData = await retryWithExponentialBackoff(() =>
        this.invoice.get({ id: eventId })
      );
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
