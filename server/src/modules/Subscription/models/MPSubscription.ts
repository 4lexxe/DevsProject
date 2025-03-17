import { Model, DataTypes } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Subscription from "./Subscription";

class MPSubscription extends Model {
  public id!: string; // Aca se guarda el id generado en la api de mp
  public subscriptionId!: bigint; // Aca se guarda el id de la suscripcion en la base de datos
  public payerId!: number;
  public status!: string;
  public dateCreated!: Date;
  public nextPaymentDate!: Date;
  public initPoint!: string;
  public data!: any;
}

// Le falta el campo subscriptionId que va a ser del modelo Subscription
// Que va a tener una relacion uno a uno con Subscription

MPSubscription.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      comment: "ID único de la suscripción de la api de MP",
    },
    subscriptionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID de la suscripción en la base de datos",
      references: {
        model: Subscription,
        key: "id",
      }
    },
    payerId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "ID del pagador",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha del próximo pago",
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: "Datos completos de la suscripción en formato JSON",
    },
  },
  {
    sequelize,
    modelName: "MPSubscription",
    tableName: "MPSubscriptions", // Nombre de la tabla en la base de datos
    timestamps: true, // Habilita los timestamps (createdAt, updatedAt)
    paranoid: true, // Habilita el soft
  }
);

MPSubscription.belongsTo(Subscription, {
  foreignKey: "subscriptionId",
  as: "subscription",
  onDelete: "CASCADE",
});

Subscription.hasOne(MPSubscription, {
  foreignKey: "subscriptionId",
  as: "mpSubscription",
  onDelete: "CASCADE",
});

export default MPSubscription;
