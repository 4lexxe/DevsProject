import cron from "node-cron";
import { Op } from "sequelize";
import DiscountEvent from "../models/DiscountEvent";
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

// Configurar el cron job para que se ejecute cada día a medianoche
cron.schedule("0 0 * * *", updateExpiredDiscounts);
