import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";

class PaymentGateway extends Model {
  public id!: number;
  public name!: string;
  public apiKey!: string;
  public secretKey!: string;
  public webhookUrl!: string | null;
  public status!: "active" | "inactive";
  public createdAt!: Date;
}

PaymentGateway.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    apiKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    secretKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    webhookUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "PaymentGateway",
    timestamps: false,
  }
);

export default PaymentGateway;
