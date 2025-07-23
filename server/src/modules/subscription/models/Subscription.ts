import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Plan from "./Plan";
import User from "../../user/User";
import Payment from "./Payment";
import MPSubscription from "./MPSubscription";

class Subscription extends Model {
  public id!: bigint;
  public userId!: bigint; // ID del usuario propietario
  public payerId?: bigint; // ID del pagador en MercadoPago
  
  public planId!: bigint; // ID del plan asociado
  public mpSubscriptionId?: string; // ID de la suscripción en MercadoPago API
  public startDate?: Date; // Fecha de inicio de la suscripción
  public endDate?: Date; // Fecha de finalización de la suscripción
  public status!: "authorized" | "paused" | "cancelled" | "pending"; // Estado de la suscripción

  // Relaciones
  public mpSubscription?: any;
  
  // Timestamps automáticos
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Subscription.init(
  {
    id: { 
      type: DataTypes.BIGINT, 
      autoIncrement: true, 
      primaryKey: true,
      comment: "ID único de la suscripción",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Users", key: "id" },
      comment: "ID del usuario propietario de la suscripción",
    },
    planId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "Plans", key: "id" },
      comment: "ID del plan asociado a la suscripción",
    },
    mpSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: { model: "MPSubscriptions", key: "id" },
      comment: "ID de la suscripción en MercadoPago",
    },
    payerId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "ID del pagador en MercadoPago",
    },
    payerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Email del pagador en MercadoPago",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de inicio de la suscripción",
    },
    endDate: { 
      type: DataTypes.DATE, 
      allowNull: true,
      comment: "Fecha de finalización de la suscripción",
    },
    status: {
      type: DataTypes.ENUM("authorized", "paused", "cancelled", "pending"),
      defaultValue: "pending", // Valor por defecto
      allowNull: false,
      comment: "Estado de la suscripción",
    },
  },
  { 
    sequelize, 
    tableName: "Subscriptions", 
    timestamps: true, 
    paranoid: true,
    comment: "Tabla principal de suscripciones que conecta usuarios con planes y MercadoPago",
    // Índices importantes para optimizar consultas
    indexes: [
      {
        fields: ["userId", "status"],
        name: "idx_user_status"
      },
      {
        fields: ["planId"],
        name: "idx_plan_id"
      },
      {
        fields: ["mpSubscriptionId"],
        name: "idx_mp_subscription_id"
      },
      {
        unique: true,
        fields: ["userId"],
        where: {
          status: "authorized"
        },
        name: "unique_active_subscription_per_user"
      }
    ]
  }
);

// Relaciones
Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions" });

Subscription.belongsTo(Plan, { foreignKey: "planId", as: "plan" });
Plan.hasMany(Subscription, { foreignKey: "planId", as: "subscriptions" });

Subscription.hasMany(Payment, { foreignKey: "subscriptionId", as: "payments" });
Payment.belongsTo(Subscription, { foreignKey: "subscriptionId", as: "subscription" });

Subscription.belongsTo(MPSubscription, {
  foreignKey: "mpSubscriptionId",
  as: "mpSubscription",
  onDelete: "CASCADE",
});
MPSubscription.hasOne(Subscription, {
  foreignKey: "mpSubscriptionId",
  as: "subscription",
});

export default Subscription;
