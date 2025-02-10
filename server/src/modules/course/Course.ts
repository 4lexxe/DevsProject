import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import CareerType from "../careerType/CareerType";
import Category from "../category/Category";
import Admin from "../admin/Admin";

class CourseCategory extends Model {}

class Course extends Model {
  public id!: bigint;
  public title!: string;
  public image!: string;
  public summary!: string;
  public categoryId!: bigint;
  public about!: string;
  public relatedCareerTypeId!: bigint;
  public learningOutcomes!: string[];
  public isActive!: boolean;
  public isInDevelopment!: boolean;
  public adminId!: bigint;

  public readonly createdAt!: Date; 
  public readonly updatedAt!: Date; 
}

Course.init(
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
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.BIGINT,
      references: { model: CourseCategory, key: "id" },
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    relatedCareerTypeId: {
      type: DataTypes.BIGINT,
      references: { model: CareerType, key: "id" },
    },
    learningOutcomes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isInDevelopment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.BIGINT,
      references: { model: Admin, key:"id"},      
    },
  },
  {
    sequelize,
    modelName: "Course",
    timestamps: true,
  }
);

CourseCategory.init({}, { sequelize, modelName: "course_course_category" });
CourseCategory.belongsToMany(Course, { through: CourseCategory });
Course.belongsTo(CareerType, { foreignKey: "relatedCareerTypeId" });
Course.belongsToMany(Category, { through: CourseCategory });

export default Course;