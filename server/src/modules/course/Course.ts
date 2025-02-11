import { DataTypes, Model } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import CareerType from "../careerType/CareerType";
import Category from "../category/Category";
import Admin from "../admin/Admin";

class Course extends Model {
  public id!: bigint;
  public title!: string;
  public image!: string;
  public summary!: string;
  public about!: string;
  public careerTypeId!: bigint;
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
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    careerTypeId: {
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
      references: { model: Admin, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Course",
    tableName: "Courses", // 🔹 Corrección del espacio extra
    timestamps: true,
  }
);

// 📌 Tabla intermedia para relación Muchos a Muchos (Course ↔ Category)
class CourseCategory extends Model {
  public courseId!: bigint;
  public categoryId!: bigint;
}

CourseCategory.init(
  {
    courseId: {
      type: DataTypes.BIGINT,
      references: { model: Course, key: "id" },
      allowNull: false,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.BIGINT,
      references: { model: Category, key: "id" },
      allowNull: false,
      primaryKey: true,
    },
  },
  { 
    sequelize, 
    modelName: "CourseCategory" ,
    tableName: "CourseCategories",
    timestamps: false,
  }
);

// 📌 **Relaciones**

// 🔹 Muchos a Muchos (Course ↔ Category)
Course.belongsToMany(Category, { through: CourseCategory, as: "categories" });
Category.belongsToMany(Course, { through: CourseCategory, as: "courses" });

// 🔹 Uno a Muchos (Course → CareerType)
Course.belongsTo(CareerType, { foreignKey: "careerTypeId", as: "careerType" });
CareerType.hasMany(Course, { foreignKey: "careerTypeId", as: "courses" });

// 🔹 Uno a Muchos (Course → Admin)
Course.belongsTo(Admin, { foreignKey: "adminId", as: "admin" });
Admin.hasMany(Course, { foreignKey: "adminId", as: "courses" });

export default Course;
export { CourseCategory };
