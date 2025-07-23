import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import MPSubscription from "./MPSubscription";

class Payment extends Model {
  public id!: bigint;  
  public subscriptionId!: bigint; // ID de la suscripción a la que pertenece el pago
  public mpSubscriptionId!: string; // ID de la suscripción a la que pertenece el pago
  public dateApproved!: Date; // Fecha de aprobación del pago
  public status!: string; // Estado del pago (ej: "approved")
  public transactionAmount!: number; // Monto total de la transacción
  public paymentMethodId!: string; // ID del método de pago (ej: "master")
  public paymentTypeId!: string; // Tipo de pago (ej: "credit_card")
  public preApprovalId!: string; // ID de la pre-aprobación
  public data!: any; // Resto de los datos encapsulados en JSONB
}

Payment.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "ID del pago en MercadoPago",
    },
    subscriptionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Subscriptions", key: "id" },
      comment: "ID de la suscripción a la que pertenece el pago",
    },
    dateApproved: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de aprobación del pago",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Estado del pago (por ejemplo, approved, pending, rejected)",
    },
    transactionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto total de la transacción",
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
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: "Datos completos del pago en formato JSON",
    },
  },
  {
    sequelize,
    tableName: "Payments",
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    paranoid: true,
    comment: "Tabla para almacenar los pagos realizados",
  }
);

// Relaciones
Payment.belongsTo(MPSubscription, {
  foreignKey: "mpSubscriptionId",
  as: "mpSubscription",
  onDelete: "CASCADE",
});

MPSubscription.hasMany(Payment, {
  foreignKey: "mpSubscriptionId",
  as: "payments",
});

export default Payment;

