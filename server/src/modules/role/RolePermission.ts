import { Model, DataTypes } from 'sequelize';
import sequelize from '../../infrastructure/database/db';

class RolePermission extends Model {
  declare roleId: number;
  declare permissionId: number;
}

RolePermission.init(
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'permissions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permissions',
    timestamps: false
  }
);

// Quitar TODAS las relaciones de este archivo

export default RolePermission;