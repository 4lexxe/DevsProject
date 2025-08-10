import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Order from "../models/Order";
import OrderCourse from "../models/OrderCourse";
import Course from "../../course/models/Course";
import User from "../../user/User";
import PreferencePayment from "../models/PreferencePayment";
import { Op } from "sequelize";
// Importar asociaciones para asegurar que están cargadas
import "../models/Associations";

/**
 * Controlador para gestionar las órdenes
 */
class OrderController extends BaseController {
  /**
   * Obtiene todas las órdenes del usuario autenticado
   */
  static getUserOrders = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;
      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      console.log('🔍 Obteniendo órdenes para usuario:', userId);

      try {
        const orders = await Order.findAll({
          where: {
            userId: userId
          },
          include: [
            {
              association: 'cart',
              attributes: ['id', 'userId', 'status'],
              required: false // LEFT JOIN para incluir órdenes sin carrito
            },
            {
              model: OrderCourse,
              as: "orderCourses",
              include: [
                {
                  model: Course,
                  as: "course",
                  attributes: ["id", "title", "image", "summary"],
                },
              ],
              required: false
            },
            {
              association: 'payments',
              required: false // LEFT JOIN para incluir órdenes sin pagos
            }
          ],
          order: [["createdAt", "DESC"]],
        });

        console.log('🔍 Órdenes encontradas:', orders.length);

        this.sendSuccess(
          res,
          req,
          orders,
          "Órdenes obtenidas exitosamente"
        );
      } catch (error) {
        console.error('❌ Error obteniendo órdenes:', error);
        this.handleServerError(res, req, error, "Error al obtener las órdenes");
      }
    }
  );

  /**
   * Obtiene una orden específica por ID
   */
  static getOrderById = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;
      const { orderId } = req.params;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      const order = await Order.findOne({
        where: { id: orderId },
        include: [
          {
            association: 'cart',
            where: { userId },
            attributes: ['userId', 'status'],
          },
          {
            model: OrderCourse,
            as: "orderCourses",
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "image", "summary"],
              },
            ],
          },
        ],
      });

      if (!order) {
        return this.notFound(res, req, "Orden");
      }

      this.sendSuccess(
        res,
        req,
        order,
        "Orden obtenida exitosamente"
      );
    }
  );

  /**
   * Cancela una orden (solo si está pendiente)
   */
  static cancelOrder = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;
      const { orderId } = req.params;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      console.log('🔍 Cancelando orden:', orderId, 'para usuario:', userId);

      const order = await Order.findOne({
        where: { 
          id: orderId,
          userId: userId // Verificar que la orden pertenece al usuario
        },
        include: [
          {
            association: 'cart',
            attributes: ['id', 'userId', 'status'],
            required: false // LEFT JOIN para incluir órdenes sin carrito
          },
        ],
      });

      if (!order) {
        return this.notFound(res, req, "Orden");
      }

      console.log('🔍 Orden encontrada:', order.id, 'Status:', order.status);
      console.log('🔍 Cart asociado:', (order as any).cart?.id || 'Sin cart');

      // Verificar si la orden puede ser cancelada
      if (order.status === "paid") {
        return this.validationFailed(
          res,
          req,
          { status: "paid" },
          "No se puede cancelar una orden que ya fue pagada"
        );
      }

      if (order.status === "cancelled") {
        return this.validationFailed(
          res,
          req,
          { status: "cancelled" },
          "La orden ya está cancelada"
        );
      }

      // Actualizar el estado de la orden
      await order.update({ status: "cancelled" });

      // Si la orden tiene un carrito asociado, también cancelarlo
      if ((order as any).cart) {
        console.log('🔍 Actualizando estado del cart:', (order as any).cart.id);
        await (order as any).cart.update({ status: "cancelled" });
      }

      console.log('✅ Orden cancelada exitosamente');

      this.sendSuccess(
        res,
        req,
        { orderId: order.id, status: "cancelled" },
        "Orden cancelada exitosamente"
      );
    }
  );

  /**
   * Obtiene el resumen de órdenes del usuario
   */
  static getOrdersSummary = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;
      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      const totalOrders = await Order.count({
        include: [
          {
            association: 'cart',
            where: { userId },
            attributes: [],
          },
        ],
      });

      const paidOrders = await Order.count({
        include: [
          {
            association: 'cart',
            where: { 
              userId,
              status: 'paid'
            },
            attributes: [],
          },
        ],
      });

      const pendingOrders = await Order.count({
        include: [
          {
            association: 'cart',
            where: { 
              userId,
              status: 'pending'
            },
            attributes: [],
          },
        ],
      });

      const cancelledOrders = await Order.count({
        include: [
          {
            association: 'cart',
            where: { 
              userId,
              status: 'cancelled'
            },
            attributes: [],
          },
        ],
      });

      this.sendSuccess(
        res,
        req,
        {
          total: totalOrders,
          paid: paidOrders,
          pending: pendingOrders,
          cancelled: cancelledOrders,
        },
        "Resumen de órdenes obtenido exitosamente"
      );
    }
  );
}

export default OrderController;