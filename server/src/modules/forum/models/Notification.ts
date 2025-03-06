// server/src/modules/notification/models/Notification.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";

export enum NotificationType {
  NEW_REPLY = "new_reply",
  MENTION = "mention",
  REPORT_RESOLVED = "report_resolved",
  THREAD_UPDATE = "thread_update",
  MODERATION_ACTION = "moderation_action"
}

interface NotificationAttributes {
  id: number;
  userId: number;
  type: NotificationType;
  message: string;
  relatedEntityId: number;
  read: boolean;
  metadata?: Record<string, unknown>;
}

// Creation attributes interface - makes id optional and provides defaults
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'read'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public type!: NotificationType;
  public message!: string;
  public relatedEntityId!: number;
  public read!: boolean;
  public metadata!: Record<string, unknown>;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Relaciones
  public readonly user?: User;
}

Notification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(...Object.values(NotificationType)),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  relatedEntityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  sequelize,
  tableName: 'Notifications',
  indexes: [
    {
      fields: ['userId', 'read']
    }
  ]
});

export default Notification;