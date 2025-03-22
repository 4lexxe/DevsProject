import cron from "node-cron";
import { Op } from "sequelize";
import DiscountEvent from "../../modules/subscription/models/DiscountEvent";
import MPSubPlan from "../../modules/subscription/models/MPSubPlan";
import Plan from "../../modules/subscription/models/Plan";
import Subscription from "../../modules/subscription/models/Subscription";
import { PreApprovalPlan } from "mercadopago";
import { PreApproval } from "mercadopago";
import { MpConfig } from "../../infrastructure/config/mercadopagoConfig";
import { retryWithExponentialBackoff } from "../utils/retryService";
import MPSubscription from "../../modules/subscription/models/MPSubscription";

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

      const plan = await Plan.findByPk(discount.planId, {
        include: [{ model: MPSubPlan, as: "mpSubPlan" }],
      });

      if (!plan) {
        console.error(
          `No se encontró el plan asociado con el descuento ID ${discount.id}`
        );
        continue;
      }

      if (!plan.mpSubPlan) {
        console.error(
          `No se encontró el plan de MercadoPago asociado con el plan ID ${plan.id}`
        );
        continue;
      }

      const mpPlanResponse = await retryWithExponentialBackoff(() =>
        preApprovalPlan.update({
          id: plan.mpSubPlan!.id,
          updatePreApprovalPlanRequest: {
            auto_recurring: {
              transaction_amount: plan.installmentPrice,
            },
          },
        })
      );

      await plan.mpSubPlan.update({
        reason: mpPlanResponse.reason,
        status: mpPlanResponse.status,
        initPoint: mpPlanResponse.init_point,
        autoRecurring: mpPlanResponse.auto_recurring,
        data: mpPlanResponse,
      });
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

// Configurar el cron job para que se ejecute cada día a medianoche
cron.schedule("2 22 * * *", () => {
  updateExpiredDiscounts();
  updateExpiredSubscriptions();
});
