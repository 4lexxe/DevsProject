// server/src/modules/notification/routes/notification.routes.ts
import { Router, RequestHandler } from 'express';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { getNotifications, markNotificationsAsRead } from '../controllers/NotificationController';


const router = Router();

// Rutas protegidas por autenticación
router.use(authMiddleware);

// Obtener notificaciones del usuario
router.get('/', getNotifications as RequestHandler);

// Marcar notificaciones como leídas
router.post('/mark-read', markNotificationsAsRead as RequestHandler);

export default router;