import express from 'express';
import OrderController from '../controllers/orderController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

/**
 * @route GET /api/purchase/orders
 * @desc Obtener todas las órdenes del usuario autenticado
 * @access Private
 */
router.get('/user', OrderController.getUserOrders);

/**
 * @route GET /api/purchase/orders/summary
 * @desc Obtener resumen de órdenes del usuario
 * @access Private
 */
router.get('/summary', OrderController.getOrdersSummary);

/**
 * @route GET /api/purchase/orders/:orderId
 * @desc Obtener una orden específica por ID
 * @access Private
 */
router.get('/:orderId', OrderController.getOrderById);

/**
 * @route PUT /api/purchase/orders/:orderId/cancel
 * @desc Cancelar una orden
 * @access Private
 */
router.put('/:orderId/cancel', OrderController.cancelOrder);

export default router;
