import cron from "node-cron";
import { Op } from "sequelize";
import DiscountEvent from "../models/DiscountEvent";
import MPSubPlan from "../models/MPSubPlan";
import Plan from "../models/Plan";
import { PreApprovalPlan } from "mercadopago";
import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";

const preApprovalPlan = new PreApprovalPlan(MpConfig);

const updateExpiredDiscounts = async () => {
  try {
    const now = new Date();
    const expiredDiscounts = await DiscountEvent.findAll({
      where: {
        isActive: true,
        endDate: {
          [Op.lt]: now,
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

      const mpPlanResponse = await preApprovalPlan.update({
        id: plan.mpSubPlan.id,
        updatePreApprovalPlanRequest: {
          auto_recurring: {
            transaction_amount: plan.installmentPrice,
          },
        },
      });

      await plan.mpSubPlan.update({
        reason: mpPlanResponse.reason,
        status: mpPlanResponse.status,
        dateCreated: mpPlanResponse.date_created,
        lastModified: mpPlanResponse.last_modified,
        initPoint: mpPlanResponse.init_point,
        frequency: mpPlanResponse.auto_recurring?.frequency,
        frequencyType: mpPlanResponse.auto_recurring?.frequency_type,
        repetitions: mpPlanResponse.auto_recurring?.repetitions,
        transactionAmount: mpPlanResponse.auto_recurring?.transaction_amount,
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

// Configurar el cron job para que se ejecute cada día a medianoche
cron.schedule("0 0 * * *", updateExpiredDiscounts);
