import { Router } from 'express';
import InvoiceController from '../controller/invoice.controller';

const router = Router();

// ...existing routes...

// Ruta para descargar el PDF de la factura
router.get('/invoices/:id/download', InvoiceController.downloadInvoicePDF);

export default router;