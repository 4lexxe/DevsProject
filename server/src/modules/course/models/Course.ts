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
  public slug!: string; // Slug para URLs SEO-friendly
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
  // Campos para header dinámico
  public headerType?: string; // 'default' | 'programming' | 'hacking' | 'custom' | 'iframe'
  public headerTitle?: string; // Título personalizado del header
  public headerSubtitle?: string; // Subtítulo/eslogan del header
  public headerDescription?: string; // Descripción del header
  public headerButtonText?: string; // Texto del botón del header
  public headerButtonLink?: string; // Link del botón del header
  public techStack?: string[]; // Array de tecnologías (React, Node, TS, Next, etc.)
  public customHeaderContent?: string; // HTML/CSS/JS personalizado o URL de iframe
  public affiliatedCourseId?: bigint; // ID del curso afiliado (opcional)
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
    slug: {
      type: DataTypes.STRING,
      allowNull: true, // Temporalmente permitir null hasta que se cree la migración
      comment: "Slug único para URLs SEO-friendly",
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
    // Campos para header dinámico
    headerType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'default',
      comment: "Tipo de header: default, programming, hacking, custom, iframe",
    },
    headerTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Título personalizado del header (si no se proporciona, usa title)",
    },
    headerSubtitle: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Subtítulo/eslogan del header",
    },
    headerDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción del header",
    },
    headerButtonText: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Text del botón del header",
    },
    headerButtonLink: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Link del botón del header",
    },
    techStack: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: "Array de tecnologías (React, Node, TS, Next, etc.)",
    },
    customHeaderContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "HTML/CSS/JS personalizado o URL de iframe",
    },
    affiliatedCourseId: {
      type: DataTypes.BIGINT,
      references: { model: Course, key: "id" },
      allowNull: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      comment: "ID del curso afiliado (opcional)",
    },
  },
  {
    sequelize,
    modelName: "Course",
    tableName: "Courses", // 🔹 Corrección del espacio extra
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ["slug"], unique: true },
      { fields: ["title"] },
    ],
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

// 🔹 Relación con curso afiliado (auto-referencia)
Course.belongsTo(Course, { foreignKey: "affiliatedCourseId", as: "affiliatedCourse" });
Course.hasMany(Course, { foreignKey: "affiliatedCourseId", as: "affiliatedCourses" });

export default Course;
export { CourseCategory };
