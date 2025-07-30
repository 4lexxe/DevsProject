import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";

class CourseDiscountEvent extends Model {
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

CourseDiscountEvent.init(
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
    tableName: "CourseDiscountEvents",
    timestamps: true,
    paranoid: true,
    comment: "Tabla para almacenar eventos de descuento de cursos",
  }
);

// Tabla intermedia para la relación muchos a muchos
class CourseDiscountEventAssociation extends Model {
  public courseId!: bigint;
  public discountEventId!: bigint;
}

CourseDiscountEventAssociation.init(
  {
    courseId: {
      type: DataTypes.BIGINT,
      references: { model: "Courses", key: "id" },
      allowNull: false,
      primaryKey: true,
      comment: "ID del curso",
    },
    discountEventId: {
      type: DataTypes.BIGINT,
      references: { model: CourseDiscountEvent, key: "id" },
      allowNull: false,
      primaryKey: true,
      comment: "ID del evento de descuento",
    },
  },
  {
    sequelize,
    modelName: "CourseDiscountEventAssociation",
    tableName: "CourseDiscountEventAssociations",
    timestamps: false,
    comment: "Tabla intermedia para relación muchos a muchos entre Courses y CourseDiscountEvents",
  }
);

export default CourseDiscountEvent;
export { CourseDiscountEventAssociation };
