import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";

class CartCourse extends Model {
  public id!: bigint;
  public courseId!: bigint;
  public cartId!: bigint;
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
    paranoid: true,
    comment: "Tabla de relación entre carritos y cursos",
  }
);

export default CartCourse;
