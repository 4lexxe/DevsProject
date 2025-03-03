import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import ForumThread from "./ForumThread";

interface ForumCategoryAttributes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  parentId?: number;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumCategoryCreationAttributes extends Optional<ForumCategoryAttributes, "id" | "displayOrder" | "isActive"> {}

class ForumCategory extends Model<ForumCategoryAttributes, ForumCategoryCreationAttributes> implements ForumCategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public icon?: string;
  public parentId?: number;
  public displayOrder!: number;
  public isActive!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ForumCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "ForumCategories",
        key: "id",
      },
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "ForumCategory",
    tableName: "ForumCategories",
    timestamps: true,
  }
);

// Establecer relación con ForumThread
ForumCategory.hasMany(ForumThread, {
  sourceKey: "id",
  foreignKey: "categoryId",
  as: "threads",
});

// Establecer relación jerárquica (categorías padre-hijo)
ForumCategory.hasMany(ForumCategory, {
  sourceKey: "id",
  foreignKey: "parentId",
  as: "subcategories",
});

ForumCategory.belongsTo(ForumCategory, {
  foreignKey: "parentId",
  as: "parentCategory",
});

export default ForumCategory; 