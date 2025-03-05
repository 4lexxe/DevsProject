// server/src/modules/forum/routes/ReportRoutes.ts
import { Router, RequestHandler } from "express";
import { ReportController } from '../controllers/ReportController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Enviar un nuevo reporte (requiere autenticación)
router.post('/', authMiddleware, ReportController.submitReport as RequestHandler);

// Obtener detalles de un reporte específico (requiere autenticación)
router.get('/:reportId', authMiddleware, ReportController.reviewReport as RequestHandler);

// Obtener todos los reportes (público o con permisos especiales)
router.get('/', ReportController.getReports);

// Tomar acción sobre un reporte (requiere autenticación)
router.put('/:reportId/action', authMiddleware, ReportController.takeActionOnReport as RequestHandler);

export default router;