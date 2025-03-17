import { Request, Response, RequestHandler } from "express";
import { Op, literal } from "sequelize";
import Subscription from "../models/Subscription";
import Plan from "../models/Plan";
import User from "../../user/User";
import MPSubPlan from "../models/MPSubPlan";
import MPSubscription from "../models/MPSubscription";

interface SubscriptionData {
  userId: bigint;
  planId: bigint;
  paymentId: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

class SubscriptionController {
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

  /**
   * Updates a subscription by id or planId
   * @param identifier - Object containing either id or planId
   * @param data - The subscription data to update
   * @returns The updated subscription or null if not found
   */
  static async updateSubscription(
    identifier: { id?: bigint; planId?: bigint },
    data: Partial<SubscriptionData>
  ): Promise<Subscription | null> {
    try {
      // Find the subscription by id or planId
      const subscription = await this.findSubscriptionByIdentifier(identifier);
      if (!subscription) {
        return null;
      }

      // Update the subscription
      await subscription.update(data);

      console.log(`Subscription updated successfully: ID ${subscription.id}`);
      return subscription;
    } catch (error) {
      const id = identifier.id || identifier.planId;
      console.error(`Error updating subscription ${id}:`, error);
      if (error instanceof Error) {
        throw new Error(`Error updating subscription: ${error.message}`);
      }
      throw new Error(`Unknown error updating subscription`);
    }
  }

  /**
   * Helper method to find a subscription by id or planId
   */
  private static async findSubscriptionByIdentifier(identifier: {
    id?: bigint;
    planId?: bigint;
  }): Promise<Subscription | null> {
    const { id, planId } = identifier;

    if (!id && !planId) {
      console.error("No identifier provided to find subscription");
      return null;
    }

    let subscription: Subscription | null = null;

    if (id) {
      subscription = await Subscription.findByPk(id);
      if (!subscription) {
        console.error(`Subscription with ID: ${id} not found`);
      }
    } else if (planId) {
      subscription = await Subscription.findOne({ where: { planId } });
      if (!subscription) {
        console.error(`Subscription with planId: ${planId} not found`);
      }
    }

    return subscription;
  }

  static async cancelSubscription(id: number): Promise<Subscription | null> {
    try {
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        console.error(`No se encontró la suscripción con ID: ${id}`);
        return null;
      }

      await subscription.update({ status: "cancelled" });

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

    if(!userId) {
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
              [literal("data->'auto_recurring'->>'transaction_amount'"), "transactionAmount"]
              
            ] 
          }
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
  }


  // Obtener una suscripción por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const subscription = await Subscription.findByPk(req.params.id, {
        include: [{ model: Plan, as:"plan" }, { model:MPSubscription, as:"mpSubscription" }],
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

  // Crear una suscripción (endpoint HTTP)
  static create: RequestHandler = async (req, res) => {
    try {
      // Check if user session exists

      const userId = (req.session as any).passport?.user?.id;
      
      if (!userId) {
        console.error("No user session found.");
        res.status(401).json({
          status: "error",
          message: "Usuario no autenticado",
          metadata: this.metadata(req, res),
        });
        return;
      }

      // Validar que exista el plan
      const plan = await Plan.findByPk(req.body.planId, {
        include: [{ model: MPSubPlan, as: "mpSubPlan" }],
      });
      if (!plan) {
        throw new Error(`El plan con ID ${req.body.planId} no existe`);
      }

      // Validar que el usuario no tenga una suscripcion al plan
      const existingSubscription = await Subscription.findOne({
        where: {
          userId: BigInt(userId),
          planId: BigInt(req.body.planId),
        },
      });

      let subscription;
      if (existingSubscription) {
        switch (existingSubscription.status) {
          case "authorized":
             res.status(400).json({
              status: "error",
              message: "Ya tienes una suscripcion activa a este plan",
              metadata: this.metadata(req, res),
            });
            return;
          case "cancelled":
            await existingSubscription.destroy();
            subscription = await Subscription.create({
              userId: BigInt(userId),
              planId: BigInt(req.body.planId),
              status: "pending",
            });
            break;
          case "pending":
          case "paused":
            subscription = existingSubscription;
            break;
          default:
            res.status(400).json({
              status: "error",
              message: "Estado de suscripción no válido",
              metadata: this.metadata(req, res),
            });
            return;
        }
      } else {
        subscription = await Subscription.create({
          userId: BigInt(userId),
          planId: BigInt(req.body.planId),
          status: "pending",
        });
      }

      res.status(201).json({
        status: "success",
        message: "Suscripción creada exitosamente",
        data: { initPoint: plan.mpSubPlan?.initPoint || "" },
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      console.error("Error al crear la suscripción:", error);
      if (error instanceof Error) {
        this.handleServerError(res, req, error, `Error al crear suscripción: ${error.message}`);
      } else {
        this.handleServerError(res, req, error, `Error desconocido al crear suscripción`);
      }
    }
  };

 
}

export default SubscriptionController;
