import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../infrastructure/database/db';
import Plan from './Plan'; // Import Plan model


class MPSubPlan extends Model {
    public id!: string;  // Aca se guarda el id generado en la api de mp
    public planId!: bigint; // Relacion con el modelo de Plan
    public reason!: string;
    public status!: string;
    public initPoint!: string;    
    public autoRecurring!: any;
    public data?: object; // Store the full JSON response
}

MPSubPlan.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        planId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "Plans",
                key: "id",
            }
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        initPoint: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        autoRecurring: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        data: {
            type: DataTypes.JSONB, // Store the complete response
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'MPSubPlan',
        tableName: 'MPSubPlans',
        timestamps: true,
    }
);

MPSubPlan.belongsTo(Plan, {
  foreignKey: 'planId',
  as: 'plan',
});

Plan.hasOne(MPSubPlan, {
  foreignKey: 'planId',
  as: 'mpSubPlan',
});

export default MPSubPlan;