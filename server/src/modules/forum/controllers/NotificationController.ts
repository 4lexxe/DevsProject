// server/src/modules/notification/controllers/NotificationController.ts
import { Request, Response } from 'express';
import NotificationService from '../services/notification.service';
import { AuthRequest } from "../../auth/controllers/verify.controller";
import User from "../../user/User";

// Obtener todas las notificaciones del usuario autenticado
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'No autorizado.' });
      return;
    }
    const notifications = await NotificationService.getUserNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ success: false, error: 'Error obteniendo notificaciones' });
  }
};

// Marcar notificaciones como leídas
export const markNotificationsAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'No autorizado.' });
      return;
    }
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'number')) {
      res.status(400).json({ success: false, error: 'IDs inválidos' });
      return;
    }
    await NotificationService.markAsRead(ids, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando notificaciones:', error);
    res.status(500).json({ success: false, error: 'Error actualizando notificaciones' });
  }
};