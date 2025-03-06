import express from 'express';
import DiscountController from '../controller/discountController';
import { validateDiscount } from '../validators/discountValidate';

const router = express.Router();

// Rutas para Discount
router.post('/discounts', validateDiscount, DiscountController.create); // Crear un descuento
router.get('/discounts', DiscountController.getAll); // Obtener todos los descuentos
router.get('/discounts/:id', DiscountController.getById); // Obtener un descuento por ID
router.put('/discounts/:id', validateDiscount, DiscountController.update); // Actualizar un descuento por ID
router.delete('/discounts/:id', DiscountController.delete); // Eliminar un descuento por ID

export default router;