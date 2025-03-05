import express from 'express';
import MercadoPagoController from '../controller/mercadopagoController';

const router = express.Router();

// Ruta para crear una suscripción
/* router.post('/mercadopago/subscriptions', MercadoPagoController.createSubscription); */
/* router.post("/mercadopago/subscriptions/plans", MercadoPagoController.createSubscriptionPlan) */

router.post("/mercadopago/webhook", MercadoPagoController.handleWebhook)

export default router;