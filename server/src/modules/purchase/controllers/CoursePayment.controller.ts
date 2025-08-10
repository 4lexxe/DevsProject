import { Request, Response, RequestHandler } from "express";
import { Payment, MerchantOrder } from "mercadopago";
import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";
import { BaseController } from "./BaseController";
import PreferencePayment from "../models/PreferencePayment";
import CourseAccess from "../models/CourseAccess";
import Cart from "../models/Cart";
import CartCourse from "../models/CartCourse";
import { retryWithExponentialBackoff } from "../../../shared/utils/retryService";
// Importar asociaciones para asegurar que están cargadas
import "../models/Associations";
import { Order } from "../models/Associations";

/**
 * Controlador para gestionar pagos de cursos usando MercadoPago
 * Extiende BaseController para respuestas consistentes y métodos utilitarios
 */
class CoursePaymentController extends BaseController {
  private static payment = new Payment(MpConfig);
  private static merchantOrder = new MerchantOrder(MpConfig);

  /**
   * Crea un nuevo registro de pago en la base de datos
   * @param paymentData - Datos del pago desde MercadoPago
   */
  static async createPaymentInDB(paymentData: any): Promise<PreferencePayment> {
    try {
      const {
        payer,
        additional_info: { items },
        ...data
      } = paymentData;

      // Debug: Log de la metadata para verificar estructura
      console.log(
        "🔍 Metadata del pago:",
        JSON.stringify(paymentData.metadata, null, 2)
      );
      console.log("🔍 External reference:", paymentData.external_reference);

      // Buscar la orden asociada al pago usando external_reference
      let order = null;

      // Verificar el tipo de compra basándose en la metadata
      const isDirectPurchase =
        paymentData.metadata?.purchase_type === "direct" ||
        paymentData.external_reference?.startsWith("direct_");
      const isCartPurchase = paymentData.metadata?.type === "cart";

      console.log("🔍 Tipo de compra detectado:", {
        isDirectPurchase,
        isCartPurchase,
      });

      if (isDirectPurchase) {
        // Compra directa: buscar por external_reference
        order = await Order.findOne({
          where: { externalReference: paymentData.external_reference },
        });
        console.log("🔍 Orden encontrada (directa):", order?.id);
      } else if (isCartPurchase) {
        order = await Order.findOne({
          where: { externalReference: paymentData.external_reference },
        });
        console.log(
          "🔍 Buscando orden para:",
          paymentData.external_reference,
          "Orden encontrada:",
          order?.id
        );
      } else {
        console.warn(
          "🔍 No se encontró cart_id en metadata para pago de carrito"
        );
      }

      if (!order) {
        console.warn(
          "No se encontró la orden asociada al pago:",
          paymentData.id,
          "external_reference:",
          paymentData.external_reference
        );
      }

      const paymentRecord = await PreferencePayment.create({
        id: paymentData.id,
        orderId: order?.id || null,
        externalReference: paymentData.external_reference || null,
        status: paymentData.status || "pending",
        metadata: paymentData.metadata || null,
        transactionAmount: paymentData.transaction_amount || 0,
        paymentMethodId: paymentData.payment_method_id || null,
        paymentTypeId: paymentData.payment_type_id || null,
        dateApproved: paymentData.date_approved
          ? new Date(paymentData.date_approved)
          : null,
        items: items,
        payer: payer,
        data: data, // Guardar todos los datos del pago en formato JSON
      });

      // Si el pago está aprobado, crear accesos a cursos y actualizar orden
      if (paymentData.status === "approved") {
        // Actualizar estado de la orden si existe
        if (order) {
          await order.update({ status: "paid" });
        }

        // Crear accesos a cursos
        await this.createCourseAccessesForPayment(paymentData);
      }

      return paymentRecord;
    } catch (error) {
      console.error("Error creando pago en DB:", error);
      throw error;
    }
  }

  /**
   * Crea accesos a cursos cuando un pago es aprobado
   * Maneja tanto pagos de carrito como compras directas
   * @param paymentData - Datos del pago desde MercadoPago
   */
  private static async createCourseAccessesForPayment(paymentData: any) {
    try {
      const externalReference = paymentData.external_reference;

      if (!externalReference) {
        console.warn(
          "No se encontró external_reference en el pago:",
          paymentData.id
        );
        return;
      }

      // Verificar el tipo de compra basándose en la metadata y external_reference
      const isDirectPurchase =
        paymentData.metadata?.purchase_type === "direct" ||
        externalReference.startsWith("direct_");
      const isCartPurchase = paymentData.metadata?.type === "cart";

      if (isDirectPurchase) {
        // Es una compra directa: formato "direct_{courseId}_{userId}_{timestamp}"
        await this.handleDirectPurchaseAccess(paymentData, externalReference);
      } else if (
        isCartPurchase ||
        (!isDirectPurchase && !externalReference.startsWith("direct_"))
      ) {
        // Es un pago de carrito: usar cart_id de la metadata
        const cartId = paymentData.metadata?.cart_id;
        if (cartId) {
          await this.handleCartPurchaseAccess(paymentData, cartId);
        } else {
          console.error(
            "No se encontró cart_id en metadata para pago de carrito:",
            paymentData.id
          );
        }
      } else {
        console.warn(
          "No se pudo determinar el tipo de compra para el pago:",
          paymentData.id
        );
      }
    } catch (error) {
      console.error("❌ Error creando accesos a cursos:", error);
      // No relanzar el error para no fallar el pago principal
    }
  }

  /**
   * Maneja el acceso para compras directas
   */
  private static async handleDirectPurchaseAccess(
    paymentData: any,
    externalReference: string
  ) {
    try {
      // Parsear el external_reference: "direct_{courseId}_{userId}_{timestamp}"
      const parts = externalReference.split("_");
      if (parts.length < 3) {
        console.error(
          "Formato inválido de external_reference para compra directa:",
          externalReference
        );
        return;
      }

      const courseId = parseInt(parts[1]);
      const userId = parseInt(parts[2]);

      if (isNaN(courseId) || isNaN(userId)) {
        console.error(
          "IDs inválidos en external_reference:",
          externalReference
        );
        return;
      }

      // Verificar si ya existe acceso para evitar duplicados
      const existingAccess = await CourseAccess.findOne({
        where: {
          courseId,
          userId,
        },
      });

      if (!existingAccess) {
        await CourseAccess.create({
          courseId,
          userId,
          accessToken: this.generateAccessToken(),
          grantedAt: new Date(),
          revokedAt: null,
          revokeReason: null,
        });

        console.log(
          `✅ Acceso directo creado para usuario ${userId} al curso ${courseId}`
        );
      } else {
        console.log(
          `ℹ️ El usuario ${userId} ya tiene acceso al curso ${courseId}`
        );
      }

      console.log(`🎉 Compra directa completada para curso ${courseId}`);
    } catch (error) {
      console.error("❌ Error procesando compra directa:", error);
    }
  }

  /**
   * Maneja el acceso para pagos de carrito
   */
  private static async handleCartPurchaseAccess(
    paymentData: any,
    cartId: string
  ) {
    try {
      // Obtener el carrito y sus cursos
      const cart = await Cart.findByPk(cartId);
      if (!cart) {
        console.error(`No se encontró el carrito con ID: ${cartId}`);
        return;
      }

      // Actualizar el estado del carrito a 'paid'
      await cart.update({ status: "paid" });

      // Obtener todos los cursos del carrito
      const cartCourses = await CartCourse.findAll({
        where: { cartId },
      });

      console.log(
        `Creando accesos para ${cartCourses.length} cursos del carrito ${cartId}`
      );

      // Crear acceso para cada curso
      for (const cartCourse of cartCourses) {
        // Verificar si ya existe acceso para evitar duplicados
        const existingAccess = await CourseAccess.findOne({
          where: {
            courseId: cartCourse.courseId,
            userId: cart.userId,
          },
        });

        if (!existingAccess) {
          await CourseAccess.create({
            courseId: cartCourse.courseId,
            userId: cart.userId,
            accessToken: this.generateAccessToken(),
            grantedAt: new Date(),
            revokedAt: null,
            revokeReason: null,
          });

          console.log(
            `✅ Acceso creado para usuario ${cart.userId} al curso ${cartCourse.courseId}`
          );
        } else {
          console.log(
            `ℹ️ El usuario ${cart.userId} ya tiene acceso al curso ${cartCourse.courseId}`
          );
        }
      }

      console.log(
        `🎉 Proceso de creación de accesos completado para carrito ${cartId}`
      );
    } catch (error) {
      console.error("❌ Error procesando pago de carrito:", error);
    }
  }

  /**
   * Genera un token de acceso único para el curso
   */
  private static generateAccessToken(): string {
    return `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Actualiza un registro de pago existente en la base de datos
   * @param paymentId - ID del pago en la base de datos
   * @param paymentData - Datos actualizados del pago desde MercadoPago
   */
  static async updatePaymentInDB(paymentData: any, paymentId: string) {
    try {
      // Buscar el pago existente
      const payment = await PreferencePayment.findOne({
        where: { id: paymentId },
      });

      if (!payment) {
        console.error("No se encontró el pago para actualizar:", paymentId);
        return null;
      }

      // Verificar si el estado cambió a approved para crear accesos
      const wasNotApproved = payment.status !== "approved";
      const isNowApproved = paymentData.status === "approved";

      // Actualizar los campos
      payment.dateApproved = paymentData.date_approved;
      payment.status = paymentData.status;
      payment.transactionAmount = paymentData.transaction_amount;
      payment.paymentMethodId = paymentData.payment_method_id;
      payment.paymentTypeId = paymentData.payment_type_id;
      payment.data = paymentData;

      // Guardar los cambios
      await payment.save();

      // Si el pago cambió a aprobado, crear accesos a cursos y actualizar orden
      if (wasNotApproved && isNowApproved) {
        // Actualizar estado de la orden si existe
        if (payment.orderId) {
          const order = await Order.findByPk(payment.orderId);
          if (order) {
            await order.update({ status: "paid" });
          }
        }

        // Crear accesos a cursos
        await this.createCourseAccessesForPayment(paymentData);
      }

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

  /**
   * Obtiene información de un pago desde la API de MercadoPago
   * @param paymentId - ID del pago en MercadoPago
   */
  static async getPaymentFromMP(paymentId: string): Promise<any> {
    try {
      const paymentData = await retryWithExponentialBackoff(
        () => this.payment.get({ id: paymentId }),
        3, // máximo 3 reintentos
        1000 // delay inicial de 1 segundo
      );
      return paymentData;
    } catch (error) {
      console.error("Error obteniendo pago de MP:", error);
      throw error;
    }
  }

  /**
   * Obtiene un pago por ID
   */
  static getPayment = this.asyncHandler(async (req: Request, res: Response) => {
    await this.handleGetById(
      req,
      res,
      "id",
      async (id) => {
        return await PreferencePayment.findByPk(id);
      },
      "Pago"
    );
  });

  /**
   * Lista todos los pagos con paginación
   */
  static getAllPayments = this.asyncHandler(
    async (req: Request, res: Response) => {
      await this.handleList(
        req,
        res,
        async (limit, offset) => {
          const payments = await PreferencePayment.findAll({
            limit,
            offset,
            order: [["createdAt", "DESC"]],
          });
          const total = await PreferencePayment.count();
          return { items: payments, total };
        },
        "Pagos obtenidos exitosamente"
      );
    }
  );

  /**
   * Lista los pagos del usuario autenticado
   */
  static getUserPayments = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as any)?.id;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      await this.handleList(
        req,
        res,
        async (limit, offset) => {
          // Buscar pagos a través de las órdenes del usuario
          const payments = await PreferencePayment.findAll({
            include: [
              {
                model: Order,
                as: "order",
                where: { userId },
                required: true,
              },
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
          });

          const total = await PreferencePayment.count({
            include: [
              {
                model: Order,
                as: "order",
                where: { userId },
                required: true,
              },
            ],
          });

          return { items: payments, total };
        },
        "Pagos del usuario obtenidos exitosamente"
      );
    }
  );
}

export default CoursePaymentController;
