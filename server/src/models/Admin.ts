import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import User from './User';

class Admin extends Model {
  public id!: number;
  public admin_since!: Date;
  public permissions!: string[];
  public isSuperAdmin!: boolean;
  public admin_notes?: string;
  public userId!: number;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_since: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.JSONB,  // Usar JSONB en lugar de ARRAY al trabajar con objetos o arrays JSON
      allowNull: false,
    },    
    isSuperAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    admin_notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Admin',
  }
);

// Definir las asociaciones
User.hasOne(Admin, { foreignKey: 'userId', as: 'admin' });
Admin.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Admin;