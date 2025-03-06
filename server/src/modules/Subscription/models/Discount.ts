import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../infrastructure/database/db';
import Plan from './Plan'; // Importamos el modelo Plan

// Definimos el modelo de Sequelize
class Discount extends Model {
  public id!: number;
  public description?: string;
  public value!: number; // Porcentaje de descuento
  public startDate!: Date;
  public endDate!: Date;
  public isActive!: boolean;
  public planId!: number;
  public event!: string; // Evento o periodo especial (obligatorio)

  // Campos automáticos de Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializamos el modelo
Discount.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Descripción opcional
    },
    value: {
      type: DataTypes.INTEGER, // Porcentaje con 2 decimales (ej: 15.50%)
      allowNull: false,
      validate: {
        isDecimal: true, // Asegura que sea un número decimal
        min: 0, // El valor no puede ser negativo
        max: 100, // El valor no puede ser mayor a 100%
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
    planId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Plans', // Nombre de la tabla referenciada
        key: 'id',
      },
      onDelete: 'CASCADE', // Si se elimina el plan, se eliminan sus descuentos
      onUpdate: 'CASCADE', // Si se actualiza el plan, se actualizan sus descuentos
    },
    event: {
      type: DataTypes.STRING(100),
      allowNull: false, // El evento es obligatorio
      validate: {
        notEmpty: true, // El evento no puede estar vacío
      },
    },
  },
  {
    sequelize,
    tableName: 'Discounts',
    timestamps: true,
    paranoid: true, // Habilita el borrado lógico (soft delete)
    hooks: {
      // Hook para validar que endDate sea posterior a startDate
      beforeCreate: (discount: Discount) => {
        if (discount.endDate <= discount.startDate) {
          throw new Error('endDate debe ser posterior a startDate');
        }
      },
      beforeUpdate: (discount: Discount) => {
        if (discount.endDate <= discount.startDate) {
          throw new Error('endDate debe ser posterior a startDate');
        }
      },
    },
    indexes: [
      {
        fields: ['planId'], // Índice para mejorar búsquedas por planId
      },
      {
        fields: ['event'], // Índice para mejorar búsquedas por evento
      },
    ],
  }
);

// Definimos la relación con el modelo Plan
Discount.belongsTo(Plan, {
  foreignKey: 'planId', // Clave foránea en Discount
  as: 'plan', // Alias para la relación
});

export default Discount;