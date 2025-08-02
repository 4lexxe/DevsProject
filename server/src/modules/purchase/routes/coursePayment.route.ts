import { Router } from "express";
import CoursePaymentController from "../controllers/CoursePayment.controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";

const router = Router();

/**
 * @route GET /api/payments/:id
 * @desc Obtiene un pago específico por ID
 * @access Private
 */
router.get("/:id", authMiddleware, CoursePaymentController.getPayment);

/**
 * @route GET /api/payments
 * @desc Lista todos los pagos con paginación
 * @access Private
 */
router.get("/", authMiddleware, CoursePaymentController.getAllPayments);

export default router;
