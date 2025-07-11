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
      'read:courses', 'read:course_details', 'enroll:courses',
      'access:course_content', 'read:own_progress', 'manage:own_profile',
      
      // Permisos de recursos agregados
      'upload:resources', 'manage:own_resources', 
      'comment:resources', 'manage:own_comments', 
      'rate:resources', 'manage:own_ratings'
    ]
  },
  { 
    name: 'instructor', 
    description: 'Instructor de cursos',
    permissions: [
      'read:courses', 'read:course_details', 'enroll:courses',
      'access:course_content', 'read:own_progress', 'manage:own_profile',
      'manage:courses', 'manage:course_content', 'publish:courses',
      'read:all_progress', 'manage:enrollments',
      
      // Permisos de recursos agregados
      'upload:resources', 'manage:own_resources', 
      'comment:resources', 'manage:own_comments', 
      'rate:resources', 'manage:own_ratings'
    ]
  },
  { 
    name: 'moderator', 
    description: 'Moderador de la comunidad',
    permissions: [
      'read:courses', 'read:course_details', 'enroll:courses',
      'access:course_content', 'read:own_progress', 'manage:own_profile',
      'moderate:content', 'delete:content', 'read:users',
      'manage:categories', 'manage:course_content', 'manage:groups',
      'manage:community_posts', 'read:all_progress',
      
      // Permisos de recursos agregados (incluye moderación)
      'upload:resources', 'manage:own_resources', 'moderate:all_resources',
      'comment:resources', 'manage:own_comments', 'moderate:all_comments',
      'rate:resources', 'manage:own_ratings', 'moderate:all_ratings'
    ]
  },
  { 
    name: 'admin', 
    description: 'Administrador del sistema',
    permissions: [
      // Permisos de usuario básico
      'read:courses', 'read:course_details', 'enroll:courses',
      'access:course_content', 'read:own_progress', 'manage:own_profile',
      
      // Gestión de usuarios
      'read:users', 'write:users', 'delete:users', 'manage:all_users',
      
      // Gestión de roles y permisos
      'manage:roles', 'manage:permissions',
      
      // Gestión de cursos
      'manage:courses', 'delete:courses', 'publish:courses', 'archive:courses',
      'manage:categories', 'manage:course_content', 'manage:enrollments',
      
      // Moderación
      'moderate:content', 'delete:content',
      
      // Progreso y análisis
      'read:all_progress', 'view:analytics',
      
      // Ventas
      'manage:sales', 'view:sales', 'refund:sales',
      
      // Comunidad
      'manage:groups', 'manage:community_posts',
      
      // Sistema
      'manage:system_settings', 'audit:logs',
      
      // Permisos de recursos completos (incluye moderación)
      'upload:resources', 'manage:own_resources', 'moderate:all_resources',
      'comment:resources', 'manage:own_comments', 'moderate:all_comments',
      'rate:resources', 'manage:own_ratings', 'moderate:all_ratings'
    ]
  },
  { 
    name: 'superadmin', 
    description: 'Super administrador con acceso completo',
    permissions: [
      // Todos los permisos de usuario básico
      'read:courses', 'read:course_details', 'enroll:courses',
      'access:course_content', 'read:own_progress', 'manage:own_profile',
      
      // Gestión completa de usuarios
      'read:users', 'write:users', 'delete:users', 'manage:all_users',
      'impersonate:users',
      
      // Gestión completa de roles y permisos
      'manage:roles', 'manage:permissions', 'delete:roles', 'delete:permissions',
      
      // Gestión completa de cursos
      'manage:courses', 'delete:courses', 'publish:courses', 'archive:courses',
      'manage:categories', 'manage:course_content', 'manage:enrollments',
      
      // Moderación completa
      'moderate:content', 'delete:content',
      
      // Progreso y análisis completo
      'read:all_progress', 'view:analytics', 'audit:logs',
      
      // Ventas completas
      'manage:sales', 'view:sales', 'refund:sales',
      
      // Comunidad completa
      'manage:groups', 'manage:community_posts',
      
      // Sistema completo
      'manage:system_settings', 'manage:backups',
      
      // Permisos de recursos completos (incluye moderación)
      'upload:resources', 'manage:own_resources', 'moderate:all_resources',
      'comment:resources', 'manage:own_comments', 'moderate:all_comments',
      'rate:resources', 'manage:own_ratings', 'moderate:all_ratings'
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