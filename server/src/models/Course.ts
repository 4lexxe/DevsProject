import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Admin from './Admin';  // Relación con el administrador

class Course extends Model {
  public id!: number;
  public title!: string;
  public image!: string;
  public summary!: string;
  public adminId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: true
    },
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Admins',
        key: 'id',
      },
    }
  },
  {
    sequelize,
    tableName: 'courses',
    modelName: 'Course',
    timestamps: true
  }
);

// Relación con Admin
Course.belongsTo(Admin, { foreignKey: 'adminId' });

export default Course;