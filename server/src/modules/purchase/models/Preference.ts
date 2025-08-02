import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Course from "../../course/models/Course";

class Preference extends Model {
  public id!: string;
  public externalReference!: string;
  public initPoint!: string;
  public items!: any; // JSON con los items de la preferencia
  public expirationDateFrom!: Date;
  public expirationDateTo!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Preference.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      comment: "ID único de la preferencia",
    },
    externalReference: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Referencia externa de la preferencia",
    },
    initPoint: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "URL de inicio de pago de MercadoPago",
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: "Items de la preferencia en formato JSON",
    },
    expirationDateFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de creación de la preferencia",
    },
    expirationDateTo: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de expiración de la preferencia",
    },
  },
  {
    sequelize,
    tableName: "Preferences",
    timestamps: true,
    paranoid: true,
    comment: "Tabla para almacenar las preferencias de MercadoPago",
  }
);

export default Preference;
