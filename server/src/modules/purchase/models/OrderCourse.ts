import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Course from "../../course/models/Course";
import Order from "./Order";
import { UUID } from "crypto";

class OrderCourse extends Model {
  public id!: bigint;
  public courseId!: bigint; // ID del curso asociado
  public OrderId!: UUID; // ID de la orden asociada

  //Para guardar informacion exacta del curso al momento del pago
  public courseSnapshot!: {
    id: string;
    title: string;
    sumary: string;
    about: string;
    isInDevelopment: boolean;
    adminId: string;
    price: number;
  };
  public courseDiscountSnapshot!: {
    id: string;
    event: string;
    description: string;
    value: number;
    startDate: string;
    endDate: string;
  };
  
  public unitPrice!: number; // Precio del curso
  public discountValue!: number;
  public priceWithDiscount!: number; // Precio del curso con el o los descuentos aplicados

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderCourse.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: "ID único de la orden del curso",
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: Course, key: "id" },
      comment: "ID del curso asociado",
    },
    OrderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Order, key: "id" },
      comment: "ID de la orden asociada",
    },

    discountEventSnapshot: {
        type: DataTypes.JSONB,
        allowNull: false,
    },

    courseSnapshot: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    discountValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Valor del descuento aplicado al curso",
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio del curso",
    },
    priceWithDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio del curso con el o los descuentos aplicados",
    },
  },
  {
    sequelize,
    tableName: "OrderCourses",
    timestamps: true,
    paranoid: true,
    comment: "Tabla para almacenar las órdenes de cursos",
    indexes: [
      {
        unique: true,
        fields: ['courseId', 'OrderId']
      }
    ]
  }
);

export default OrderCourse;
