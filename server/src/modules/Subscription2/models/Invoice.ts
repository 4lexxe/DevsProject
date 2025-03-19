import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Payment from "./Payment";

class Invoice extends Model {
  public id!: bigint;
  public paymentId!: string; // ID del pago asociado en nuestra bd
  public data!: any; // Datos de la factura o pago autorizado (MercadoPago)
  public issueDate!: Date; // Fecha de emisión de la factura
  public dueDate!: Date; // Fecha de vencimiento de la factura
}

Invoice.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "Payments", key: "id" }, // Relación con la tabla Subscription
    },
    data: {
      type: DataTypes.JSONB, // Almacena datos JSON (información de MercadoPago)
      allowNull: false,
      comment: "Datos de la factura o pago autorizado (MercadoPago)",
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha de emisión de la factura",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha de vencimiento de la factura",
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