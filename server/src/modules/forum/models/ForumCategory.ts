import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import ForumThread from "./ForumPost";

interface ForumCategoryAttributes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumCategoryCreationAttributes extends Optional<ForumCategoryAttributes, "id" | "displayOrder"> {}

class ForumCategory extends Model<ForumCategoryAttributes, ForumCategoryCreationAttributes> implements ForumCategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public icon?: string;
  public displayOrder!: number;
  
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
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "ForumCategory",
    tableName: "ForumCategories",
    timestamps: true,
  }
);



export default ForumCategory; 