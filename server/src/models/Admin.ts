import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import User from './User';

class Admin extends Model {
  public id!: number;
  public name!: string;
  public admin_since!: Date;
  public permissions!: string[];
  public isSuperAdmin!: boolean;
  public admin_notes?: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Agregar un método para verificar permisos
  public hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_since: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.JSONB,
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
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
    timestamps: true,
  }
);

User.hasOne(Admin, { foreignKey: 'userId', as: 'admin' });
Admin.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Admin;