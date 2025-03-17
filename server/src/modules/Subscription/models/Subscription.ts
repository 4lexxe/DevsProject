import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Plan from "./Plan";
import User from "../../user/User";

class Subscription extends Model {
  public id!: bigint;
  public userId!: bigint;
  public planId!: bigint;
  public paymentId?: string;
  public startDate?: Date;
  public endDate?: Date;
  public status!: "paused" | "authorized" | "cancelled" | "pending";
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
      allowNull: false,
      references: { model: "Plans", key: "id" },
    },
    paymentId: { type: DataTypes.STRING, allowNull: true },
    startDate: { type: DataTypes.DATE, allowNull: true },
    endDate: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("authorized", "paused", "cancelled", "pending"),
      allowNull: false,
    },
    
  },
  { sequelize, tableName: "Subscriptions", timestamps: true, paranoid: true } 
);

// Relaciones
Subscription.belongsTo(User, { foreignKey: "userId", as: "user"});
User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions"});

Subscription.belongsTo(Plan, { foreignKey: "planId", as: "plan"});
Plan.hasMany(Subscription, { foreignKey: "planId", as: "subscriptions"});

export default Subscription;
