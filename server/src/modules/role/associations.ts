import { Association, BelongsToMany, HasMany, HasOne } from 'sequelize';
import Role from './Role';
import Permission from './Permission';
import User from '../user/User';
import Admin from '../admin/Admin';
import RolePermission from './RolePermission';

export const setupAssociations = () => {
  // Relación Rol-Permiso (N-M)
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions'
  });

  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles'
  });

  // Relación Usuario-Rol (1-N)
  User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
    onDelete: 'RESTRICT'
  });

  Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users'
  });

  // Relación Usuario-Admin (1-1)
  User.hasOne(Admin, {
    foreignKey: 'userId',
    as: 'adminProfile',
    onDelete: 'CASCADE'
  });

  Admin.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });
};