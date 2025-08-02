import express from 'express';
import WebhookController from './webhook.controller';

const router = express.Router();

// Ruta mínima para webhook de MercadoPago
router.post("/webhook/mercadopago", WebhookController.handleMercadoPagoWebhook);

export default router;
