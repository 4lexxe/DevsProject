import { Model, DataTypes } from 'sequelize';
import sequelize from '../../infrastructure/database/db';
import Permission from './Permission';
import RolePermission from './RolePermission';

// Definimos la interfaz IRoleAttributes para los atributos de un rol
export interface IRoleAttributes {
  id?: number;
  name: string;
  description: string;
  permissions?: number[]; // Ahora usamos IDs de permisos
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

// Definimos los roles iniciales con sus permisos (usando IDs)
export const rolesIniciales = [
  { 
    name: 'student', 
    description: 'Estudiante del sistema',
    permissions: [
      8,  // read:courses
      10, // enroll:courses
      11, // access:course_content
      16, // read:own_progress
      15, // manage:own_profile
      35, // read:resources
      36, // manage:resources
      37, // comment:resources
      38, // star:resources
      41, // view:stars
      42  // view:comments
    ]
  },
  { 
    name: 'instructor', 
    description: 'Instructor de cursos',
    permissions: [
      8,  // read:courses
      17, // manage:courses
      19, // manage:course_content
      15, // manage:own_profile
      10, // enroll:courses
      35, // read:resources
      36, // manage:resources
      37, // comment:resources
      38, // star:resources
      39, // manage:comments
      40, // manage:stars
      41, // view:stars
      42  // view:comments
    ]
  },
  { 
    name: 'moderator', 
    description: 'Moderador de la comunidad',
    permissions: [
      8,  // read:courses
      1,  // read:users
      21, // moderate:content
      18, // manage:categories
      19, // manage:course_content
      15, // manage:own_profile
      35, // read:resources
      36, // manage:resources
      37, // comment:resources
      38, // star:resources
      39, // manage:comments
      40, // manage:stars
      41, // view:stars
      42  // view:comments
    ]
  },
  { 
    name: 'admin', 
    description: 'Administrador del sistema',
    permissions: [
      8,  // read:courses
      17, // manage:courses
      26, // manage:all_users
      4,  // manage:roles
      5,  // manage:permissions
      27, // view:analytics
      28, // audit:logs
      24, // manage:system_settings
      18, // manage:categories
      19, // manage:course_content
      15, // manage:own_profile
      35, // read:resources
      36, // manage:resources
      37, // comment:resources
      38, // star:resources
      39, // manage:comments
      40, // manage:stars
      41, // view:stars
      42  // view:comments
    ]
  },
  { 
    name: 'superadmin', 
    description: 'Super administrador con acceso total',
    permissions: Array.from({ length: 42 }, (_, i) => i + 1) // Todos los IDs de permisos (1 a 42)
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
      return this.Permissions?.map((p: Permission) => p.id) ?? [];
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