import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Cart from "../models/Cart";
import CartCourse from "../models/CartCourse";
import CourseDiscountEvent from "../models/CourseDiscountEvent";
import Course from "../../course/models/Course";
import User from "../../user/User";
import { Preference } from "mercadopago";
import { Op } from "sequelize";
// Importar asociaciones para asegurar que están cargadas
import "../models/Associations";
import { MpConfig } from "../../../infrastructure/config/mercadopagoConfig";
import PreferenceModel from "../models/Preference";
import { log } from "node:console";
import { retryWithExponentialBackoff } from "../../../shared/utils/retryService";
import { CourseAccess, PreferencePayment } from "../models/Associations";
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
              },
            ],
          },
        ],
      });

      if (!cart) {
        return this.sendSuccess(res, req, null, "No hay carrito activo");
      }

      // Calcular precios con descuentos
      const cartWithPrices = await this.calculateCartTotals(cart);

      this.sendSuccess(
        res,
        req,
        cartWithPrices,
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
      const course = await Course.findByPk(courseId);
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

      // Verificar si el curso ya está en el carrito
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

      // Agregar curso al carrito
      const cartCourse = await CartCourse.create({
        cartId: cart.id,
        courseId,
      });

      // Recalcular totales del carrito
      const updatedCart = await this.calculateCartTotals(cart);
      await cart.update({ finalPrice: updatedCart.totalWithDiscounts });

      this.created(
        res,
        req,
        cartCourse,
        "Curso agregado al carrito exitosamente"
      );
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
      const updatedCart = await this.calculateCartTotals(cart);
      await cart.update({ finalPrice: updatedCart.totalWithDiscounts });

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

    await cart.update({ finalPrice: 0 });

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

      const cartPending = await Cart.findOne({
        where: { userId, status: "pending" },
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
      if (cartPending) {
        return this.validationFailed(
          res,
          req,
          { cart: "pending" },
          "Ya existe un carrito pendiente de pago"
        );
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
              },
            ],
          },
        ],
      });

      if (!cart) {
        return this.notFound(res, req, "Carrito activo");
      }

      const cartCoursesData = await CartCourse.findAll({
        where: { cartId: cart.id },
        include: [
          {
            model: Course,
            as: "course",
            attributes: ["id", "title", "price", "summary", "image"],
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
          courseId: { [Op.in]: courseIds }
        },
        include: [
          {
            model: Course,
            as: "course",
            attributes: ["id", "title"]
          }
        ]
      });

      if (courseAccesses.length > 0) {
        const courseTitles = courseAccesses.map((ca: any) => ca.course.title).join(", ");
        return this.validationFailed(
          res,
          req,
          { 
            coursesWithAccess: courseAccesses.map((ca: any) => ({
              id: ca.courseId,
              title: ca.course.title
            }))
          },
          `Ya tienes acceso a los siguientes cursos: ${courseTitles}`
        );
      }

      // Calcular precios con descuentos
      const cartWithPrices = await this.calculateCartTotals(cart);

      console.log("Cart with prices:", JSON.stringify(cartWithPrices, null, 2)); // Debug

      const preference = new Preference(MpConfig);

      // Crear items para MercadoPago
      const items = cartWithPrices.courses.map((courseData: any) => {
        const finalPrice = parseFloat(courseData.course.finalPrice);

        if (isNaN(finalPrice) || finalPrice <= 0) {
          console.error(
            `Precio inválido para curso ${courseData.course.id}: ${courseData.course.finalPrice}`
          );
          throw new Error(
            `Precio inválido para el curso ${courseData.course.title}`
          );
        }

        const roundedPrice = Math.round(finalPrice * 100) / 100; // Redondear a 2 decimales

        console.log(
          `Curso: ${courseData.course.title}, Precio final: ${roundedPrice}`
        ); // Debug

        return {
          id: courseData.course.id.toString(),
          title: courseData.course.title,
          description:
            courseData.course.description ||
            `Curso: ${courseData.course.title}`,
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
              external_reference: cart.id.toString(),
            metadata: {
              cart_id: cart.id.toString(),
              user_id: userId.toString(),
              total_amount: cartWithPrices.totalWithDiscounts,
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
        }));

        log(`Preferencia creada: ${JSON.stringify(result, null, 2)}`); // Debug

        await PreferenceModel.create({
          id: result.id,
          userId: BigInt(userId),
          externalReference: result.external_reference,
          items: result.items,
          initPoint: result.init_point,
          expirationDateFrom: result.expiration_date_from,
          expirationDateTo: result.expiration_date_to,
        });

        // Actualizar carrito con el ID de preferencia y precio final
        await cart.update({
          preferenceId: result.id,
          finalPrice: cartWithPrices.totalWithDiscounts,
          status: "pending",
        });

        this.created(
          res,
          req,
          {
            initPoint: result.init_point,
            cartSummary: cartWithPrices,
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
   * Calcula los totales del carrito aplicando TODOS los descuentos activos
   */
  private static async calculateCartTotals(cart: any) {
    const cartCourses = await CartCourse.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title", "price", "summary", "image"],
        },
      ],
    });

    let totalOriginal = 0;
    let totalWithDiscounts = 0;
    const courses = [];

    for (const cartCourse of cartCourses) {
      const course = (cartCourse as any).course;
      const originalPrice = parseFloat(course.price.toString());

      console.log(
        `Procesando curso: ${course.title}, Precio original: ${originalPrice}`
      ); // Debug

      if (isNaN(originalPrice) || originalPrice <= 0) {
        console.error(
          `Precio inválido para curso ${course.id}: ${course.price}`
        );
        throw new Error(`El curso ${course.title} tiene un precio inválido`);
      }

      // Buscar TODOS los descuentos activos para el curso usando la relación muchos a muchos
      const courseWithDiscounts = await Course.findByPk(course.id, {
        include: [
          {
            model: CourseDiscountEvent,
            as: "discountEvents",
            where: {
              isActive: true,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() },
            },
            required: false, // LEFT JOIN para incluir cursos sin descuentos
          },
        ],
      });

      let finalPrice = originalPrice;
      let totalDiscountPercentage = 0;
      let totalDiscountAmount = 0;
      let appliedDiscounts = [];

      // Si el curso tiene descuentos activos, sumar TODOS los descuentos
      const courseData = courseWithDiscounts as any;
      if (courseData?.discountEvents && courseData.discountEvents.length > 0) {
        // Sumar todos los porcentajes de descuento activos
        totalDiscountPercentage = courseData.discountEvents.reduce((total: number, discount: any) => {
          return total + discount.value;
        }, 0);

        // Calcular el monto total de descuento
        totalDiscountAmount = (originalPrice * totalDiscountPercentage) / 100;
        finalPrice = originalPrice - totalDiscountAmount;

        // Asegurar que el precio final no sea negativo
        if (finalPrice < 0) {
          finalPrice = 0;
          totalDiscountAmount = originalPrice;
        }

        // Preparar lista de descuentos aplicados
        appliedDiscounts = courseData.discountEvents.map((discount: any) => ({
          id: discount.id,
          event: discount.event,
          description: discount.description,
          value: discount.value,
          startDate: discount.startDate,
          endDate: discount.endDate,
          isActive: discount.isActive,
        }));
      }

      // Redondear el precio final a 2 decimales
      finalPrice = Math.round(finalPrice * 100) / 100;
      totalDiscountAmount = Math.round(totalDiscountAmount * 100) / 100;

      console.log(
        `Curso: ${course.title}, Descuento total: ${totalDiscountPercentage}%, Precio final: ${finalPrice}`
      ); // Debug

      totalOriginal += originalPrice;
      totalWithDiscounts += finalPrice;

      courses.push({
        cartCourseId: cartCourse.id,
        course: {
          id: course.id,
          title: course.title,
          description: course.summary,
          image: course.image,
          originalPrice,
          finalPrice,
          hasDiscount: appliedDiscounts.length > 0,
          discountEvents: appliedDiscounts,
          totalDiscountPercentage,
          savings: totalDiscountAmount,
        },
      });
    }

    // Redondear totales finales
    totalOriginal = Math.round(totalOriginal * 100) / 100;
    totalWithDiscounts = Math.round(totalWithDiscounts * 100) / 100;
    const totalSavings = Math.round((totalOriginal - totalWithDiscounts) * 100) / 100;

    return {
      id: cart.id,
      status: cart.status,
      courses,
      summary: {
        totalOriginal,
        totalWithDiscounts,
        totalSavings,
        courseCount: courses.length,
      },
      // Para compatibilidad con código existente
      totalWithDiscounts,
      cartCourses: courses,
    };
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
      });

      if (!cart) {
        return this.sendSuccess(
          res,
          req,
          {
            courses: [],
            summary: {
              totalOriginal: 0,
              totalWithDiscounts: 0,
              totalSavings: 0,
              courseCount: 0,
            },
          },
          "No hay carrito activo"
        );
      }

      const cartSummary = await this.calculateCartTotals(cart);

      this.sendSuccess(
        res,
        req,
        cartSummary,
        "Resumen del carrito obtenido exitosamente"
      );
    }
  );

  /**
   * Verifica si un curso específico está en el carrito del usuario
   */
  static checkCourseInCart = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;
      const { courseId } = req.params;

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
          { inCart: false },
          "Curso no está en el carrito"
        );
      }

      const cartCourse = await CartCourse.findOne({
        where: { cartId: cart.id, courseId: parseInt(courseId) },
      });

      this.sendSuccess(
        res,
        req,
        { inCart: !!cartCourse },
        cartCourse ? "Curso está en el carrito" : "Curso no está en el carrito"
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

  /**
   * Obtiene los pedidos (carritos con preferencias) del usuario
   * Incluye carritos con status: pending, paid, cancelled
   */
  static getOrders = this.asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req.user as User)?.id;

      if (!userId) {
        return this.unauthorized(res, req, "Usuario no autenticado");
      }

      await this.handleList(
        req,
        res,
        async (limit, offset) => {
          const orders = await Cart.findAll({
            where: {
              userId,
              status: { [Op.in]: ['pending', 'paid', 'cancelled'] }
            },
            include: [
              {
                model: PreferenceModel,
                as: "preference",
                required: false, // LEFT JOIN para incluir carritos sin preferencia
                include: [
                  {
                    model: PreferencePayment,
                    as: "payments",
                    attributes: ["id", "status", "dateApproved", "transactionAmount", "paymentMethodId", "paymentTypeId", "payer", "items"],
                  }
                ]
              },
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset,
          });

          // Calcular totales para cada carrito
          const ordersWithTotals = await Promise.all(
            orders.map(async (cart) => {
              const cartWithPrices = await this.calculateCartTotals(cart);
              return {
                id: cart.id,
                status: cart.status,
                finalPrice: cart.finalPrice,
                preferenceId: cart.preferenceId,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
                preference: (cart as any).preference,
                courses: cartWithPrices.courses,
                summary: cartWithPrices.summary,
              };
            })
          );

          const total = await Cart.count({
            where: {
              userId,
              status: { [Op.in]: ['pending', 'paid', 'cancelled'] }
            },
          });

          return { items: ordersWithTotals, total };
        },
        "Pedidos obtenidos exitosamente"
      );
    }
  );
}

export default CartController;
