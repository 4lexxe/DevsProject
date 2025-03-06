// server/src/modules/notification/events/notificationEvents.ts
import { EventEmitter } from 'events';
import NotificationService from '../services/NotificationService';
import { NotificationType } from '../models/Notification';

const notificationEmitter = new EventEmitter();

// Escuchar eventos de reportes resueltos
notificationEmitter.on('REPORT_RESOLVED', async (report, moderator) => {
  await NotificationService.createNotification(
    report.userId,
    NotificationType.REPORT_RESOLVED,
    `Tu reporte #${report.id} ha sido procesado`,
    report.id,
    {
      status: report.status,
      moderatorId: moderator.id
    }
  );
});

// Escuchar eventos de menciones
notificationEmitter.on('USER_MENTIONED', async (mentionedUser, context) => {
  await NotificationService.createNotification(
    mentionedUser.id,
    NotificationType.MENTION,
    `Has sido mencionado en ${context.entityType}`,
    context.entityId,
    {
      mentionedBy: context.userId,
      excerpt: context.excerpt
    }
  );
});

export default notificationEmitter;