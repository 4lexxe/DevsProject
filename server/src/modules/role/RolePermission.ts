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
        model: 'Roles',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Permissions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'RolePermissions',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'permissionId']
      }
    ]
  }
);

export default RolePermission;