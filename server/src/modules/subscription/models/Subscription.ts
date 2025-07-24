import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Plan from "./Plan";
import User from "../../user/User";
import Payment from "./Payment";
import MPSubscription from "./MPSubscription";

class Subscription extends Model {
  public id!: bigint;
  public userId!: bigint;
  public payerId?: bigint; // Aca se guarda el id del pagador

  public planId!: bigint;
  public mpSubscriptionId?: string; // Aca se guarda el id de la subscripcion en la api de mp
  public startDate?: Date;
  public endDate?: Date;
  public status!: string;

  public mpSubscription?: any;
}

Subscription.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    planId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "Plans", key: "id" },
    },
    mpSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: { model: "MPSubscriptions", key: "id" },
    },
    payerId: {
      type: DataTypes.BIGINT,
      allowNull: true,
<<<<<<< Updated upstream
=======
      comment: "ID del pagador en MercadoPago",
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
>>>>>>> Stashed changes
    },
    startDate: { type: DataTypes.DATE, allowNull: true },
    endDate: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // Valor por defecto
      allowNull: false,
    },
  },
  { sequelize, tableName: "Subscriptions", timestamps: true, paranoid: true }
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
