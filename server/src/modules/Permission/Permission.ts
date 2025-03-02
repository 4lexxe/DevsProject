import { DataTypes, Model } from 'sequelize';
import sequelize from '../../infrastructure/database/db';

class Permission extends Model {
  static studentPermissions = [
    { name: 'read:courses', description: 'Puede ver la lista de cursos disponibles' },
    { name: 'read:course_details', description: 'Puede ver detalles específicos de un curso' },
    { name: 'enroll:courses', description: 'Puede inscribirse en cursos disponibles' },
    { name: 'access:course_content', description: 'Puede acceder al contenido de cursos inscritos' },
    { name: 'manage:own_profile', description: 'Puede editar su propio perfil de usuario' },
    { name: 'read:own_progress', description: 'Puede ver su progreso en cursos' },
    { name: 'delete:own_account', description: 'Puede eliminar su propia cuenta' },
    { name: 'comment:resources', description: 'Puede comentar en recursos' },
    { name: 'star:resources', description: 'Puede dar estrellas a recursos' },
    { name: 'unstar:resources', description: 'Puede quitar estrellas de recursos' },
    { name: 'report:resources', description: 'Puede reportar recursos inapropiados' },
    { name: 'read:learning_paths', description: 'Puede ver la lista de rutas de aprendizaje' },
    { name: 'comment:learning_paths', description: 'Puede comentar en rutas de aprendizaje' },
    { name: 'star:learning_paths', description: 'Puede dar estrellas a rutas de aprendizaje' },
    { name: 'unstar:learning_paths', description: 'Puede quitar estrellas de rutas de aprendizaje' },
    { name: 'report:learning_paths', description: 'Puede reportar rutas de aprendizaje' },
    { name: 'create:resources', description: 'Puede crear nuevos recursos' },
    { name: 'edit:resources', description: 'Puede editar recursos' },
    { name: 'delete:resources', description: 'Puede eliminar recursos' },
    { name: 'publish:resources', description: 'Puede publicar recursos' }
  ];

  static instructorPermissions = [
    { name: 'create:courses', description: 'Puede crear nuevos cursos' },
    { name: 'edit:courses', description: 'Puede editar cursos' },
    { name: 'delete:courses', description: 'Puede eliminar cursos' },
    { name: 'publish:courses', description: 'Puede publicar cursos' },
    { name: 'archive:courses', description: 'Puede archivar cursos' },
    { name: 'restore:courses', description: 'Puede restaurar cursos archivados' },
    { name: 'assign:instructors', description: 'Puede asignar instructores a cursos' },
    { name: 'manage:course_reviews', description: 'Puede gestionar reseñas de cursos' },
    { name: 'archive:resources', description: 'Puede archivar recursos' },
    { name: 'restore:resources', description: 'Puede restaurar recursos archivados' },
    { name: 'create:learning_paths', description: 'Puede crear nuevas rutas de aprendizaje' },
    { name: 'edit:learning_paths', description: 'Puede editar rutas de aprendizaje' },
    { name: 'delete:learning_paths', description: 'Puede eliminar rutas de aprendizaje' },
    { name: 'publish:learning_paths', description: 'Puede publicar rutas de aprendizaje' },
    { name: 'archive:learning_paths', description: 'Puede archivar rutas de aprendizaje' },
    { name: 'restore:learning_paths', description: 'Puede restaurar rutas de aprendizaje archivadas' },
    { name: 'instructor:manage_own_courses', description: 'Puede gestionar sus propios cursos' },
    { name: 'instructor:view_students', description: 'Puede ver estudiantes inscritos en sus cursos' },
  ];

  static moderatorPermissions = [
    { name: 'moderate:content', description: 'Puede aprobar/rechazar contenido generado por usuarios' },
    { name: 'delete:content', description: 'Puede eliminar contenido generado por usuarios' },
    { name: 'view:reports', description: 'Puede ver reportes de usuarios o contenido' },
    { name: 'resolve:reports', description: 'Puede gestionar reportes y tomar acciones' },
    { name: 'ban:users', description: 'Puede banear usuarios por mal comportamiento' },
    { name: 'mute:users', description: 'Puede silenciar usuarios temporalmente' },
  ];

  static adminPermissions = [
    { name: 'admin:manage_all', description: 'Puede gestionar todo en el sistema' },
    { name: 'admin:view_sensitive_data', description: 'Puede ver datos sensibles de los usuarios' },
    { name: 'manage:roles', description: 'Puede gestionar roles' },
    { name: 'manage:permissions', description: 'Puede gestionar permisos' },
    { name: 'delete:roles', description: 'Puede eliminar roles' },
    { name: 'delete:permissions', description: 'Puede eliminar permisos' },
    { name: 'change:passwords', description: 'Puede cambiar contraseñas de usuarios' },
    { name: 'report:users', description: 'Puede reportar cuentas de usuarios' },
    { name: 'block:users', description: 'Puede bloquear cuentas de usuarios' },
    { name: 'unblock:users', description: 'Puede desbloquear cuentas de usuarios' },
    { name: 'suspend:users', description: 'Puede suspender temporalmente cuentas de usuarios' },
    { name: 'activate:users', description: 'Puede reactivar cuentas de usuarios suspendidos' },
    { name: 'manage:system_settings', description: 'Puede configurar ajustes generales del sistema' },
    { name: 'manage:backups', description: 'Puede realizar copias de seguridad y restauraciones' },
    { name: 'manage:all_users', description: 'Puede gestionar todas las cuentas de usuario' },
    { name: 'reset:passwords', description: 'Puede restablecer contraseñas de usuarios' },
    { name: 'view:user_activity', description: 'Puede ver la actividad de los usuarios' },
    { name: 'view:analytics', description: 'Puede acceder a análisis y reportes del sistema' },
    { name: 'audit:logs', description: 'Puede ver registros de auditoría del sistema' },
    { name: 'impersonate:users', description: 'Puede suplantar cualquier cuenta de usuario' },
    { name: 'manage:groups', description: 'Puede gestionar grupos de discusión o comunidades' },
    { name: 'manage:community_posts', description: 'Puede gestionar publicaciones de la comunidad' },
    { name: 'pin:community_posts', description: 'Puede fijar publicaciones en la comunidad' },
    { name: 'manage:sales', description: 'Puede gestionar todas las ventas' },
    { name: 'refund:sales', description: 'Puede emitir reembolsos de ventas' },
    { name: 'view:sales', description: 'Puede ver las ventas realizadas' },
    { name: 'manage:discounts', description: 'Puede gestionar códigos de descuento' },
    { name: 'manage:payment_methods', description: 'Puede gestionar métodos de pago' },
    { name: 'read:resources', description: 'Puede ver recursos disponibles' },
    { name: 'manage:resources', description: 'Puede gestionar recursos' },
    { name: 'manage:comments', description: 'Puede gestionar comentarios' },
    { name: 'manage:stars', description: 'Puede gestionar estrellas' },
    { name: 'view:stars', description: 'Puede ver estrellas en recursos' },
    { name: 'view:comments', description: 'Puede ver comentarios en recursos' },
    { name: 'download:resources', description: 'Puede descargar recursos' },
    { name: 'report:resources', description: 'Puede reportar recursos inapropiados' },
  ];

  static superAdminPermissions = [
    { name: 'superadmin:full_access', description: 'Tiene acceso completo y sin restricciones' },
    { name: 'superadmin:delete_system', description: 'Puede eliminar todo el sistema (uso extremo)' }
  ];

  static permisos = [
    ...Permission.studentPermissions,
    ...Permission.instructorPermissions,
    ...Permission.moderatorPermissions,
    ...Permission.adminPermissions,
    ...Permission.superAdminPermissions,
  ];

  declare id: number;
  declare name: string;
  declare description: string;

  // Método estático para obtener los IDs de los permisos
  static async getPermissionIds() {
    const permissions = await Permission.findAll();
    return permissions.reduce((acc, permission) => {
      acc[permission.name] = permission.id;
      return acc;
    }, {} as Record<string, number>);
  }
  
  // Método para encontrar permisos por sus nombres
  static async findByNames(names: string[]): Promise<Permission[]> {
    return await Permission.findAll({
      where: {
        name: names
      }
    });
  }
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
          const permisos = Permission.permisos.map(p => ({
            ...p,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          const uniquePermisos = permisos.filter((permiso, index, self) =>
            index === self.findIndex((p) => (
              p.name === permiso.name
            ))
          );
          for (const permiso of uniquePermisos) {
            await Permission.upsert(permiso);
          }
        }
      },
    },
  }
);

export default Permission;