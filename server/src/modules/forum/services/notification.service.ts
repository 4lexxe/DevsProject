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
    try {
      if (!userId || !relatedEntityId) {
        throw new Error('Invalid userId or relatedEntityId');
      }
      return await Notification.create({
        userId,
        type,
        message,
        relatedEntityId,
        metadata,
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: number, limit: number = 20, offset: number = 0) {
    try {
      if (!userId) {
        throw new Error('Invalid userId');
      }
      return await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationIds: number[], userId: number) {
    try {
      if (!userId || !notificationIds.length) {
        throw new Error('Invalid userId or notificationIds');
      }
      return await Notification.update(
        { read: true },
        {
          where: {
            id: notificationIds,
            userId
          }
        }
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }
}

export default new NotificationService();