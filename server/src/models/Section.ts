import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Course from './Course'; // Relación con el curso

class Section extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public courseId!: number;
  public moduleType!: string;  // Nuevo atributo: tipo de módulo
  public coverImage!: string; // Nuevo atributo: portada de la sección
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
        model: 'Courses',
        key: 'id',
      },
    },
    moduleType: {  // Atributo agregado para el tipo de módulo
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Módulo Fundamental', // Valor por defecto, pero puedes cambiarlo según la lógica de tu aplicación
    },
    coverImage: {  // Atributo agregado para la portada de la sección
      type: DataTypes.STRING,
      allowNull: true, // Este atributo puede ser opcional, dependiendo de si siempre habrá una portada
    }
  },
  {
    sequelize,
    tableName: 'Sections',
    modelName: 'Section',
    timestamps: true
  }
);

// Relación con Course
Section.belongsTo(Course, { foreignKey: 'courseId' });

export default Section;