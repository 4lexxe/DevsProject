import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Membership from "./Membership";
import PaymentMethod from "./PaymentMethod";
import PaymentGateway from "./PaymentGateway";

class Payment extends Model {
  public id!: number;
  public membershipId!: number;
  public amount!: number;
  public currency!: string;
  public paymentDate!: Date;
  public paymentMethod!: "mercadopago" | "stripe";
  public transactionId!: string | null;
  public paymentMethodId!: number | null;
  public gatewayId!: number | null;
}

Payment.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    membershipId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Memberships", key: "id" },
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.TEXT, allowNull: false },
    paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    paymentMethod: {
      type: DataTypes.ENUM("mercadopago", "stripe"),
      allowNull: false,
    },
    transactionId: { type: DataTypes.TEXT, unique: true, allowNull: true },
    paymentMethodId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "PaymentMethods", key: "id" },
    },
    gatewayId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "PaymentGateway", key: "id" },
    },
  },
  { sequelize, tableName: "Payments", timestamps: true }
);

// Relaciones
Payment.belongsTo(Membership, { foreignKey: "membershipId" });
Membership.hasMany(Payment, { foreignKey: "membershipId" });

Payment.belongsTo(PaymentMethod, { foreignKey: "paymentMethodId" });
PaymentMethod.hasMany(Payment, { foreignKey: "paymentMethodId" });

Payment.belongsTo(PaymentGateway, { foreignKey: "gatewayId" });
PaymentGateway.hasMany(Payment, { foreignKey: "gatewayId" });

export default Payment;
