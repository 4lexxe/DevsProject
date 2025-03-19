import express from 'express';
import DiscountEventController from '../controller/discountEventController';
import { validateDiscount } from '../validators/discountValidate';

const router = express.Router();

// Rutas para Discount
router.post('/discounts', validateDiscount, DiscountEventController.create); // Crear un descuento
router.get('/discounts', DiscountEventController.getAll); // Obtener todos los descuentos
router.get('/discounts/:id', DiscountEventController.getById); // Obtener un descuento por ID
router.put('/discounts/:id', validateDiscount, DiscountEventController.update); // Actualizar un descuento por ID
router.delete('/discounts/:id', DiscountEventController.delete); // Eliminar un descuento por ID

export default router;