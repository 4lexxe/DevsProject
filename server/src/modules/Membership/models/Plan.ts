import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../infrastructure/database/db';

// Definimos el modelo de Sequelize
class Plan extends Model {
  public id!: bigint;
  public name!: string;
  public description!: string;
  public price!: number;
  public duration!: string;
  public features!: string[];
  public isActive!: boolean;
  public supportLevel!: 'Básico' | 'Estándar' | 'Premium';
  public installments?: number;
  public installmentPrice?: number;

  // Campos automáticos de Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializamos el modelo
Plan.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100), // Longitud limitada para nombres
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true, // El nombre no puede estar vacío
        len: [3, 100], // Longitud entre 3 y 100 caracteres
      },
    },
    description: {
      type: DataTypes.STRING, // Longitud limitada para descripciones
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Precio con 2 decimales
      allowNull: false,
      validate: {
        isDecimal: true, // Asegura que sea un número decimal
        min: 0, // El precio no puede ser negativo
      },
    },
    duration: {
      type: DataTypes.STRING(50), // Longitud limitada para la duración
      allowNull: false,
      validate: {
        is: /^(\d+\s+((segundo|minuto|hora|día|semana|mes|año)s?|(segundos|minutos|horas|días|semanas|meses|años)))+$/i,
      },
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array de características
      allowNull: false,
      validate: {
        notEmpty: true, // El array no puede estar vacío
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto
    },
    supportLevel: {
      type: DataTypes.ENUM('Básico', 'Estándar', 'Premium'),
      allowNull: false,
      defaultValue: 'Básico', // Valor por defecto
    },
    installments: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Valor por defecto
      allowNull: true,
      validate: {
        min: 1, // El número de cuotas no puede ser menor que 1
      },
    },
    installmentPrice: {
      type: DataTypes.DECIMAL(10, 2), // Precio por cuota con 2 decimales
      allowNull: true,
      validate: {
        isDecimal: true, // Asegura que sea un número decimal
        min: 0, // El precio por cuota no puede ser negativo
      },
    },
  },
  {
    sequelize,
    tableName: 'Plans',
    timestamps: true,
    paranoid: true, // Habilita el borrado lógico (soft delete)
    hooks: {
      // Hook para calcular el precio por cuota
      beforeCreate: (plan: Plan) => {
        if (plan.installments === 1) {
          plan.installmentPrice = plan.price;
        } else if (plan.installments && plan.installments > 1) {
          plan.installmentPrice = parseFloat((plan.price / plan.installments).toFixed(2));
        }
      },
      beforeUpdate: (plan: Plan) => {
        if (plan.installments === 1) {
          plan.installmentPrice = plan.price;
        } else if (plan.installments && plan.installments > 1) {
          plan.installmentPrice = parseFloat((plan.price / plan.installments).toFixed(2));
        }
      },
    },
  }
);

export default Plan;