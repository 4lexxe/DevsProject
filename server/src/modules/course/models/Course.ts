import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import CareerType from "../models/CareerType";
import Category from "../models/Category";
import Admin from "../../admin/Admin";
import CourseDiscount from "../../purchase/models/CourseDiscount";

class Course extends Model {
  public id!: bigint;
  public courseDiscountId?: bigint;
  public title!: string;
  public image!: string;
  public summary!: string;
  public about!: string;
  public careerTypeId?: bigint;
  public learningOutcomes!: string[];
  public prerequisites?: string[];
  public isActive!: boolean;
  public isInDevelopment!: boolean;
  public price!: number; // Precio del curso
  public adminId!: bigint;
  public driveFolderId?: string; // ID de la carpeta en Google Drive para el curso
  public readonly createdAt!: Date; 
  public readonly updatedAt!: Date; 

  courseDiscount?: CourseDiscount;

  // Asociaciones
  public sections?: any[]; // Relación con secciones
}

Course.init(
  { 
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    courseDiscountId: {
      type: DataTypes.BIGINT,
      references: { model: CourseDiscount, key: "id" },
      allowNull: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
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
    prerequisites: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isInDevelopment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    adminId: {
      type: DataTypes.BIGINT,
      references: { model: Admin, key: "id" },
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
      defaultValue: 100, // Precio por defecto
    },
    driveFolderId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "ID de la carpeta en Google Drive para el curso",
    },
  },
  {
    sequelize,
    modelName: "Course",
    tableName: "Courses", // 🔹 Corrección del espacio extra
    timestamps: true,
    paranoid: true,
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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    categoryId: {
      type: DataTypes.BIGINT,
      references: { model: Category, key: "id" },
      allowNull: false,
      primaryKey: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
Course.belongsToMany(Category, { 
  through: CourseCategory, 
  as: "categories", 
  foreignKey: "courseId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Category.belongsToMany(Course, { 
  through: CourseCategory, 
  as: "courses", 
  foreignKey: "categoryId",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});


// 🔹 Uno a Muchos (Course → CareerType)
Course.belongsTo(CareerType, { foreignKey: "careerTypeId", as: "careerType" });
CareerType.hasMany(Course, { foreignKey: "careerTypeId", as: "courses" });

// 🔹 Uno a Muchos (Course → Admin)
Course.belongsTo(Admin, { foreignKey: "adminId", as: "admin" });
Admin.hasMany(Course, { foreignKey: "adminId", as: "courses" });

export default Course;
export { CourseCategory };
