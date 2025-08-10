import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";

class CourseDiscount extends Model {
  public id!: bigint;
  public event!: string;
  public description!: string;
  public value!: number;
  public startDate!: Date;
  public endDate!: Date;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourseDiscount.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      comment: "ID único del evento de descuento",
    },
    event: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nombre del evento de descuento",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Descripción del evento de descuento",
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Valor del descuento (porcentaje o monto fijo)",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha de inicio del descuento",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha de fin del descuento",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Si el descuento está activo",
    },
  },
  {
    sequelize,
    tableName: "CourseDiscounts",
    timestamps: true,
    paranoid: true,
    comment: "Tabla para almacenar eventos de descuento de cursos",
  }
);

export default CourseDiscount;
