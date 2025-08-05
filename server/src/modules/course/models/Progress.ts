import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../infrastructure/database/db';
import User from '../../user/User';
import Course from './Course';
import Content from './Content';

class Progress extends Model {
  public id!: bigint;
  public userId!: bigint;
  public courseId!: bigint;
  public contentId!: bigint;
  public isCompleted!: boolean;
  public completedAt?: Date;
  public timeSpent?: number; // Tiempo en minutos
  public lastAccessedAt!: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Progress.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: Course, key: 'id' },
    },
    contentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: Content, key: 'id' },
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Progress',
    tableName: 'Progress',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'courseId', 'contentId'],
      },
      {
        fields: ['userId', 'courseId'],
      },
      {
        fields: ['courseId'],
      },
    ],
  }
);

// Definir relaciones
Progress.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Progress.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Progress.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });

User.hasMany(Progress, { foreignKey: 'userId', as: 'progress' });
Course.hasMany(Progress, { foreignKey: 'courseId', as: 'progress' });
Content.hasMany(Progress, { foreignKey: 'contentId', as: 'progress' });

export default Progress;