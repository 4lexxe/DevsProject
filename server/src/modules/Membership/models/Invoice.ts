import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Membership from "./Membership";

class Invoice extends Model {
  public id!: number;
  public membershipId!: number;
  public issueDate!: Date;
  public dueDate!: Date;
  public totalAmount!: number;
  public status!: "unpaid" | "paid" | "overdue";
}

Invoice.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    membershipId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Memberships", key: "id" },
    },
    issueDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("unpaid", "paid", "overdue"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Invoices",
    timestamps: false,
  }
);

// Relación: Invoice pertenece a una Membership
Invoice.belongsTo(Membership, { foreignKey: "membershipId" });
Membership.hasMany(Invoice, { foreignKey: "membershipId" });

export default Invoice;
