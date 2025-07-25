import express from "express";
import PaymentController from "../controller/payment.controller";

const router = express.Router();

// Rutas para los pagos
router.get("/payments", PaymentController.getAll);
router.get("/payments/:id", PaymentController.getById);
router.get("/payments/paymentId/:paymentId", PaymentController.getByPaymentId);

export default router;