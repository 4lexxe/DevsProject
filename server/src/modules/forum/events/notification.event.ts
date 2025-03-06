// server/src/modules/notification/events/notificationEvents.ts
import { EventEmitter } from 'events';
import NotificationService from '../services/notification.service';
import { NotificationType } from '../models/Notification';

const notificationEmitter = new EventEmitter();

// Escuchar eventos de reportes resueltos
notificationEmitter.on('REPORT_RESOLVED', async (report, moderator) => {
  try {
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
    console.log(`Notification sent for resolved report #${report.id}`);
  } catch (error) {
    console.error('Error sending notification for resolved report:', error);
  }
});

// Escuchar eventos de menciones
notificationEmitter.on('USER_MENTIONED', async (mentionedUser, context) => {
  try {
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
    console.log(`Notification sent for mention in ${context.entityType}`);
  } catch (error) {
    console.error('Error sending notification for mention:', error);
  }
});

notificationEmitter.on('MODERATION_ACTION', async (user, context) => {
  try {
    const actionMessages = {
      'delete_post': 'Tu publicación ha sido eliminada por un moderador',
      'delete_reply': 'Tu respuesta ha sido eliminada por un moderador',
      'warn': 'Has recibido una advertencia de moderación',
      'default': 'Una acción de moderación ha sido tomada en tu contenido'
    };

    const message = actionMessages[context.action as keyof typeof actionMessages] || actionMessages.default;
    
    await NotificationService.createNotification(
      user.id,
      NotificationType.MODERATION_ACTION,
      message,
      context.targetId,
      {
        action: context.action,
        targetType: context.targetType,
        moderatorId: context.moderatorId
      }
    );
    console.log(`Notification sent for moderation action on ${context.targetType}`);
  } catch (error) {
    console.error('Error sending notification for moderation action:', error);
  }
});

// Escuchar eventos de nuevas publicaciones en hilos
notificationEmitter.on('NEW_THREAD_POST', async (user, context) => {
  try {
    await NotificationService.createNotification(
      user.id,
      NotificationType.THREAD_UPDATE,
      `Hay una nueva publicación en el hilo "${context.threadTitle}"`,
      context.threadId,
      {
        postId: context.postId,
        authorId: context.authorId
      }
    );
    console.log(`Notification sent for new post in thread #${context.threadId}`);
  } catch (error) {
    console.error('Error sending notification for new thread post:', error);
  }
});

notificationEmitter.on('NEW_REPLY', async (user, context) => {
  try {
    await NotificationService.createNotification(
      user.id,
      NotificationType.NEW_REPLY,
      `Nueva respuesta en tu post: "${context.post.content.substring(0, 30)}..."`,
      context.post.id,
      {
        replyId: context.reply.id,
        responderId: context.responderId  
      }
    );
    console.log(`Notification sent for new reply in post #${context.post.id}`);
  } catch (error) {
    console.error('Error sending notification for new reply:', error);
  }
});

export default notificationEmitter;