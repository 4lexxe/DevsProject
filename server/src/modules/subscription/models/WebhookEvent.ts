import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";

class WebhookEvent extends Model {
  public id!: number;
  public action!: string | null;
  public type!: string | null;
  public eventId!: string | null;
  public payload!: object; // Campo JSONB para guardar todo el payload
}

WebhookEvent.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      comment: "ID único del evento en la base de datos",
    },
    action: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Acción del evento (ej: payment.created)",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Tipo de evento (ej: payment)",
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "ID dentro del campo 'data' del JSON",
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: "Payload completo del evento en formato JSON",
    },
  },
  {
    sequelize,
    tableName: "WebhookEvents",
    timestamps: true,
    paranoid: true, // Habilita el borrado lógico (soft delete)
    comment:
      "Tabla para almacenar eventos recibidos desde el webhook de MercadoPago",
  }
);

export default WebhookEvent;
