import { Model, DataTypes } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import MPSubPlan from "./MPSubPlan"; // Import MPSubPlan model

class Plan extends Model {
  public id!: bigint;
  public name!: string;
  public description!: string;
  public totalPrice!: number;  // Precio total de todo el plan

  public durationType!: string; // dias o meses 
  public duration!: number; // Duracion total del ciclo de de pago 

  public features!: string[];
  public isActive!: boolean;
  public accessLevel!: "Básico" | "Estándar" | "Premium";

  public installments!: number;   // Cantidad de cuotas en las que se divide el plan
  public installmentPrice?: number;  // Precio de cada cuota

  public saveInMp!: boolean; // Indica si se guarda en el plan de subscripcion en la api de mercadopago

  public mpSubPlan?: MPSubPlan; // Relacion con el modelo de MPSubPlan

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
      },
    },
    
    durationType: {
      type: DataTypes.ENUM("días", "meses"),
      allowNull: false,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    accessLevel: {
      type: DataTypes.ENUM("Básico", "Estándar", "Premium"),
      allowNull: false,
      defaultValue: "Básico",
    },
    installments: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    installmentPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    saveInMp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "Plans",
    timestamps: true,
    paranoid: true, // Habilita el borrado lógico (soft delete)
    hooks: {
      // Hook para calcular el precio por cuota
      beforeCreate: (plan: Plan) => {
        if (plan.installments === 1) {
          plan.installmentPrice = plan.totalPrice;
        } else if (plan.installments && plan.installments > 1) {
          plan.installmentPrice = parseFloat(
            (plan.totalPrice / plan.installments).toFixed(2)
          );
        }
      },
      beforeUpdate: (plan: Plan) => {
        if (plan.installments === 1) {
          plan.installmentPrice = plan.totalPrice;
        } else if (plan.installments && plan.installments > 1) {
          plan.installmentPrice = parseFloat(
            (plan.totalPrice / plan.installments).toFixed(2)
          );
        }
      },
    },
  }
);

export default Plan;