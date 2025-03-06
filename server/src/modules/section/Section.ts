import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import Course from "../course/Course";

class Section extends Model {
  public id!: bigint;
  public title!: string;
  public description!: string;
  public courseId!: bigint;
  public coverImage!: string;
  public moduleType!: 'Introductorio' | 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto' | 'Insano Hardcore';
  public colorGradient!: string[];
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Section.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.BIGINT,
      references: { model: Course, key: "id" },
    },
    coverImage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    moduleType: {
      type: DataTypes.ENUM('Introductorio', 'Principiante', 'Intermedio', 'Avanzado', 'Experto', 'Insano Hardcore'),
      allowNull: false,
      defaultValue: 'Introductorio',
    },
    colorGradient: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: ['#41d6c6', '#478bdc'],
    },
  },
  {
    sequelize,
    modelName: "Section",
    tableName: "Sections",
    timestamps: true,
  }
);

Section.belongsTo(Course, { foreignKey: "courseId", as: "course" });
Course.hasMany(Section, { foreignKey: "courseId", as: "sections" });

export default Section;
