import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";

class Category extends Model {
  public id!: bigint;
  public name!: string;
  public description!: string;
  public isActive!: boolean;
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
    modelName: "category",
  }
);

export default Category;
