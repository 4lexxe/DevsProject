import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";

class CartCourse extends Model {
  public id!: bigint;
  public courseId!: bigint;
  public cartId!: bigint;
  public unitPrice!: number; // Precio del curso
  public discountValue!: number;
  public priceWithDiscount!: number; // Precio del curso con el descuento aplicado
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CartCourse.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      comment: "ID único de la relación carrito-curso",
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Courses", key: "id" },
      comment: "ID del curso",
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio unitario del curso",
    },
    discountValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0.0,
      comment: "Valor del descuento aplicado al curso",
    },
    priceWithDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: "Precio del curso con el descuento aplicado",
    },
    cartId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Carts", key: "id" },
      comment: "ID del carrito",
    },
  },
  {
    sequelize,
    tableName: "CartCourses",
    timestamps: true,
    comment: "Tabla de relación entre carritos y cursos",
  }
);

export default CartCourse;
