import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
/* import Customer from "./Customer"; */
import Plan from "./Plan";
import User from "../../user/User";

class Subscription extends Model {
  public id!: bigint;
  public userId!: bigint;
  public planId!: bigint;
  public paymentId!: string;
  public startDate!: Date;
  public endDate!: Date;
  public status!: "active" | "inactive" | "cancelled";
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
    paymentId: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "inactive", "cancelled"),
      allowNull: false,
    },
    
  },
  { sequelize, tableName: "Subscriptions", timestamps: false }
);

// Relaciones
Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions" });

Subscription.belongsTo(Plan, { foreignKey: "planId", as: "plan" });
Plan.hasMany(Subscription, { foreignKey: "planId", as: "subscriptions" });
 
export default Subscription;
