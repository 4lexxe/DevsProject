import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Course from "../../course/models/Course";
import CourseAccess from "../models/CourseAccess";
import CourseDiscount from "../models/CourseDiscount";
import User from "../../user/User";
import Order from "../models/Order";
import OrderCourse from "../models/OrderCourse";
import Cart from "../models/Cart";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { Preference } from "mercadopago";
import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";
import { retryWithExponentialBackoff } from "../../../shared/utils/retryService";
// Importar asociaciones para asegurar que están cargadas
import "../models/Associations";

/**
 * Controlador para gestionar compras directas de cursos
 * Maneja cursos gratuitos y compras directas sin pasar por el carrito
 */
export class DirectPurchaseController extends BaseController {

  /**
   * Verifica si un curso es gratuito (precio 0 o descuento 100%)
   */
  private static async isCourseFree(courseId: number): Promise<{ isFree: boolean; finalPrice: number; originalPrice: number }> {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: CourseDiscount,
          as: "courseDiscount",
          where: {
            isActive: true,
            startDate: { [Op.lte]: new Date() },
            endDate: { [Op.gte]: new Date() },
          },
          required: false, // LEFT JOIN para incluir cursos sin descuentos
        },
      ],
    });

    if (!course) {
      throw new Error("Curso no encontrado");
    }

    const courseData = course.toJSON() as any;
    const originalPrice = parseFloat(courseData.price.toString());
    let finalPrice = originalPrice;
    let discountPercentage = 0;

    // Si hay descuento activo, calcular el precio final
    if (courseData.courseDiscount) {
      discountPercentage = courseData.courseDiscount.value;
      const discountAmount = (originalPrice * discountPercentage) / 100;
      finalPrice = originalPrice - discountAmount;

      // Asegurar que el precio final no sea negativo
      if (finalPrice < 0) {
        finalPrice = 0;
      }
    }

    // Un curso es gratuito si el precio original es 0 o si el descuento es 100% o más
    const isFree = originalPrice === 0 || discountPercentage >= 100 || finalPrice === 0;

    return {
      isFree,
      finalPrice: Math.round(finalPrice * 100) / 100,
      originalPrice
    };
  }

  /**
   * Otorga acceso automático a un curso gratuito
   */
  public static grantFreeCourseAccess = DirectPurchaseController.asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = (req.user as User)?.id;

    if (!userId) {
      return DirectPurchaseController.unauthorized(res, req, "Usuario no autenticado");
    }

    // Verificar si el curso existe y está activo
    const course = await Course.findOne({
      where: {
        id: parseInt(courseId),
        isActive: true
      }
    });

    if (!course) {
      return DirectPurchaseController.notFound(res, req, "Curso no encontrado o no está activo");
    }

    // Verificar si el curso es gratuito
    const { isFree, finalPrice, originalPrice } = await DirectPurchaseController.isCourseFree(parseInt(courseId));

    if (!isFree) {
      return DirectPurchaseController.sendError(res, req, "Este curso no es gratuito. Debe ser agregado al carrito para su compra.", 400);
    }

    // Verificar si el usuario ya tiene acceso al curso
    const existingAccess = await CourseAccess.findOne({
      where: {
        userId,
        courseId: parseInt(courseId),
        revokedAt: null
      }
    });

    if (existingAccess) {
      return DirectPurchaseController.sendError(res, req, "Ya tienes acceso a este curso", 422);
    }

    // Generar token de acceso único
    const accessToken = uuidv4();

    // Crear el acceso al curso
    const courseAccess = await CourseAccess.create({
      userId,
      courseId: parseInt(courseId),
      accessToken,
      grantedAt: new Date(),
      revokedAt: null,
      revokeReason: null
    });

    // Respuesta exitosa
    DirectPurchaseController.sendSuccess(
      res,
      req,
      {
        courseAccess: {
          id: courseAccess.id,
          courseId: courseAccess.courseId,
          accessToken: courseAccess.accessToken,
          grantedAt: courseAccess.grantedAt
        },
        course: {
          id: course.id,
          title: course.title,
          originalPrice,
          finalPrice,
          isFree: true
        }
      },
      "Acceso al curso gratuito otorgado exitosamente"
    );
  });

  /**
   * Verifica si un curso es gratuito
   */
  public static checkIfCourseFree = DirectPurchaseController.asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params;

    try {
      const { isFree, finalPrice, originalPrice } = await DirectPurchaseController.isCourseFree(parseInt(courseId));

      DirectPurchaseController.sendSuccess(
        res,
        req,
        {
          courseId: parseInt(courseId),
          isFree,
          originalPrice,
          finalPrice,
          priceDisplay: isFree ? "GRATIS" : `$${finalPrice.toFixed(2)}`
        },
        "Información de precio del curso obtenida exitosamente"
      );
    } catch (error: any) {
      if (error.message === "Curso no encontrado") {
        return DirectPurchaseController.notFound(res, req, "Curso no encontrado");
      }
      throw error;
    }
  });

  /**
   * Compra directa de un curso (sin pasar por el carrito)
   * Solo para cursos de pago - los gratuitos usan grantFreeCourseAccess
   */
  public static directPurchase = DirectPurchaseController.asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = (req.user as User)?.id;

    if (!userId) {
      return DirectPurchaseController.unauthorized(res, req, "Usuario no autenticado");
    }

    // Verificar si el curso existe y está activo
    const course = await Course.findOne({
      where: {
        id: parseInt(courseId),
        isActive: true
      }
    });

    if (!course) {
      return DirectPurchaseController.notFound(res, req, "Curso no encontrado o no está activo");
    }

    // Verificar si el curso es gratuito
    const { isFree, finalPrice, originalPrice } = await DirectPurchaseController.isCourseFree(parseInt(courseId));

    if (isFree) {
      return DirectPurchaseController.sendError(res, req, "Este curso es gratuito. Use el endpoint de acceso gratuito.", 400);
    }

    // Verificar si el usuario ya tiene acceso al curso
    const existingAccess = await CourseAccess.findOne({
      where: {
        userId,
        courseId: parseInt(courseId),
        revokedAt: null
      }
    });

    if (existingAccess) {
      return DirectPurchaseController.sendError(res, req, "Ya tienes acceso a este curso", 422);
    }

    // Verificar si ya existe una orden pendiente para este curso y usuario (cualquier tipo)
    const pendingOrder = await Order.findOne({
      where: {
        userId,
        status: "pending",
        expired: false
      },
      include: [
        {
          model: OrderCourse,
          as: "orderCourses",
          where: {
            courseId: parseInt(courseId)
          },
          required: true,
          include: [
            {
              model: Course,
              as: "course"
            }
          ]
        }
      ]
    });

    if (pendingOrder) {
      return DirectPurchaseController.sendError(
        res, 
        req, 
        "Ya tienes una orden de compra pendiente para este curso. Por favor, completa el pago o cancelala.", 
        422,
        {
          errorType: "PENDING_ORDER", // Campo específico para identificar este error
          orderId: pendingOrder.id,
          orderType: pendingOrder.type,
          expirationDate: pendingOrder.expirationDateTo,
          courseName: (pendingOrder as any).orderCourses?.[0]?.course?.title
        }
      );
    }

    // Crear preferencia de MercadoPago para compra directa
    try {
      const preference = new Preference(MpConfig);
      
      // Validar precio
      if (isNaN(finalPrice) || finalPrice <= 0) {
        return DirectPurchaseController.validationFailed(
          res,
          req,
          { price: finalPrice },
          "Precio inválido para el curso"
        );
      }

      const roundedPrice = Math.round(finalPrice * 100) / 100;

      const item = {
        id: course.id.toString(),
        title: course.title,
        description: course.summary || `Curso: ${course.title}`,
        quantity: 1,
        currency_id: "ARS",
        unit_price: roundedPrice,
      };

      const externalReference = `direct_${course.id}_${userId}_${Date.now()}`;

      const result = await retryWithExponentialBackoff(() =>
        preference.create({
          body: {
            items: [item],
            back_urls: {
              success: `${process.env.MP_PAYMENT_SUCCESS_URL}`,
              failure: `${process.env.MP_PAYMENT_FAILURE_URL}`,
              pending: `${process.env.MP_PAYMENT_PENDING_URL}`,
            },
            auto_return: "approved",
            external_reference: externalReference,
            metadata: {
              purchase_type: "direct",
              course_id: course.id.toString(),
              user_id: userId.toString(),
              total_amount: roundedPrice,
            },
            payment_methods: {
              excluded_payment_methods: [
                { id: "ticket" },
                { id: "atm" },
              ],
              installments: 1,
              default_installments: 1,
            },
            notification_url: `${process.env.MP_WEBHOOK_URL}`,
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        })
      );

      // Debug: Log de la respuesta de MercadoPago
      console.log('🔍 Respuesta completa de MercadoPago:', JSON.stringify(result, null, 2));

      // Validar que el init_point sea válido
      if (!result.init_point || result.init_point === 'undefined' || typeof result.init_point !== 'string') {
        console.error('❌ init_point inválido de MercadoPago:', result.init_point);
        return DirectPurchaseController.sendError(
          res,
          req,
          "Error: MercadoPago no devolvió una URL de pago válida",
          500
        );
      }

      // Crear registro de Order para compra directa
      const order = await Order.create({
        cartId: null, // No hay carrito para compras directas
        userId: userId,
        preferenceId: result.id,
        type: "direct",
        externalReference: result.external_reference,
        initPoint: result.init_point,
        metadata: result.metadata,
        totalPrice: originalPrice,
        discountAmount: originalPrice - roundedPrice,
        finalPrice: roundedPrice,
        expirationDateFrom: result.expiration_date_from,
        expirationDateTo: result.expiration_date_to,
        status: "pending",
        expired: false
      });

      // Obtener información del descuento activo si existe
      const courseWithDiscount = await Course.findByPk(parseInt(courseId), {
        include: [
          {
            model: CourseDiscount,
            as: "courseDiscount",
            where: {
              isActive: true,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() },
            },
            required: false,
          },
        ],
      });

      const courseData = courseWithDiscount?.toJSON() as any;
      const discountSnapshot = courseData?.courseDiscount || null;

      // Crear registro de OrderCourse para la compra directa
      await OrderCourse.create({
        courseId: parseInt(courseId),
        OrderId: order.id,
        courseSnapshot: {
          id: course.id.toString(),
          title: course.title,
          sumary: course.summary || '',
          about: course.about || '',
          isInDevelopment: course.isInDevelopment,
          adminId: course.adminId?.toString() || '',
          price: originalPrice,
        },
        discountEventSnapshot: discountSnapshot || {},
        discountValue: discountSnapshot ? discountSnapshot.value : 0,
        unitPrice: originalPrice,
        priceWithDiscount: roundedPrice,
      });

      DirectPurchaseController.created(
        res,
        req,
        {
          initPoint: result.init_point,
          orderId: order.id,
          course: {
            id: course.id,
            title: course.title,
            originalPrice,
            finalPrice: roundedPrice
          }
        },
        "Preferencia de pago creada exitosamente"
      );
    } catch (error) {
      console.error("Error creando preferencia de MercadoPago para compra directa:", error);
      DirectPurchaseController.handleServerError(
        res,
        req,
        error,
        "Error al crear la preferencia de pago para compra directa"
      );
    }
  });

  /**
   * Verifica si el usuario ya tiene acceso a un curso
   */
  public static checkCourseAccess = DirectPurchaseController.asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = (req.user as User)?.id;

    if (!userId) {
      return DirectPurchaseController.unauthorized(res, req, "Usuario no autenticado");
    }

    const courseAccess = await CourseAccess.findOne({
      where: {
        userId,
        courseId: parseInt(courseId),
        revokedAt: null
      }
    });

    DirectPurchaseController.sendSuccess(
      res,
      req,
      {
        hasAccess: !!courseAccess,
        accessDetails: courseAccess ? {
          grantedAt: courseAccess.grantedAt,
          accessToken: courseAccess.accessToken
        } : null
      },
      courseAccess ? "Usuario tiene acceso al curso" : "Usuario no tiene acceso al curso"
    );
  });

  /**
   * Cancela una orden pendiente específica del usuario
   */
  public static cancelPendingOrder = DirectPurchaseController.asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const userId = (req.user as User)?.id;

    if (!userId) {
      return DirectPurchaseController.unauthorized(res, req, "Usuario no autenticado");
    }

    // Buscar la orden que pertenece al usuario y está pendiente
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId,
        status: "pending",
        expired: false
      }
    });

    if (!order) {
      return DirectPurchaseController.notFound(res, req, "Orden pendiente no encontrada");
    }

    // Actualizar el estado de la orden a cancelada
    await order.update({ status: "cancelled" });

    // Si la orden tiene un carrito asociado, cambiar su estado también
    if (order.cartId) {
      await Cart.update(
        { status: "cancelled" },
        { where: { id: order.cartId } }
      );
    }

    DirectPurchaseController.sendSuccess(
      res,
      req,
      {
        orderId: order.id,
        status: "cancelled",
        orderType: order.type
      },
      "Orden cancelada exitosamente"
    );
  });
}

export default DirectPurchaseController;