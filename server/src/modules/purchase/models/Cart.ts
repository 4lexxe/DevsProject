import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";

class Cart extends Model {
  public id!: bigint;
  public userId!: number;
  public preferenceId!: string;
  public status!: "paid" | "pending" | "cancelled" | "active";
  public finalPrice!: number;
  public paymentType!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

interface Order {
  status: "paid" | "pending" | "cancelled" | "active";
  finalPrice: number;
  expirationDateFrom?: Date;
  expirationDateTo?: Date;
  preference: {
    initPoint: string;
    payments: {
      id: string;
      status: string;
      dateApproved: string;
      transactionAmount: number;
      paymentMethodId: string;
      paymentTypeId: string;
      data: Object;
      payer: {
        email: string;
        first_name?: string;
        last_name?: string;
        identification: {
          type: string;
          number: string;
        }
      };
      items: {
        id: string;
        title: string;
        unit_price: string;
        description: string;
      }[];
    }[];
    items: {
      id: string;
      title: string;
      unit_price: string;
      description: string;
    }[];
  };
}

Cart.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      comment: "ID único del carrito",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      comment: "ID del usuario propietario del carrito",
    },
    preferenceId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: { model: "Preferences", key: "id" },
      comment: "ID de la preferencia de MercadoPago",
    },
    status: {
      type: DataTypes.ENUM("paid", "pending", "cancelled", "active"),
      allowNull: false,
      defaultValue: "active",
      comment: "Estado del carrito",
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      comment: "Monto total del carrito",
    },
  },
  {
    sequelize,
    tableName: "Carts",
    timestamps: true,
    paranoid: true,
    comment: "Tabla para almacenar los carritos de compra",
  }
);

export default Cart;
