// server/src/modules/notification/services/NotificationService.ts
import Notification, { NotificationType } from "../models/Notification";
import User from "../../user/User";

class NotificationService {
  async createNotification(
    userId: number,
    type: NotificationType,
    message: string,
    relatedEntityId: number,
    metadata: Record<string, unknown> = {}
  ) {
    return Notification.create({
      userId,
      type,
      message,
      relatedEntityId,
      metadata
    });
  }

  async getUserNotifications(userId: number, limit: number = 20) {
    return Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit
    });
  }

  async markAsRead(notificationIds: number[], userId: number) {
    return Notification.update(
      { read: true },
      {
        where: {
          id: notificationIds,
          userId
        }
      }
    );
  }
}

export default new NotificationService();