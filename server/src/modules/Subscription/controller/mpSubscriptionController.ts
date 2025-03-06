import { Request, Response, RequestHandler } from "express";
import MPSubscription from "../models/MPSubscription"; // Asegúrate de importar el modelo MPSubscription

class MPSubscriptionController {
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

  // Método para obtener todas las suscripciones
  static getAll: RequestHandler = async (req, res) => {
    try {
      const subscriptions = await MPSubscription.findAll();

      res.status(200).json({
        ...this.metadata(req, res),
        status: "success",
        data: subscriptions,
      });
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al obtener las suscripciones"
      );
    }
  };

  // Método para obtener una suscripción por su ID
  static getById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
      const subscription = await MPSubscription.findByPk(id);

      if (!subscription) {
        res.status(404).json({
          ...this.metadata(req, res),
          status: "error",
          message: "Suscripción no encontrada",
        });
        return;
      }

      res.status(200).json({
        ...this.metadata(req, res),
        status: "success",
        data: subscription,
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

  // Método para obtener una suscripción por su subscriptionId
  static getBySubscriptionId: RequestHandler = async (req, res) => {
    const { subscriptionId } = req.params;

    try {
      const subscription = await MPSubscription.findOne({
        where: { id: subscriptionId }, // Busca por el campo id (que es el subscriptionId)
      });

      if (!subscription) {
        res.status(404).json({
          ...this.metadata(req, res),
          status: "error",
          message: "Suscripción no encontrada",
        });
        return;
      }

      res.status(200).json({
        ...this.metadata(req, res),
        status: "success",
        data: subscription,
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






  // Método para crear una suscripción en la base de datos
static async createSubscriptionInDB(subscriptionData: any, subscriptionId: bigint) {
  try {
    const subscription = await MPSubscription.create({
      id: subscriptionData.id,
      subscriptionId: subscriptionId,
      payerId: subscriptionData.payer_id,
      status: subscriptionData.status,
      dateCreated: subscriptionData.date_created,
      nextPaymentDate: subscriptionData.next_payment_date,
      initPoint: subscriptionData.init_point,
      data: subscriptionData,
    });
    
    return subscription;
  } catch (error: unknown) {
    console.error(`Error al crear suscripción ${subscriptionData.id}:`, error);
    
    if (error instanceof Error) {
      throw new Error(`Error al crear suscripción: ${error.message}`);
    } else {
      throw new Error(`Error al crear suscripción: ${String(error)}`);
    }
  }
}

// Método para actualizar una suscripción en la base de datos
static async updateSubscriptionInDB(subscriptionData: any, subscriptionId: string) {
  try {
    // Buscar la suscripción existente
    const subscription = await MPSubscription.findOne({
      where: { id: subscriptionId }
    });

    if (!subscription) {
      console.error("No se encontró la suscripción para actualizar:", subscriptionId);
      return null;
    }

    // Actualizar los campos
    subscription.status = subscriptionData.status;
    subscription.dateCreated = subscriptionData.date_created;
    subscription.nextPaymentDate = subscriptionData.next_payment_date;
    subscription.data = subscriptionData;

    // Guardar los cambios
    await subscription.save();

    return subscription;
  } catch (error: unknown) {
    console.error(`Error al actualizar suscripción ${subscriptionId}:`, error);
    
    if (error instanceof Error) {
      throw new Error(`Error al actualizar suscripción: ${error.message}`);
    } else {
      throw new Error(`Error al actualizar suscripción: ${String(error)}`);
    }
  }
}
}

export default MPSubscriptionController;
