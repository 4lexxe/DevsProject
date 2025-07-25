import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Payment from "./Payment";

class Invoice extends Model {
  public id!: bigint;
  public mpSubscriptionId?: string; // ID de la suscripción a la que pertenece la factura
  public paymentId!: bigint; // ID del pago asociado en nuestra bd
  public data!: any; // Datos de la factura o pago autorizado (MercadoPago)
  public issueDate!: Date; // Fecha de emisión de la factura
  public retryAttempts?: number; // Número de intentos de reintento
}

Invoice.init(
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
    mpSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha de emisión de la factura",
    },
    retryAttempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // Valor por defecto para el número de intentos de reintento
      comment: "Reintentos",
    },
    data: {
      type: DataTypes.JSONB, // Almacena datos JSON (información de MercadoPago)
      allowNull: false,
      comment: "Datos de la factura o pago autorizado (MercadoPago)",
    },
  },
  {
    sequelize,
    tableName: "Invoices",
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    comment: "Tabla para almacenar facturas o pagos autorizados",
  }
);

Invoice.belongsTo(Payment, { foreignKey: "paymentId", as: "payment" });
Payment.hasOne(Invoice, { foreignKey: "paymentId", as: "invoice" });

export default Invoice;
