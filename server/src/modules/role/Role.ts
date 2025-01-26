import { Model, DataTypes, BelongsToMany } from 'sequelize';
import sequelize from '../../infrastructure/database/db';
import Permission from './Permission';
import RolePermission from './RolePermission';

// Interfaces para TypeScript
export interface IRoleAttributes {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoleInstance
  extends Model<IRoleAttributes>,
    IRoleAttributes {
  Permissions?: Permission[];
  addPermission: (permission: Permission) => Promise<void>;
  removePermission: (permission: Permission) => Promise<void>;
  getPermissions: () => Promise<Permission[]>;
}

class Role extends Model<IRoleAttributes> implements IRoleInstance {
  // Propiedad estática con todos los permisos
  static initialRoles = [
    { 
      name: 'user', 
      description: 'Usuario normal del sistema',
      permissions: [
        'read:courses',
        'read:course_details',
        'enroll:courses',
        'access:course_content',
        'manage:own_profile',
        'read:own_progress'
      ]
    },
    { 
      name: 'admin', 
      description: 'Administrador del sistema',
      permissions: [
        'read:users',
        'write:users',
        'delete:users',
        'manage:roles',
        'manage:courses',
        'manage:categories',
        'manage:course_content',
        'manage:enrollments',
        'moderate:content',
        'read:all_progress'
      ]
    },
    { 
      name: 'superadmin', 
      description: 'Super administrador con acceso completo',
      permissions: [
        'read:users',
        'write:users',
        'delete:users',
        'manage:roles',
        'manage:permissions',
        'manage:system_settings',
        'manage:all_users',
        'view:analytics',
        'manage:backups',
        'impersonate:users',
        'audit:logs',
        'manage:courses',
        'manage:categories',
        'manage:course_content',
        'read:all_progress'
      ]
    }
  ];

  declare id: number;
  declare name: string;
  declare description: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare Permissions: Permission[];

  // Declaración de tipos para TypeScript
  declare static associations: {
    Permissions: BelongsToMany<Role, Permission>;
  };

  declare addPermission: (permission: Permission) => Promise<void>;
  declare removePermission: (permission: Permission) => Promise<void>;
  declare getPermissions: () => Promise<Permission[]>;
  declare setPermissions: (permissions: Permission[]) => Promise<void>;
}

// Inicialización del modelo
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 50]
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 255]
      },
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true
  }
);

export default Role;