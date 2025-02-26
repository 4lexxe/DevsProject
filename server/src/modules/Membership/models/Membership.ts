import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
/* import Customer from "./Customer"; */
import Plan from "./Plan";

class Membership extends Model {
  public id!: number;
  public customerId!: number;
  public membershipType!: string;
  public startDate!: Date;
  public endDate!: Date;
  public status!: "active" | "inactive" | "cancelled";
  public planId!: number;
}

Membership.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    /* customerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "customers", key: "id" },
    }, */
    membershipType: { type: DataTypes.TEXT, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "inactive", "cancelled"),
      allowNull: false,
    },
    planId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Plans", key: "id" },
    },
  },
  { sequelize, tableName: "Memberships", timestamps: false }
);

// Relaciones
/* Membership.belongsTo(Customer, { foreignKey: "customerId" });
Customer.hasMany(Membership, { foreignKey: "customerId" }); */

Membership.belongsTo(Plan, { foreignKey: "planId" });
Plan.hasMany(Membership, { foreignKey: "planId" });

export default Membership;
