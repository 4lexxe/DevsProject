import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Membership from "./Membership";

class Invoice extends Model {
  public id!: number;
  public membershipId!: number; // ID de la membresía asociada
  public data!: Object; // Datos de la factura o pago autorizado (MercadoPago)
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
    membershipId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Memberships", key: "id" }, // Relación con la tabla Memberships
      comment: "ID de la membresía asociada a esta factura",
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

// Relación: Invoice pertenece a una Membership
Invoice.belongsTo(Membership, { foreignKey: "membershipId" });
Membership.hasMany(Invoice, { foreignKey: "membershipId" });

export default Invoice;