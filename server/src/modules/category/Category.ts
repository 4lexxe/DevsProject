import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";

class Category extends Model {
  public id!: bigint;
  public name!: string;
  public icon?: string;
  public description!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date; 
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "Categories",
    timestamps: true
  }
);

export default Category;
