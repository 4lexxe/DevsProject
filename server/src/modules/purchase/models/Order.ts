import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Course from "../../course/models/Course";
import { UUID } from "crypto";

class Order extends Model {
  public id!: UUID;
  public cartId!: bigint;
  public preferenceId!: string;
  public userId!: bigint; // ID del usuario que realizó la orden

  public type!: "direct" | "cart"; // Tipo de orden: compra directa o carrito
  public status!: "pending" | "paid" | "cancelled" | "expired" ;
  public externalReference!: string;
  public initPoint!: string;
  public metadata!: Array<{}>
  public totalPrice!: number; // Precio total de la orden
  public discountAmount!: number; // Monto del descuento aplicado
  public finalPrice!: number;

  public expirationDateFrom!: Date;
  public expirationDateTo!: Date;
  public expired!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: "ID único de la orden",
    },
    cartId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "ID del carrito asociado a la orden",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del usuario que realizó la orden",
    },
    preferenceId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ID de la preferencia asociada a la orden",
    },
    type: {
      type: DataTypes.ENUM("direct", "cart"),
      allowNull: false,
      comment: "Tipo de la orden",
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
      comment: "Estado de la orden",
    },
    externalReference: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Referencia externa de la orden",
    },
    initPoint: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "URL de inicio de pago de MercadoPago",
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Metadatos adicionales de la orden",
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio total de la orden",
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto del descuento aplicado",
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio final de la orden",
    },
    expirationDateFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de creación de la orden",
    },
    expirationDateTo: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de expiración de la orden",
    },
    expired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Indica si la orden ha expirado",
    },
  },
  {
    sequelize,
    tableName: "Orders",
    timestamps: true,
    paranoid: true,
    comment: "Tabla para almacenar las órdenes",
  }
);

export default Order;
