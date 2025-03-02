/**
 * @fileoverview Sistema de Gestión de Roles
 * 
 * Este módulo implementa el sistema de roles de la aplicación, permitiendo
 * definir diferentes niveles de acceso para los usuarios mediante
 * la asignación de permisos específicos a cada rol.
 *
 * La arquitectura está diseñada para ofrecer máxima flexibilidad,
 * permitiendo crear jerarquías de permisos y roles personalizados.
 * 
 * @module Role
 * @requires sequelize
 * @requires Permission
 */

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../infrastructure/database/db';
import Permission from '../Permission/Permission';
import RolePermission from './RolePermission';

/**
 * Interfaz que define los atributos básicos de un rol.
 * 
 * @interface IRoleAttributes
 * @property {number} [id] - Identificador único del rol (opcional para creación)
 * @property {string} name - Nombre único del rol
 * @property {string} description - Descripción detallada del propósito del rol
 * @property {string[]|number[]} [permissions] - Lista de permisos por nombre o ID
 * @property {Date} [createdAt] - Fecha de creación (gestionada por Sequelize)
 * @property {Date} [updatedAt] - Fecha de última modificación (gestionada por Sequelize)
 */
export interface IRoleAttributes {
  id?: number;
  name: string;
  description: string;
  permissions?: string[] | number[]; // Puede ser nombres o IDs de permisos
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interfaz extendida que incluye los métodos de relación con permisos.
 * 
 * @interface IRoleInstance
 * @extends {Model<IRoleAttributes>}
 * @extends {IRoleAttributes}
 * @property {Permission[]} [Permissions] - Array de objetos Permission asociados
 * @property {Date} createdAt - Fecha de creación (solo lectura)
 * @property {Date} updatedAt - Fecha de última modificación (solo lectura)
 */
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

/**
 * Modelo principal para la gestión de roles en el sistema.
 * 
 * Cada rol puede tener múltiples permisos asignados mediante
 * una relación muchos a muchos implementada con la tabla intermedia 
 * RolePermission.
 * 
 * @class Role
 * @extends {Model<IRoleAttributes, IRoleAttributes>}
 * @implements {IRoleAttributes}
 */
class Role extends Model<IRoleAttributes, IRoleAttributes> implements IRoleAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public Permissions?: Permission[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos de asociación para los permisos
  public setPermissions!: (permissions: Permission[]) => Promise<void>;
  public getPermissions!: () => Promise<Permission[]>;
  public addPermission!: (permission: Permission) => Promise<void>;
  public removePermission!: (permission: Permission) => Promise<void>;

  /**
   * Establece las asociaciones del modelo con otros modelos.
   * Se utiliza para configurar la relación muchos a muchos con Permission.
   * 
   * @static
   * @memberof Role
   */
  public static associate() {
    // Relación muchos a muchos con los permisos
    Role.belongsToMany(Permission, { 
      through: RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId'
    });
  }
}

/**
 * Interfaz para roles con IDs de permisos concretos,
 * utilizada principalmente para la conversión de permisos.
 * 
 * @interface IRoleWithPermissionIds
 * @property {string} name - Nombre del rol
 * @property {string} description - Descripción del rol
 * @property {number[]} permissions - Array de IDs de permisos
 */
export interface IRoleWithPermissionIds {
  name: string;
  description: string;
  permissions: number[];
}

/**
 * Definición de roles iniciales del sistema con sus permisos.
 * 
 * Cada rol tiene una lista de permisos asignados en base a su
 * nivel de acceso y responsabilidad en el sistema:
 * 
 * - Estudiante: Acceso básico a cursos y funcionalidades de aprendizaje
 * - Instructor: Gestión de cursos y contenido educativo
 * - Moderador: Control de contenido generado por usuarios
 * - Admin: Administración general del sistema
 * - Superadmin: Acceso total y sin restricciones
 * 
 * @constant {Array<{name: string, description: string, permissions: string[]}>}
 */
export const rolesIniciales = [
  { 
    name: 'student', 
    description: 'Estudiante del sistema',
    permissions: Permission.studentPermissions.map(p => p.name)
  },
  { 
    name: 'instructor', 
    description: 'Instructor de cursos',
    permissions: [
      ...Permission.studentPermissions.map(p => p.name),
      ...Permission.instructorPermissions.map(p => p.name)
    ]
  },
  { 
    name: 'moderator', 
    description: 'Moderador de la comunidad',
    permissions: [
      ...Permission.studentPermissions.map(p => p.name),
      ...Permission.instructorPermissions.map(p => p.name),
      ...Permission.moderatorPermissions.map(p => p.name)
    ]
  },
  { 
    name: 'admin', 
    description: 'Administrador del sistema',
    permissions: [
      ...Permission.studentPermissions.map(p => p.name),
      ...Permission.instructorPermissions.map(p => p.name),
      ...Permission.moderatorPermissions.map(p => p.name),
      ...Permission.adminPermissions.map(p => p.name)
    ]
  },
  { 
    name: 'superadmin', 
    description: 'Super administrador con acceso total',
    permissions: [
      ...Permission.studentPermissions.map(p => p.name),
      ...Permission.instructorPermissions.map(p => p.name),
      ...Permission.moderatorPermissions.map(p => p.name),
      ...Permission.adminPermissions.map(p => p.name),
      ...Permission.superAdminPermissions.map(p => p.name)
    ]
  }
];

// Inicialización del modelo con Sequelize
Role.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del rol'
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    comment: 'Nombre único del rol en el sistema'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Descripción detallada del propósito y alcance del rol'
  },
  // Campo virtual para obtener los permisos asociados
  permissions: {
    type: DataTypes.VIRTUAL,
    comment: 'Lista virtual de IDs de permisos asociados al rol',
    get() {
      return this.Permissions?.map((p: Permission) => p.id) ?? [];
    }
  }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'Roles',
  comment: 'Almacena los diferentes roles del sistema y sus características'
});

// Definición de relaciones entre modelos
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

/**
 * Convierte los nombres de permisos en IDs numéricos para procesamiento en BD.
 * 
 * Esta función es útil cuando se necesita convertir los nombres legibles
 * de los permisos a sus identificadores numéricos correspondientes en la base
 * de datos, por ejemplo, al crear nuevos roles o actualizar los existentes.
 * 
 * @async
 * @function convertPermissionNamesToIds
 * @returns {Promise<IRoleWithPermissionIds[]>} Array de roles con permisos convertidos a IDs
 * @example
 * // Obtener roles con IDs de permisos para inserción en BD
 * const rolesConIds = await convertPermissionNamesToIds();
 * await RoleModel.bulkCreate(rolesConIds);
 */
export const convertPermissionNamesToIds = async (): Promise<IRoleWithPermissionIds[]> => {
  const permissionIds = await Permission.getPermissionIds();
  return rolesIniciales.map(role => ({
    ...role,
    permissions: role.permissions?.map(name => permissionIds[name as string]) || []
  }));
};

export default Role;