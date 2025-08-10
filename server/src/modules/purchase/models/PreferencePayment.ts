import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Order from "./Order";

import { UUID } from "crypto";

class PreferencePayment extends Model {
  public id!: string;
  public orderId!: UUID;
  public externalReference!: string;
  public metadata!: Object;
  public dateApproved!: Date;
  public status!: string;
  public transactionAmount!: number;
  public paymentMethodId!: string;
  public paymentTypeId!: string;
  public data!: any; // JSON con todos los datos del pago
  public payer!: any; // JSON con datos del pagador
  public items!: any; // JSON con items del pago
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PreferencePayment.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      comment: "ID del pago en MercadoPago",
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Order, key: "id" },
      comment: "ID de la orden asociada",
    },
    externalReference: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Referencia externa del pago",
    },
    dateApproved: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de aprobación del pago",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Estado del pago (approved, pending, rejected, etc.)",
    },
    transactionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto de la transacción",
    },
    paymentMethodId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ID del método de pago",
    },
    paymentTypeId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Tipo de pago",
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: "Datos completos del pago en formato JSON",
    },
    payer: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: "Datos del pagador en formato JSON",
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: "Items del pago en formato JSON",
    },
  },
  {
    sequelize,
    tableName: "PreferencePayments",
    timestamps: true,
    paranoid: true,
    comment: "Tabla para almacenar los pagos de preferencias",
  }
);

export default PreferencePayment;
