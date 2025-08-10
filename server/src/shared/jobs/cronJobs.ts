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
import CourseDiscount from "../../modules/purchase/models/CourseDiscount";
import Order from "../../modules/purchase/models/Order";
import Cart from "../../modules/purchase/models/Cart";
import CartCourse from "../../modules/purchase/models/CartCourse";
import Course from "../../modules/course/models/Course";
import sequelize from "../../infrastructure/database/db";

const preApprovalPlan = new PreApprovalPlan(MpConfig);

const updateExpiredDiscounts = async () => {
  try {
    const now = new Date();
    
    // Desactivar descuentos de suscripciones expirados
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
      console.log(`Descuento de suscripción con ID ${discount.id} ha sido desactivado.`);

      const plan = await Plan.findByPk(discount.planId);

      if (!plan) {
        console.error(
          `No se encontró el plan asociado con el descuento ID ${discount.id}`
        );
        continue;
      }
    }
    
    // Desactivar descuentos de cursos expirados
    const expiredCourseDiscounts = await CourseDiscount.findAll({
      where: {
        isActive: true,
        endDate: {
          [Op.lte]: now,
        },
      },
    });

    for (const courseDiscount of expiredCourseDiscounts) {
      await courseDiscount.update({ isActive: false });
      console.log(`Descuento de curso con ID ${courseDiscount.id} ha sido desactivado.`);
    }

    // Actualizar precios en carritos activos si hay descuentos expirados
    if (expiredCourseDiscounts.length > 0) {
      await updateCartPricesAfterDiscountExpiration();
    }

    console.log(`Se desactivaron ${expiredDiscounts.length} descuentos de suscripción y ${expiredCourseDiscounts.length} descuentos de curso.`);
  } catch (error) {
    console.error(
      "Error al desactivar descuentos expirados:",
      error
    );
  }
};

/**
 * Actualiza los precios de los carritos activos después de que expiren descuentos
 */
const updateCartPricesAfterDiscountExpiration = async () => {
  try {
    const activeCarts = await Cart.findAll({
      where: { status: "active" },
      include: [
        {
          model: CartCourse,
          as: "cartCourses",
          include: [
            {
              model: Course,
              as: "course",
              include: [
                {
                  model: CourseDiscount,
                  as: "courseDiscount",
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    for (const cart of activeCarts) {
      const transaction = await sequelize.transaction();
      
      try {
        let totalOriginal = 0;
        let totalWithDiscounts = 0;
        let hasChanges = false;

        // Recalcular precios para cada curso en el carrito
        for (const cartCourse of cart.cartCourses as any[]) {
          const course = cartCourse.course;
          const originalPrice = parseFloat(course.price.toString());
          let finalPrice = originalPrice;
          let discountValue = 0;

          // Verificar si hay descuento activo
          const activeDiscount = course.courseDiscount;
          if (activeDiscount && activeDiscount.isActive) {
            const now = new Date();
            if (activeDiscount.startDate <= now && activeDiscount.endDate >= now) {
              discountValue = activeDiscount.value;
              finalPrice = originalPrice - (originalPrice * discountValue) / 100;
            }
          }

          // Verificar si los precios han cambiado
          const currentFinalPrice = parseFloat(cartCourse.priceWithDiscount);
          if (Math.abs(currentFinalPrice - finalPrice) > 0.01) {
            hasChanges = true;
            
            // Actualizar CartCourse
            await CartCourse.update(
              {
                unitPrice: originalPrice,
                discountValue: discountValue,
                priceWithDiscount: finalPrice,
              },
              {
                where: { id: cartCourse.id },
                transaction
              }
            );
          }

          totalOriginal += originalPrice;
          totalWithDiscounts += finalPrice;
        }

        // Si hubo cambios, actualizar el carrito
        if (hasChanges) {
          totalOriginal = Math.round(totalOriginal * 100) / 100;
          totalWithDiscounts = Math.round(totalWithDiscounts * 100) / 100;
          const totalDiscountAmount = Math.round((totalOriginal - totalWithDiscounts) * 100) / 100;

          await Cart.update(
            {
              totalPrice: totalOriginal,
              finalPrice: totalWithDiscounts,
              discountAmount: totalDiscountAmount,
            },
            {
              where: { id: cart.id },
              transaction
            }
          );

          console.log(`Precios actualizados en carrito ID ${cart.id}`);
        }

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        console.error(`Error actualizando precios del carrito ID ${cart.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error al actualizar precios de carritos:", error);
  }
};

/**
 * Marca como expiradas las órdenes que han pasado su fecha de expiración
 */
const updateExpiredOrders = async () => {
  try {
    const now = new Date();
    
    const expiredOrders = await Order.findAll({
      where: {
        status: "pending",
        expired: false,
        expirationDateTo: {
          [Op.lte]: now,
        },
      },
    });

    for (const order of expiredOrders) {
      await order.update({ 
        expired: true,
        status: "expired"
      });
      
      console.log(`Orden ID ${order.id} marcada como expirada y cancelada.`);
    }

    console.log(`Se marcaron como expiradas ${expiredOrders.length} órdenes.`);
  } catch (error) {
    console.error("Error al marcar órdenes como expiradas:", error);
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
  updateExpiredOrders();
});

// Ejecutar limpieza de sesiones cada hora
cron.schedule("0 * * * *", () => {
  console.log("Ejecutando limpieza de sesiones...");
  cleanupExpiredSessions();
});

// Ejecutar verificación de órdenes expiradas cada 15 minutos
//cron.schedule("*/15 * * * *", () => {
//  console.log("Verificando órdenes expiradas...");
//  updateExpiredOrders();
//});
