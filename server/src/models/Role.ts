import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Permission from './Permission';
import RolePermission from './RolePermission';

class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definimos los roles iniciales
const rolesIniciales = [
  { 
    name: 'user', 
    description: 'Usuario normal del sistema',
    permissions: ['read:users']
  },
  { 
    name: 'admin', 
    description: 'Administrador del sistema',
    permissions: ['read:users', 'write:users', 'delete:users', 'manage:roles']
  },
  { 
    name: 'superadmin', 
    description: 'Super administrador con acceso completo',
    permissions: ['read:users', 'write:users', 'delete:users', 'manage:roles', 'manage:permissions']
  }
];

Role.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Role',
  hooks: {
    async afterSync() {
      try {
        for (const roleData of rolesIniciales) {
          // Crear o encontrar el rol
          const [role] = await Role.findOrCreate({
            where: { name: roleData.name },
            defaults: { description: roleData.description },
          });

          // Buscar los permisos correspondientes
          const permissions = await Permission.findAll({
            where: { name: roleData.permissions }
          });

          // Crear las relaciones en la tabla intermedia
          if (permissions.length > 0) {
            const rolePermissions = permissions.map(permission => ({
              roleId: role.id,
              permissionId: permission.id
            }));

            // Usar bulkCreate con updateOnDuplicate para evitar errores de duplicados
            await RolePermission.bulkCreate(rolePermissions, {
              updateOnDuplicate: ['roleId', 'permissionId']
            });
          }
        }
      } catch (error) {
        console.error('Error en afterSync de Role:', error);
      }
    }
  }
});

// Definir relación many-to-many con Permission
Role.belongsToMany(Permission, { 
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId'
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId'
});

export default Role;