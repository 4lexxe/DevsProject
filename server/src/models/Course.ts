import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Admin from './Admin'; // Relación con Admin

class Course extends Model {
  public id!: number;
  public title!: string;
  public image!: string;
  public summary!: string;
  public category!: string;
  public about!: string;
  public relatedCareerType!: string;
  public learningOutcomes!: string[];
  public isActive!: boolean;
  public isInDevelopment!: boolean;
  public adminId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    relatedCareerType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    learningOutcomes: {
      type: DataTypes.JSONB, // Usamos JSONB para almacenar los temas de aprendizaje
      allowNull: true,
      defaultValue: [], // Valor por defecto es un array vacío
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Valor por defecto es true (activo)
    },
    isInDevelopment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Valor por defecto es false (no está en desarrollo)
    },
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Admins',
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Courses',
    modelName: 'Course',
    timestamps: true,
  }
);

// Relación con Admin
Course.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

export default Course;