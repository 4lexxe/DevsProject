import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Course from './Course';  // Relación con el curso

class Section extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public courseId!: number;  // Relación con el curso
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Section.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'courses',  // Asegúrate de que el nombre de la tabla sea en minúsculas ('courses')
        key: 'id',
      },
    }
  },
  {
    sequelize,
    tableName: 'sections',
    modelName: 'Section',
    timestamps: true
  }
);

// Relación con el curso
Section.belongsTo(Course, { foreignKey: 'courseId' });

export default Section;