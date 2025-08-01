import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../infrastructure/database/db';
import User from '../../user/User';

export interface SessionAttributes {
  id?: number;
  userId: number;
  token: string;
  createdAt: Date;
  lastUsed: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  geoLocation?: {
    city?: string;
    region?: string;
    country?: string;
    loc?: [number, number];
    timezone?: string;
    isProxy: boolean;
    org?: string;
  };
  isActive: boolean;
}

class Session extends Model<SessionAttributes> implements SessionAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public createdAt!: Date;
  public lastUsed!: Date;
  public expiresAt!: Date;
  public userAgent?: string;
  public ipAddress?: string;
  public geoLocation?: {
    city?: string;
    region?: string;
    country?: string;
    loc?: [number, number];
    timezone?: string;
    isProxy: boolean;
    org?: string;
  };
  public isActive!: boolean;

  // Timestamps automáticos
  public readonly updatedAt!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastUsed: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45), // IPv6 compatible
      allowNull: true,
    },
    geoLocation: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['token'],
        unique: true,
      },
      {
        fields: ['expiresAt'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

// Definir asociaciones
Session.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Session, {
  foreignKey: 'userId',
  as: 'sessions',
});

export default Session;