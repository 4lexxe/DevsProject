import cron from "node-cron";
import { Op } from "sequelize";
import DiscountEvent from "../../modules/subscription/models/PlanDiscountEvent";
import Plan from "../../modules/subscription/models/Plan";
import Subscription from "../../modules/subscription/models/Subscription";
import { PreApprovalPlan } from "mercadopago";
import { PreApproval } from "mercadopago";
import { MpConfig } from "../../infrastructure/config/mercadopagoConfig";
import { retryWithExponentialBackoff } from "../utils/retryService";
import MPSubscription from "../../modules/subscription/models/MPSubscription";
import { SessionService } from "../../modules/auth/services/session.service";

const preApprovalPlan = new PreApprovalPlan(MpConfig);

const updateExpiredDiscounts = async () => {
  try {
    const now = new Date();
    const expiredDiscounts = await DiscountEvent.findAll({
      where: {
        isActive: true,
        endDate: {
          [Op.lte]: now,
        },
      },
    });

    for (const discount of expiredDiscounts) {
      await discount.update({ isActive: false });
      console.log(`Descuento con ID ${discount.id} ha sido desactivado.`);

      const plan = await Plan.findByPk(discount.planId);

      if (!plan) {
        console.error(
          `No se encontró el plan asociado con el descuento ID ${discount.id}`
        );
        continue;
      }
    }
  } catch (error) {
    console.error(
      "Error al desactivar descuentos expirados o actualizar planes:",
      error
    );
  }
};

const updateExpiredSubscriptions = async () => {
  try {
    const now = new Date();
    const expiredSubscriptions = await Subscription.findAll({
      where: {
        status: "authorized",
        endDate: {
          [Op.lte]: now,
        },
      },
      include: [{ model: MPSubscription, as: "mpSubscription" }],
    });

    for (const subscription of expiredSubscriptions) {

      const preApproval = new PreApproval(MpConfig);
      await retryWithExponentialBackoff(() =>
        preApproval.update({
          id: subscription.mpSubscription.id,
          body: {
            status: "cancelled",
          },
        })
      );
    }
  } catch (error) {
    console.error(
      "Error al cancelar suscripciones expiradas:",
      error
    );
  }
};

// Limpiar sesiones expiradas cada hora
const cleanupExpiredSessions = async () => {
  try {
    await SessionService.cleanupExpiredSessions();
    console.log("Sesiones expiradas limpiadas exitosamente");
  } catch (error) {
    console.error("Error al limpiar sesiones expiradas:", error);
  }
};

// Ejecutar tareas diarias a medianoche
cron.schedule("0 0 * * *", () => {
  console.log("Ejecutando tareas programadas diarias...");
  updateExpiredDiscounts();
  updateExpiredSubscriptions();
});

// Ejecutar limpieza de sesiones cada hora
cron.schedule("0 * * * *", () => {
  console.log("Ejecutando limpieza de sesiones...");
  cleanupExpiredSessions();
});
