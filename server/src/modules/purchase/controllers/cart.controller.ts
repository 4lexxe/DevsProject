import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Cart from "../models/Cart";
import CartCourse from "../models/CartCourse";
import CourseDiscount from "../models/CourseDiscount";
import Course from "../../course/models/Course";
import User from "../../user/User";
import { Preference } from "mercadopago";
import { Op, Transaction, where } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
// Importar asociaciones para asegurar que están cargadas
import "../models/Associations";
import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";
import { retryWithExponentialBackoff } from "../../../shared/utils/retryService";
import { CourseAccess, PreferencePayment } from "../models/Associations";
import Order from "../models/Order";
import OrderCourse from "../models/OrderCourse";
/**
 * Controlador para gestionar el carrito de cursos
 * Incluye lógica de descuentos y creación de preferencias de MercadoPago
 */
class CartController extends BaseController {
  /**
   * Obtiene el carrito activo del usuario (status = 'pending')
   */
  static getActiveCart = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;
      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      const cart = await Cart.findOne({
        where: {
          userId,
          status: "active",
        },
        include: [
          {
            model: CartCourse,
            as: "cartCourses",
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "price", "summary", "image"],
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
              },
            ],
          },
        ],
      });

      if (!cart) {
        return this.sendSuccess(res, req, null, "No hay carrito activo");
      }

      this.sendSuccess(
        res,
        req,
        cart,
        "Carrito obtenido exitosamente"
      );
    }
  );

  /**
   * Agrega un curso al carrito
   */
  static addCourseToCart = this.asyncHandler(
    async (req: Request, res: Response) => {
      // Verificar errores de validación
      if (!this.handleValidationErrors(req, res)) {
        return;
      }

      const userId = (req.user as User)?.id;
      const { courseId } = req.body;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      // Verificar que el curso existe
      const course = await Course.findOne({
        where: { id: courseId },
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
      if (!course) {
        return this.notFound(res, req, "Curso");
      }

      // Verificar que el curso está activo
      if (!course.isActive) {
        return this.validationFailed(
          res,
          req,
          { courseId },
          "El curso no está disponible para compra"
        );
      }

      if (course.price === 0) {
        return this.validationFailed(
          res,
          req,
          { courseId },
          "El curso es gratis"
        );
      }

      // Buscar o crear carrito activo
      let cart = await Cart.findOne({
        where: { userId, status: "active" },
      });

      if (!cart) {
        cart = await Cart.create({
          userId,
          status: "active",
          finalPrice: 0,
        });
      }

      const existingCartCourse = await CartCourse.findOne({
        where: { cartId: cart.id, courseId },
      });

      if (existingCartCourse) {
        return this.validationFailed(
          res,
          req,
          { courseId },
          "El curso ya está en el carrito"
        );
      }

      const coursesAccess = await CourseAccess.findOne({
        where: { userId, courseId },
      });

      if (coursesAccess) {
        return this.validationFailed(
          res,
          req,
          { courseId },
          "Ya tienes acceso a este curso"
        );
      }

      // Calcular precios con descuentos de manera más robusta

      const originalPrice = course.price;
      let discountAmount = 0;
      let finalPrice = originalPrice;

      // Aplicar descuento si existe y está activo
      if (course.courseDiscount) {
        discountAmount = course.courseDiscount.value;
        finalPrice = originalPrice - (originalPrice * discountAmount) / 100;
      }

      // Usar transacción para operaciones críticas
      const transaction = await sequelize.transaction();

      try {
        // Agregar curso al carrito con precios calculados y redondeados
        await CartCourse.create(
          {
            cartId: cart.id,
            courseId,
            unitPrice: parseFloat(originalPrice.toString()),
            discountValue: parseInt(discountAmount.toString(), 10),
            priceWithDiscount: parseFloat(finalPrice.toString()),
          },
          { transaction }
        );

        // Recalcular totales del carrito dentro de la transacción
        await this.updateCartInTransaction(cart.id, transaction);

        // Confirmar transacción
        await transaction.commit();

        this.created(res, req, "Curso agregado al carrito exitosamente");
      } catch (error) {
        // Revertir transacción en caso de error
        await transaction.rollback();
        console.error("Error al agregar curso al carrito:", error);
        this.handleServerError(
          res,
          req,
          error,
          "Error al agregar el curso al carrito"
        );
      }
    }
  );

  /**
   * Elimina un curso del carrito
   */
  static removeCourseFromCart = this.asyncHandler(
    async (req: Request, res: Response) => {
      // Verificar errores de validación
      if (!this.handleValidationErrors(req, res)) {
        return;
      }

      const userId = (req.user as User)?.id;
      const { courseId } = req.params;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      const cart = await Cart.findOne({
        where: { userId, status: "active" },
      });

      if (!cart) {
        return this.notFound(res, req, "Carrito activo");
      }

      const deleted = await CartCourse.destroy({
        where: { cartId: cart.id, courseId },
        force: true, // Forzar eliminación lógica
      });

      if (deleted === 0) {
        return this.notFound(res, req, "Curso en el carrito");
      }

      // Recalcular totales del carrito
    await this.updateCart(cart.id);
    

      this.sendSuccess(
        res,
        req,
        null,
        "Curso eliminado del carrito exitosamente"
      );
    }
  );

  /**
   * Vacía completamente el carrito
   */
  static clearCart = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as User)?.id;

    if (!userId) {
      return this.unauthorized(res, req, "Usuario no autenticado");
    }

    const cart = await Cart.findOne({
      where: { userId, status: "active" },
    });

    if (!cart) {
      return this.notFound(res, req, "Carrito activo");
    }

    await CartCourse.destroy({
      where: { cartId: cart.id },
      force: true,
    });

    await cart.update({ finalPrice: 0, discountAmount: 0, totalPrice: 0 });

    this.sendSuccess(res, req, null, "Carrito vaciado exitosamente");
  });

  /**
   * Crea una preferencia de MercadoPago para procesar el pago del carrito
   */
  static createCartPaymentPreference = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      const cart = await Cart.findOne({
        where: { userId, status:{[Op.in]: ["pending", "active"],} },
        include: [
          {
            model: CartCourse,
            as: "cartCourses",
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "price", "summary", "image"],
              },
            ],
          },
        ],
      });

      if (!cart) {
        return this.notFound(res, req, "No hay carrito activo ni pendiente");
      }

      const order = await Order.findOne({
        where: { cartId: cart.id, status: "pending" },
      });

      if (order && order.status === "pending") {
        return this.validationFailed(
          res,
          req,
          "Ya existe una orden pendiente de pago"
        );
      }

      const cartCoursesData = await CartCourse.findAll({
        where: { cartId: cart.id },
        include: [
          {
            model: Course,
            as: "course",
            attributes: ["id", "title", "price", "summary", "image", "about", "isInDevelopment", "adminId"],
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
          },
        ],
      });

      if (cartCoursesData.length === 0) {
        return this.validationFailed(
          res,
          req,
          { cart: "empty" },
          "El carrito está vacío"
        );
      }

      // Verificar que el usuario no tenga acceso a ningún curso del carrito
      const courseIds = cartCoursesData.map((cc: any) => cc.course.id);
      const courseAccesses = await CourseAccess.findAll({
        where: {
          userId,
          courseId: { [Op.in]: courseIds },
        },
        include: [
          {
            model: Course,
            as: "course",
            attributes: ["id", "title"],
          },
        ],
      });

      if (courseAccesses.length > 0) {
        const courseTitles = courseAccesses
          .map((ca: any) => ca.course.title)
          .join(", ");
        return this.validationFailed(
          res,
          req,
          {
            coursesWithAccess: courseAccesses.map((ca: any) => ({
              id: ca.courseId,
              title: ca.course.title,
            })),
          },
          `Ya tienes acceso a los siguientes cursos: ${courseTitles}`
        );
      }

      const preference = new Preference(MpConfig);
      // Crear items para MercadoPago usando los campos correctos de CartCourse y Course
      const items = cart.cartCourses.map((cartCourse: any) => {
        // cartCourse: instancia de CartCourse, con include de Course
        const course = cartCourse.course;
        const finalPrice = parseFloat(cartCourse.priceWithDiscount);

        if (isNaN(finalPrice) || finalPrice <= 0) {
          console.error(
            `Precio inválido para curso ${course.id}: ${cartCourse.priceWithDiscount}`
          );
          throw new Error(
            `Precio inválido para el curso ${course.title}`
          );
        }

        const roundedPrice = Math.round(finalPrice * 100) / 100;

        console.log(
          `Curso: ${course.title}, Precio final: ${roundedPrice}`
        );

        return {
          id: course.id.toString(),
          title: course.title,
          description: course.summary || `Curso: ${course.title}`,
          quantity: 1,
          currency_id: "ARS",
          unit_price: roundedPrice,
        };
      });

      // Validar que todos los items tengan precios válidos
      const invalidItems = items.filter(
        (item) => !item.unit_price || item.unit_price <= 0
      );
      if (invalidItems.length > 0) {
        console.error("Items con precios inválidos:", invalidItems);
        return this.validationFailed(
          res,
          req,
          { invalidItems },
          "Algunos cursos tienen precios inválidos"
        );
      }

      try {
        const result = await retryWithExponentialBackoff(() =>
          preference.create({
            body: {
              items,
              back_urls: {
                success: `${process.env.MP_PAYMENT_SUCCESS_URL}`,
                failure: `${process.env.MP_PAYMENT_FAILURE_URL}`,
                pending: `${process.env.MP_PAYMENT_PENDING_URL}`,
              },
              auto_return: "approved",
              external_reference: `cart_${cart.id.toString()}_${userId.toString()}_${Date.now()}`,
              metadata: {
                type: "cart",
                cart_id: cart.id.toString(),
                user_id: userId.toString(),
                total_amount: cart.finalPrice,
                course_count: items.length,
              },
              payment_methods: {
                excluded_payment_methods: [
                  { id: "ticket" }, // Excluir pago en efectivo
                  { id: "atm" }, // Excluir pago por cajero automático
                ],
                installments: 1, // Permitir hasta 12 cuotas
                default_installments: 1, // Cuota por defecto
              },
              notification_url: `${process.env.MP_WEBHOOK_URL}`,
              expires: true,
              expiration_date_from: new Date().toISOString(),
              expiration_date_to: new Date(
                Date.now() + 24 * 60 * 60 * 1000
              ).toISOString(), // 24 horas
            },
          })
        );

        // Actualizar carrito con precio final y cambiar estado a pending
        await cart.update({
          status: "pending",
        });

        // Crear registro de Order
        const order = await Order.create({
          cartId: cart.id,
          userId: userId,
          preferenceId: result.id,
          type: "cart",
          externalReference: result.external_reference,
          initPoint: result.init_point,
          metadata: result.metadata,
          totalPrice: cart.totalPrice,
          discountAmount: cart.discountAmount,
          finalPrice: cart.finalPrice,
          expirationDateFrom: result.expiration_date_from,
          expirationDateTo: result.expiration_date_to,
        });

        // Crear registros de OrderCourse para cada curso del carrito
        for (const cartCourse of cartCoursesData) {
          const course = (cartCourse as any).course;
          console.log(course)
          await OrderCourse.create({
            courseId: course.id,
            OrderId: order.id,
            unitPrice: (cartCourse as any).unitPrice,
            discountValue: (cartCourse as any).discountValue,
            priceWithDiscount: (cartCourse as any).priceWithDiscount,
            courseSnapshot: {
              id: course.id.toString(),
              title: course.title,
              sumary: course.summary,
              about: course.about || "",
              isInDevelopment: course.isInDevelopment || false,
              adminId: course.adminId?.toString() || "",
              price: course.price,
            },
            discountEventSnapshot: course.courseDiscount ? {
              id: course.courseDiscount.id.toString(),
              event: course.courseDiscount.event,
              description: course.courseDiscount.description,
              value: course.courseDiscount.value,
              startDate: course.courseDiscount.startDate.toISOString(),
              endDate: course.courseDiscount.endDate.toISOString(),
            } : {},
          });
        } 

        this.created(
          res,
          req,
          {
            initPoint: result.init_point,
          },
          "Preferencia de pago creada exitosamente"
        );
      } catch (error) {
        console.error("Error creando preferencia de MercadoPago:", error);
        this.handleServerError(
          res,
          req,
          error,
          "Error al crear la preferencia de pago"
        );
      }
    }
  );

  /**
   * Calcula los totales del carrito usando los precios ya almacenados en CartCourse
   */
  private static async updateCart(cartId: bigint) {
    return this.updateCartInTransaction(cartId, null);
  }

  /**
   * Calcula los totales del carrito con soporte para transacciones
   */
  private static async updateCartInTransaction(cartId: bigint, transaction: Transaction | null) {
    const cartCourses = await CartCourse.findAll({
      where: { cartId },
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title", "price", "summary", "image"],
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
        },
      ],
      transaction,
    });

    let totalOriginal = 0;
    let totalWithDiscounts = 0;

    for (const cartCourse of cartCourses) {
      const course = (cartCourse as any).course;
      const originalPrice = parseFloat(course.price.toString());
      let finalPrice = originalPrice;
      let discountValue = 0;

      // Recalcular precio con descuento si existe y está activo
      if (course.courseDiscount) {
        discountValue = course.courseDiscount.value;
        finalPrice = originalPrice - (originalPrice * discountValue) / 100;
      }

      // Actualizar CartCourse con los valores recalculados
      await CartCourse.update(
        {
          unitPrice: originalPrice,
          discountValue: discountValue,
          priceWithDiscount: finalPrice,
        },
        {
          where: { id: (cartCourse as any).id },
          transaction
        }
      );

      totalOriginal += originalPrice;
      totalWithDiscounts += finalPrice;
    }

    totalOriginal = Math.round(totalOriginal * 100) / 100;
    totalWithDiscounts = Math.round(totalWithDiscounts * 100) / 100;
    const totalDiscountAmount = Math.round((totalOriginal - totalWithDiscounts) * 100) / 100;

    // Actualizar el carrito por su id
    await Cart.update(
      {
        totalPrice: totalOriginal,
        finalPrice: totalWithDiscounts,
        discountAmount: totalDiscountAmount,
      },
      {
        where: { id: cartId },
        transaction
      }
    );

    // Retornar el carrito actualizado
    return await Cart.findOne({ 
      where: { id: cartId },
      transaction 
    });
  }

  /**
   * Obtiene el resumen del carrito con precios y descuentos
   */
  static getCartSummary = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      const cart = await Cart.findOne({
        where: { userId, status: "active" },
        include: [
          {
            model: CartCourse,
            as: "cartCourses",
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "price", "summary", "image"],
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
              },
            ],
          },
        ]
      });

      if (!cart) {
        return this.sendSuccess(
          res,
          req,
          "No hay carrito activo"
        );
      }

      this.sendSuccess(
        res,
        req,
        cart,
        "Resumen del carrito obtenido exitosamente"
      );
    }
  );

  /**
   * Obtiene el número total de cursos en el carrito del usuario
   */
  static getCartCount = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      const cart = await Cart.findOne({
        where: { userId, status: "active" },
      });

      if (!cart) {
        return this.sendSuccess(
          res,
          req,
          { count: 0 },
          "No hay carrito activo"
        );
      }

      const courseCount = await CartCourse.count({
        where: { cartId: cart.id },
      });

      this.sendSuccess(
        res,
        req,
        { count: courseCount },
        "Número de cursos en el carrito obtenido exitosamente"
      );
    }
  );

  /**
   * Cancela el carrito con estado 'pending' del usuario
   */
  static cancelPendingCart = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      const cart = await Cart.findOne({
        where: { userId, status: "pending" },
      });

      if (!cart) {
        return this.notFound(res, req, "Carrito pendiente");
      }

      await cart.update({ status: "cancelled" });

      this.sendSuccess(
        res,
        req,
        { cartId: cart.id, status: "cancelled" },
        "Carrito cancelado exitosamente"
      );
    }
  );

}

export default CartController;
