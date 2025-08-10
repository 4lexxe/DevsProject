import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import { CartCourse } from "./Associations";

class Cart extends Model {
  public id!: bigint;
  public userId!: number;
  public status!: "paid" | "pending" | "cancelled" | "active";
  public totalPrice!: number;
  public discountAmount!: number; //valor descontado de finalPrice - totalPrice
  public finalPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public cartCourses!: CartCourse[];
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
    status: {
      type: DataTypes.ENUM("paid", "pending", "cancelled", "active"),
      allowNull: false,
      defaultValue: "active",
      comment: "Estado del carrito",
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      comment: "Monto total del carrito",
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      comment: "Valor del descuento total aplicado al carrito",
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
    comment: "Tabla para almacenar los carritos de compra",
  }
);

export default Cart;
