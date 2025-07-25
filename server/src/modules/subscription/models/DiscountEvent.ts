import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../infrastructure/database/db';
import Plan from './Plan'; // Importamos el modelo Plan
import Course from '../../course/models/Course';

// Definimos el modelo de Sequelize
class DiscountEvent extends Model {
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
  
  // Método para chequear si un descuento está vigente
  public isCurrentlyValid(): boolean {
    const now = new Date();
    return this.isActive && 
           now >= this.startDate && 
           now <= this.endDate;
  }
}

// Inicializamos el modelo
DiscountEvent.init(
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
    tableName: 'DiscountEvents',
    timestamps: true,
    paranoid: true, // Habilita el borrado lógico (soft delete)
    hooks: {
      // Hook para validar que endDate sea posterior a startDate
      beforeCreate: (discount: DiscountEvent) => {
        if (discount.endDate <= discount.startDate) {
          throw new Error('endDate debe ser posterior a startDate');
        }
      },
      beforeUpdate: (discount: DiscountEvent) => {
        if (discount.endDate <= discount.startDate) {
          throw new Error('endDate debe ser posterior a startDate');
        }
        
        // Validar si el descuento está dentro de fechas válidas al activarlo
        if (discount.changed('isActive') && discount.isActive) {
          const now = new Date();
          if (now < discount.startDate || now > discount.endDate) {
            console.warn(`Advertencia: Activando un descuento fuera de su rango de fechas válido (ID: ${discount.id})`);
          }
        }
      },
      
      // Hook para actualizar automáticamente el estado del descuento basado en la fecha actual
      beforeFind: (options: any) => {
        const now = new Date();
        // Añadir automáticamente condiciones para verificar descuentos expirados
        // Este hook se activa en consultas de búsqueda
        // Note: No directamente actualiza registros, solo afecta las consultas
        return options;
      },
      
      afterUpdate: async (discount: DiscountEvent) => {
        // Log cuando el estado de activación cambia para debugging
        if (discount.changed('isActive')) {
          console.log(`Descuento ID ${discount.id} cambió estado isActive a: ${discount.isActive}`);
        }
      }
    },
  }
);

// Definimos la relación con el modelo Plan
DiscountEvent.belongsTo(Plan, {
  foreignKey: 'planId', // Clave foránea en DiscountEvent
  as: 'plan', // Alias para la relación
});

// Definimos la relación con el modelo Plan
Plan.hasOne(DiscountEvent, {
  foreignKey: 'planId', // Clave foránea en DiscountEvent
  as: 'discountEvent', // Alias para la relación
});

export default DiscountEvent;