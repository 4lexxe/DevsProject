import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Payment from "./Payment";

class Transaction extends Model {
  public id!: number;
  public paymentId!: number;
  public transactionDate!: Date;
  public status!: "pending" | "completed" | "failed";
  public details!: string | null;
}

Transaction.init(
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
    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Transactions",
    timestamps: false,
  }
);

// Relación: Transaction pertenece a un Payment
Transaction.belongsTo(Payment, { foreignKey: "paymentId" });
Payment.hasMany(Transaction, { foreignKey: "paymentId" });

export default Transaction;
