import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";

class CareerType extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date; 
  public readonly updatedAt!: Date;
}

CareerType.init(
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
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "CareerType",
    tableName: "CareerTypes",
    timestamps: true,
  }
);

export default CareerType;
