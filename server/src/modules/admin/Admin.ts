import { Model, DataTypes } from 'sequelize';
import sequelize from '../../infrastructure/database/db';
import User from '../user/User';

class Admin extends Model {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare isSuperAdmin: boolean;
  declare permissions: string[];
  declare admin_since: Date;
  declare admin_notes?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare adminUser?: User;

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
Admin.belongsTo(User, { foreignKey: 'userId', as: 'adminUser' });

export default Admin;