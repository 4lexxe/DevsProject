import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import Course from "../course/Course2";

class Section extends Model {
  public id!: bigint;
  public title!: string;
  public description!: string;
  public courseId!: bigint;
  public coverImage!: string;
  
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
  },
  {
    sequelize,
    modelName: "section",
    timestamps: true,
  }
);

Section.belongsTo(Course, { foreignKey: "courseId" });

export default Section;
