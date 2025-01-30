import { Model, DataTypes } from 'sequelize';
import sequelize from '../../infrastructure/database/db';
import Permission from './Permission';
import RolePermission from './RolePermission';

// Definimos la interfaz IRoleAttributes para los atributos de un rol
export interface IRoleAttributes {
  id?: number;
  name: string;
  description: string;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Definimos la interfaz IRoleInstance para incluir las propiedades y métodos del modelo
export interface IRoleInstance extends Model<IRoleAttributes>, IRoleAttributes {
  Permissions?: Permission[];  // Relación con permisos
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // Métodos de asociación para los permisos
  setPermissions: (permissions: Permission[]) => Promise<void>;
  getPermissions: () => Promise<Permission[]>;
  addPermission: (permission: Permission) => Promise<void>;
  removePermission: (permission: Permission) => Promise<void>;
}

class Role extends Model<IRoleAttributes, IRoleAttributes> implements IRoleAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public Permissions?: Permission[];  // Relación con permisos
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos de asociación para los permisos
  public setPermissions!: (permissions: Permission[]) => Promise<void>;
  public getPermissions!: () => Promise<Permission[]>;
  public addPermission!: (permission: Permission) => Promise<void>;
  public removePermission!: (permission: Permission) => Promise<void>;

  public static associate() {
    // Relación muchos a muchos con los permisos
    Role.belongsToMany(Permission, { 
      through: RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId'
    });
  }
}

// Definimos los roles iniciales con sus permisos
export const rolesIniciales = [
  { 
    name: 'student', 
    description: 'Estudiante del sistema',
    permissions: [
      'read:courses', 'enroll:courses',
      'access:course_content', 'read:own_progress',
    ]
  },
  { 
    name: 'instructor', 
    description: 'Instructor de cursos',
    permissions: [
      'manage:courses', 'manage:course_content', 'read:courses',
      'enroll:courses', 'manage:own_profile',
    ]
  },
  { 
    name: 'moderator', 
    description: 'Moderador de la comunidad',
    permissions: [
      'moderate:content', 'read:users', 'read:courses',
      'manage:categories', 'manage:course_content',
    ]
  },
  { 
    name: 'admin', 
    description: 'Administrador del sistema',
    permissions: [
      'manage:all_users', 'manage:roles', 'manage:permissions',
      'manage:courses', 'manage:categories', 'manage:course_content',
      'view:analytics', 'audit:logs', 'manage:system_settings',
    ]
  },
  { 
    name: 'superadmin', 
    description: 'Super administrador con acceso completo',
    permissions: [
      'manage:all_users', 'manage:roles', 'manage:permissions',
      'manage:courses', 'manage:categories', 'manage:course_content',
      'view:analytics', 'audit:logs', 'manage:system_settings', 'manage:backups',
      'impersonate:users', 'manage:system_settings',
    ]
  }
];

// Inicialización del modelo
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
  // Campos virtuales para mostrar los permisos
  permissions: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.Permissions?.map((p: Permission) => p.name) ?? [];
    }
  }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'Roles'
});

// Definir las relaciones muchos a muchos entre roles y permisos
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