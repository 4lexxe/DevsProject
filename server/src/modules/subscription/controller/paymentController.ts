import { Request, Response, RequestHandler } from "express";
import axios from "axios"; // Para hacer solicitudes HTTP
import Payment from "../models/Payment"; // Asegúrate de importar el modelo Payment
import Subscription from "../models/Subscription"; // Importa el modelo Subscription si es necesario
import User from "../../user/User"; // Importa el modelo User si es necesario
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import Plan from "../models/Plan";
import MPSubscription from "../models/MPSubscription";

class PaymentController {
  // Función para generar metadata
  static metadata(req: Request, res: Response) {
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
      fullError: error,
    });
  }

  // Métodos existentes (getAll, getById, getByPaymentId)
  static getAll: RequestHandler = async (req, res) => {
    try {
      const payments = await Payment.findAll({
        include: [{ model: Subscription, as: "subscription" }], // Incluye la suscripción asociada
      });

      res.status(200).json({
        ...this.metadata(req, res),
        status: "success",
        data: payments,
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener los pagos");
    }
  };

  static getById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
      const payment = await Payment.findByPk(id, {
        include: [{ model: Subscription, as: "subscription" }], // Incluye la suscripción asociada
      });

      if (!payment) {
        res.status(404).json({
          ...this.metadata(req, res),
          status: "error",
          message: "Pago no encontrado",
        });
        return;
      }

      res.status(200).json({
        ...this.metadata(req, res),
        status: "success",
        data: payment,
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener el pago");
    }
  };

  static getByPaymentId: RequestHandler = async (req, res) => {
    const { paymentId } = req.params;

    try {
      const payment = await Payment.findOne({
        where: { id: paymentId },
        include: [{ model: Subscription, as: "subscription" }], // Incluye la suscripción asociada
      });

      if (!payment) {
        res.status(404).json({
          ...this.metadata(req, res),
          status: "error",
          message: "Pago no encontrado",
        });
        return;
      }

      res.status(200).json({
        ...this.metadata(req, res),
        status: "success",
        data: payment,
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener el pago");
    }
  };

  // Método para crear un pago en la base de datos
  static async createPaymentInDB(paymentData: any) {
    try {
      const payment = await Payment.create({
        id: BigInt(paymentData.id),
        mpSubscriptionId: paymentData.metadata.preapproval_id,
        dateApproved: paymentData.date_approved,
        status: paymentData.status,
        transactionAmount: paymentData.transaction_amount,
        paymentMethodId: paymentData.payment_method_id,
        paymentTypeId: paymentData.payment_type_id,
        data: paymentData,
      });
      
      console.log(`Pago creado en la base de datos con ID: ${payment.id}`);
      return payment;
    } catch (error: unknown) {
      console.error(`Error al crear pago ${paymentData.id}:`, error);

      if (error instanceof Error) {
        throw new Error(`Error al crear pago: ${error.message}`);
      } else {
        throw new Error(`Error al crear pago: ${String(error)}`);
      }
    }
  }

  //Metodo para crear una suscripcion
  static async createSubscription(paymentData: any) {
    
  }

  // Método para actualizar un pago en la base de datos
  static async updatePaymentInDB(paymentData: any, paymentId: string) {
    try {
      // Buscar el pago existente
      const payment = await Payment.findOne({
        where: { id: paymentId },
      });

      if (!payment) {
        console.error("No se encontró el pago para actualizar:", paymentId);
        return null;
      }

      // Actualizar los campos
      payment.dateApproved = paymentData.date_approved;
      payment.status = paymentData.status;
      payment.transactionAmount = paymentData.transaction_amount;
      payment.paymentMethodId = paymentData.payment_method_id;
      payment.paymentTypeId = paymentData.payment_type_id;
      payment.data = paymentData;

      // Guardar los cambios
      await payment.save();

      return payment;
    } catch (error: unknown) {
      console.error(`Error al actualizar pago ${paymentId}:`, error);

      if (error instanceof Error) {
        throw new Error(`Error al actualizar pago: ${error.message}`);
      } else {
        throw new Error(`Error al actualizar pago: ${String(error)}`);
      }
    }
  }
}

export default PaymentController;
