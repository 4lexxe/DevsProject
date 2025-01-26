import { DataTypes, Model } from 'sequelize';
import sequelize from '../../infrastructure/database/db';

class Permission extends Model {
  static permisosIniciales = [
    { name: 'read:users', description: 'Puede ver usuarios' },
    { name: 'write:users', description: 'Puede crear/editar usuarios' },
    { name: 'delete:users', description: 'Puede eliminar usuarios' },
    { name: 'manage:roles', description: 'Puede gestionar roles' },
    { name: 'manage:permissions', description: 'Puede gestionar permisos' },
    { name: 'read:courses', description: 'Puede ver la lista de cursos disponibles' },
    { name: 'read:course_details', description: 'Puede ver detalles específicos de un curso' },
    { name: 'enroll:courses', description: 'Puede inscribirse en cursos disponibles' },
    { name: 'access:course_content', description: 'Puede acceder al contenido de cursos inscritos' },
    { name: 'manage:own_profile', description: 'Puede editar su propio perfil de usuario' },
    { name: 'read:own_progress', description: 'Puede ver su progreso en cursos' },
    { name: 'manage:courses', description: 'Puede crear, editar o eliminar cursos' },
    { name: 'manage:categories', description: 'Puede gestionar categorías y etiquetas de cursos' },
    { name: 'manage:course_content', description: 'Puede gestionar módulos y lecciones de cursos' },
    { name: 'manage:enrollments', description: 'Puede inscribir/desinscribir usuarios de cursos' },
    { name: 'moderate:content', description: 'Puede aprobar/rechazar contenido generado por usuarios' },
    { name: 'read:all_progress', description: 'Puede ver progreso de todos los usuarios' },
    { name: 'manage:system_settings', description: 'Puede configurar ajustes generales del sistema' },
    { name: 'manage:all_users', description: 'Puede gestionar todas las cuentas de usuario' },
    { name: 'view:analytics', description: 'Puede acceder a análisis y reportes del sistema' },
    { name: 'manage:backups', description: 'Puede realizar copias de seguridad y restauraciones' },
    { name: 'impersonate:users', description: 'Puede suplantar cualquier cuenta de usuario' },
    { name: 'audit:logs', description: 'Puede ver registros de auditoría del sistema' }
  ];

  declare id: number;
  declare name: string;
  declare description: string;
}

Permission.init({
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
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 255]
    }
  }
}, {
  sequelize,
  modelName: 'Permission',
  tableName: 'permissions',
  hooks: {
    afterSync: async (options) => {
      if (options.force) {
        await Permission.bulkCreate(Permission.permisosIniciales, {
          updateOnDuplicate: ['description']
        });
      }
    }
  }
});

export default Permission;