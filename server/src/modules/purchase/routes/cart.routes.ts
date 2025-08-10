import { Router } from "express";
import CartController from "../controllers/cart.controller";
import {
  addCourseToCartValidation,
  removeCourseFromCartValidation,
} from "../validators/cart.validators";

const router = Router();

// ==================== RUTAS DEL CARRITO ====================

/**
 * @route   GET /api/cart
 * @desc    Obtener el carrito activo del usuario autenticado
 * @access  Private
 */
router.get("/", CartController.getActiveCart);

/**
 * @route   GET /api/cart/summary
 * @desc    Obtener resumen del carrito con precios y descuentos
 * @access  Private
 */
router.get("/summary", CartController.getCartSummary);

/**
 * @route   POST /api/cart/courses
 * @desc    Agregar un curso al carrito
 * @access  Private
 * @body    { courseId: number }
 */
router.post("/courses", addCourseToCartValidation, CartController.addCourseToCart);

/**
 * @route   DELETE /api/cart/courses/:courseId
 * @desc    Eliminar un curso del carrito
 * @access  Private
 */
router.delete("/courses/:courseId", removeCourseFromCartValidation, CartController.removeCourseFromCart);

/**
 * @route   GET /api/cart/count
 * @desc    Obtener el número de cursos en el carrito
 * @access  Private
 */
router.get("/count", CartController.getCartCount);

/**
 * @route   DELETE /api/cart
 * @desc    Vaciar completamente el carrito
 * @access  Private
 */
router.delete("/", CartController.clearCart);

/**
 * @route   POST /api/cart/payment
 * @desc    Crear preferencia de MercadoPago para procesar el pago del carrito
 * @access  Private
 */
router.post("/payment", CartController.createCartPaymentPreference);

/**
 * @route   PUT /api/cart/cancel-pending
 * @desc    Cancelar carrito con estado pending del usuario
 * @access  Private
 */
router.put("/cancel-pending", CartController.cancelPendingCart);

export default router;