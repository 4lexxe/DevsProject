import express from 'express';
import courseDiscountEventRoutes from './courseDiscountEvent.routes';
import cartRoutes from './cart.routes';
import courseAccessRoutes from './courseAccess.routes';
import coursePaymentRoutes from './coursePayment.route';

const router = express.Router();

// Rutas del carrito de cursos
router.use('/cart', cartRoutes);

// Rutas de eventos de descuento de cursos
router.use('/course/discount-events', courseDiscountEventRoutes);

// Rutas de acceso a cursos pagados
router.use('/course-access', courseAccessRoutes);

// Rutas de pagos de cursos
router.use('/payments', coursePaymentRoutes);

export default router;
