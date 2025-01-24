import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class RolePermission extends Model {
  public roleId!: number;
  public permissionId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RolePermission.init({
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Roles',
      key: 'id'
    }
  },
  permissionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Permissions',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'RolePermission',
  tableName: 'Roles_Permissions',
  indexes: [
    {
      unique: true,
      fields: ['roleId', 'permissionId']
    }
  ]
});

export default RolePermission;