import { DataTypes, Model } from 'sequelize';
import sequelize from '../../infrastructure/database/db';

class Permission extends Model {
  static permisos = [
    // Módulo: Usuarios
    { name: 'read:users', description: 'Puede ver usuarios' },
    { name: 'write:users', description: 'Puede crear/editar usuarios' },
    { name: 'delete:users', description: 'Puede eliminar usuarios' },
    { name: 'manage:roles', description: 'Puede gestionar roles' },
    { name: 'manage:permissions', description: 'Puede gestionar permisos' },
    { name: 'delete:roles', description: 'Puede eliminar roles' },
    { name: 'delete:permissions', description: 'Puede eliminar permisos' },

    // Módulo: Cursos
    { name: 'read:courses', description: 'Puede ver la lista de cursos disponibles' },
    { name: 'read:course_details', description: 'Puede ver detalles específicos de un curso' },
    { name: 'enroll:courses', description: 'Puede inscribirse en cursos disponibles' },
    { name: 'access:course_content', description: 'Puede acceder al contenido de cursos inscritos' },
    { name: 'delete:courses', description: 'Puede eliminar cursos' },
    { name: 'publish:courses', description: 'Puede publicar cursos' },
    { name: 'archive:courses', description: 'Puede archivar cursos' },

    // Módulo: Perfil
    { name: 'manage:own_profile', description: 'Puede editar su propio perfil de usuario' },
    { name: 'read:own_progress', description: 'Puede ver su progreso en cursos' },

    // Módulo: Gestión de Cursos
    { name: 'manage:courses', description: 'Puede crear, editar o eliminar cursos' },
    { name: 'manage:categories', description: 'Puede gestionar categorías y etiquetas de cursos' },
    { name: 'manage:course_content', description: 'Puede gestionar módulos y lecciones de cursos' },
    { name: 'manage:enrollments', description: 'Puede inscribir/desinscribir usuarios de cursos' },

    // Módulo: Moderación
    { name: 'moderate:content', description: 'Puede aprobar/rechazar contenido generado por usuarios' },
    { name: 'delete:content', description: 'Puede eliminar contenido generado por usuarios' },

    // Módulo: Progreso
    { name: 'read:all_progress', description: 'Puede ver progreso de todos los usuarios' },

    // Módulo: Configuración del Sistema
    { name: 'manage:system_settings', description: 'Puede configurar ajustes generales del sistema' },
    { name: 'manage:backups', description: 'Puede realizar copias de seguridad y restauraciones' },

    // Módulo: Gestión de Usuarios
    { name: 'manage:all_users', description: 'Puede gestionar todas las cuentas de usuario' },

    // Módulo: Análisis y Auditoría
    { name: 'view:analytics', description: 'Puede acceder a análisis y reportes del sistema' },
    { name: 'audit:logs', description: 'Puede ver registros de auditoría del sistema' },

    // Módulo: Suplantación
    { name: 'impersonate:users', description: 'Puede suplantar cualquier cuenta de usuario' },

    // Módulo: Comunidad
    { name: 'manage:groups', description: 'Puede gestionar grupos de discusión o comunidades' },
    { name: 'manage:community_posts', description: 'Puede gestionar publicaciones de la comunidad' },

    // Módulo: Ventas
    { name: 'manage:sales', description: 'Puede gestionar todas las ventas' },
    { name: 'refund:sales', description: 'Puede emitir reembolsos de ventas' },
    { name: 'view:sales', description: 'Puede ver las ventas realizadas' },

    // Módulo: Recursos de Usuario
    { name: 'upload:resources', description: 'Puede subir recursos propios' },
    { name: 'manage:own_resources', description: 'Puede gestionar sus propios recursos' },
    { name: 'moderate:all_resources', description: 'Puede gestionar recursos de cualquier usuario (solo admins)' },

    // Módulo: Comentarios
    { name: 'comment:resources', description: 'Puede comentar en recursos' },
    { name: 'manage:own_comments', description: 'Puede gestionar sus propios comentarios' },
    { name: 'moderate:all_comments', description: 'Puede gestionar comentarios de cualquier usuario (solo admins)' },

    // Módulo: Calificaciones
    { name: 'rate:resources', description: 'Puede calificar recursos' },
    { name: 'manage:own_ratings', description: 'Puede gestionar sus propias calificaciones' },
    { name: 'moderate:all_ratings', description: 'Puede gestionar calificaciones de cualquier usuario (solo admins)' },
  ];

  declare id: number;
  declare name: string;
  declare description: string;
}

Permission.init(
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
        len: [3, 50],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 255],
      },
    },
  },
  {
    sequelize,
    modelName: 'Permission',
    tableName: 'Permissions',
    hooks: {
      afterSync: async (options) => {
        if (options.force) {
          await Permission.bulkCreate(Permission.permisos, {
            updateOnDuplicate: ['description'],
          });
        }
      },
    },
  }
);

export default Permission;