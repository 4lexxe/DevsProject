import express from "express";
import SubscriptionPaymentController from "../controller/subcriptionPayment.controller";

const router = express.Router();

// Rutas para los pagos
router.get("/payments", SubscriptionPaymentController.getAll);
router.get("/payments/:id", SubscriptionPaymentController.getById);
router.get("/payments/paymentId/:paymentId", SubscriptionPaymentController.getByPaymentId);

export default router;