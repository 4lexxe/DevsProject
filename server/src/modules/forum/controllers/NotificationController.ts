// server/src/modules/notification/controllers/NotificationController.ts
import { Request, Response } from 'express';
import NotificationService from '../services/NotificationService';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo notificaciones' });
  }
};

export const markNotificationsAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await NotificationService.markAsRead(req.body.ids, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando notificaciones' });
  }
};