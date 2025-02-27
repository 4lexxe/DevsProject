import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Membership from "./Membership";

class Payment extends Model {
  public id!: number;
  public paymentID!: string; // ID del pago en MercadoPago
  public currency!: string; // Moneda del pago (por ejemplo, "ARS")
  public dateApproved!: Date; // Fecha de aprobación del pago
  public dateCreated!: Date; // Fecha de creación del pago
  public dateLastUpdated!: Date; // Fecha de última actualización del pago
  public description!: string; // Descripción del pago
  public status!: string; // Estado del pago (por ejemplo, "approved")
  public statusDetail!: string; // Detalle del estado (por ejemplo, "accredited")
  public transactionAmount!: number; // Monto total de la transacción
  public transactionDetails!: any; // Detalles de la transacción (JSON)
  public payer!: any; // Información del pagador (JSON)
  public paymentMethodId!: string; // ID del método de pago (por ejemplo, "master")
  public paymentTypeId!: string; // Tipo de pago (por ejemplo, "credit_card")
  public installments!: number; // Número de cuotas
  public card!: any; // Información de la tarjeta (JSON)
  public membershipId!: number; // ID de la membresía asociada
}

Payment.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      comment: "ID único del pago",
    },
    paymentID: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ID del pago en MercadoPago",
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Moneda del pago (por ejemplo, ARS, USD)",
    },
    dateApproved: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de aprobación del pago",
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha de creación del pago",
    },
    dateLastUpdated: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de última actualización del pago",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción del pago",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Estado del pago (por ejemplo, approved, pending, rejected)",
    },
    statusDetail: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Detalle adicional del estado del pago",
    },
    transactionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto total de la transacción",
    },
    transactionDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Detalles de la transacción (monto neto, total, cuotas, etc.)",
    },
    payer: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Información del pagador (email, identificación, etc.)",
    },
    paymentMethodId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ID del método de pago (por ejemplo, master)",
    },
    paymentTypeId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Tipo de pago (por ejemplo, credit_card)",
    },
    installments: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Número de cuotas en las que se realizó el pago",
    },
    card: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Información de la tarjeta utilizada (últimos 4 dígitos, nombre del titular, etc.)",
    },
    membershipId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Memberships", key: "id" },
      comment: "ID de la membresía asociada al pago",
    },
  },
  {
    sequelize,
    tableName: "Payments",
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    comment: "Tabla para almacenar los pagos realizados",
  }
);

// Relación: Payment pertenece a una Membership
Payment.belongsTo(Membership, { foreignKey: "membershipId" });
Membership.hasMany(Payment, { foreignKey: "membershipId" });

export default Payment;