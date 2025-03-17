import express from "express";
import MPSubscriptionController from "../controller/mpSubscriptionController";

const router = express.Router();

// Rutas para las suscripciones
router.get("/subscriptions", MPSubscriptionController.getAll);
router.get("/subscriptions/:id", MPSubscriptionController.getById);
router.get("/subscriptions/subscriptionId/:subscriptionId", MPSubscriptionController.getBySubscriptionId);

export default router;