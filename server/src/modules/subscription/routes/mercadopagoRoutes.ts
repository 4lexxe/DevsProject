import express from 'express';
import MercadoPagoController from '../controller/mercadopagoController';

const router = express.Router();

router.post("/mercadopago/webhook", MercadoPagoController.handleWebhook)

export default router;