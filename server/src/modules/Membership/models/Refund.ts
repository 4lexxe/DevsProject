import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Payment from "./Payment";

class Refund extends Model {
  public id!: number;
  public paymentId!: number;
  public refundDate!: Date;
  public amount!: number;
  public reason!: string | null;
  public status!: "pending" | "approved" | "rejected";
}

Refund.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    paymentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Payments", key: "id" },
    },
    refundDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Refunds",
    timestamps: false,
  }
);

// Relación: Refund pertenece a un Payment
Refund.belongsTo(Payment, { foreignKey: "paymentId" });
Payment.hasMany(Refund, { foreignKey: "paymentId" });

export default Refund;
