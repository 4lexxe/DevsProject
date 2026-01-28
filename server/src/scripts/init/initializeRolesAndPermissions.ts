import dotenv from "dotenv";
import sequelize from "../../infrastructure/database/db";
import Role from "../../modules/rbac/models/Role";
import Permission from "../../modules/rbac/models/Permission";
import RolePermission from "../../modules/rbac/models/RolePermission";

dotenv.config();

// ============================================
// CONFIGURACIÓN: PERMISOS, ROLES Y RELACIONES
// ============================================

// 1. PERMISOS: Lista completa de permisos del sistema
const permissions = [
  // ═══════════════════════════════════════
  // MÓDULO: CURSOS
  // ═══════════════════════════════════════
  'courses:view',           // Ver listado de cursos públicos
  'courses:view_all',       // Ver todos los cursos (incluidos privados/ocultos)
  'courses:create',         // Crear nuevos cursos
  'courses:update',         // Actualizar cursos existentes
  'courses:delete',         // Eliminar cursos
  'courses:publish',        // Publicar/despublicar cursos
  'courses:enroll',         // Inscribirse en cursos
  
  // ═══════════════════════════════════════
  // MÓDULO: CONTENIDO DE CURSOS
  // ═══════════════════════════════════════
  'content:view',           // Ver contenido de cursos inscritos
  'content:create',         // Crear contenido (lecciones, materiales)
  'content:update',         // Actualizar contenido
  'content:delete',         // Eliminar contenido
  'content:publish',        // Publicar/despublicar contenido
  'content:moderate',       // Moderar contenido reportado
  
  // ═══════════════════════════════════════
  // MÓDULO: SECCIONES
  // ═══════════════════════════════════════
  'sections:create',        // Crear secciones en cursos
  'sections:update',        // Actualizar secciones
  'sections:delete',        // Eliminar secciones
  'sections:reorder',       // Reordenar secciones
  
  // ═══════════════════════════════════════
  // MÓDULO: INSCRIPCIONES (ENROLLMENTS)
  // ═══════════════════════════════════════
  'enrollments:view_own',   // Ver inscripciones propias
  'enrollments:view_all',   // Ver todas las inscripciones
  'enrollments:create',     // Inscribir usuarios manualmente
  'enrollments:update',     // Actualizar inscripciones
  'enrollments:delete',     // Cancelar inscripciones
  'enrollments:grant',      // Otorgar acceso directo a cursos
  
  // ═══════════════════════════════════════
  // MÓDULO: PROGRESO
  // ═══════════════════════════════════════
  'progress:view_own',      // Ver progreso propio
  'progress:view_all',      // Ver progreso de todos los estudiantes
  'progress:update_own',    // Marcar lecciones como completadas
  'progress:reset',         // Resetear progreso de estudiantes
  
  // ═══════════════════════════════════════
  // MÓDULO: USUARIOS
  // ═══════════════════════════════════════
  'users:view',             // Ver listado de usuarios
  'users:view_details',     // Ver detalles completos de usuarios
  'users:create',           // Crear nuevos usuarios
  'users:update',           // Actualizar usuarios
  'users:delete',           // Eliminar usuarios
  'users:impersonate',      // Suplantar identidad de usuarios
  'users:ban',              // Banear/desbanear usuarios
  
  // ═══════════════════════════════════════
  // MÓDULO: PERFILES
  // ═══════════════════════════════════════
  'profile:view_own',       // Ver perfil propio
  'profile:update_own',     // Actualizar perfil propio
  'profile:view_others',    // Ver perfiles de otros usuarios
  
  // ═══════════════════════════════════════
  // MÓDULO: ROLES Y PERMISOS
  // ═══════════════════════════════════════
  'roles:view',             // Ver roles
  'roles:create',           // Crear roles
  'roles:update',           // Actualizar roles
  'roles:delete',           // Eliminar roles
  'roles:assign',           // Asignar roles a usuarios
  'permissions:view',       // Ver permisos
  'permissions:manage',     // Gestionar permisos de roles
  
  // ═══════════════════════════════════════
  // MÓDULO: CATEGORÍAS
  // ═══════════════════════════════════════
  'categories:view',        // Ver categorías
  'categories:create',      // Crear categorías
  'categories:update',      // Actualizar categorías
  'categories:delete',      // Eliminar categorías
  
  // ═══════════════════════════════════════
  // MÓDULO: RECURSOS
  // ═══════════════════════════════════════
  'resources:view',         // Ver recursos públicos
  'resources:view_all',     // Ver todos los recursos
  'resources:create',       // Subir recursos propios
  'resources:update_own',   // Actualizar recursos propios
  'resources:update_all',   // Actualizar cualquier recurso
  'resources:delete_own',   // Eliminar recursos propios
  'resources:delete_all',   // Eliminar cualquier recurso
  'resources:moderate',     // Moderar recursos reportados
  
  // ═══════════════════════════════════════
  // MÓDULO: COMENTARIOS
  // ═══════════════════════════════════════
  'comments:view',          // Ver comentarios
  'comments:create',        // Crear comentarios
  'comments:update_own',    // Actualizar comentarios propios
  'comments:update_all',    // Actualizar cualquier comentario
  'comments:delete_own',    // Eliminar comentarios propios
  'comments:delete_all',    // Eliminar cualquier comentario
  'comments:moderate',      // Moderar comentarios reportados
  
  // ═══════════════════════════════════════
  // MÓDULO: CALIFICACIONES
  // ═══════════════════════════════════════
  'ratings:view',           // Ver calificaciones
  'ratings:create',         // Crear calificaciones
  'ratings:update_own',     // Actualizar calificaciones propias
  'ratings:update_all',     // Actualizar cualquier calificación
  'ratings:delete_own',     // Eliminar calificaciones propias
  'ratings:delete_all',     // Eliminar cualquier calificación
  'ratings:moderate',       // Moderar calificaciones
  
  // ═══════════════════════════════════════
  // MÓDULO: VENTAS Y PAGOS
  // ═══════════════════════════════════════
  'sales:view',             // Ver ventas
  'sales:view_all',         // Ver todas las ventas del sistema
  'sales:create',           // Registrar ventas manualmente
  'sales:update',           // Actualizar información de ventas
  'sales:refund',           // Procesar reembolsos
  'sales:reports',          // Ver reportes de ventas
  
  // ═══════════════════════════════════════
  // MÓDULO: DESCUENTOS Y PROMOCIONES
  // ═══════════════════════════════════════
  'discounts:view',         // Ver descuentos
  'discounts:create',       // Crear descuentos
  'discounts:update',       // Actualizar descuentos
  'discounts:delete',       // Eliminar descuentos
  
  // ═══════════════════════════════════════
  // MÓDULO: ANALÍTICAS
  // ═══════════════════════════════════════
  'analytics:view',         // Ver analíticas básicas
  'analytics:view_advanced',// Ver analíticas avanzadas
  'analytics:export',       // Exportar reportes
  
  // ═══════════════════════════════════════
  // MÓDULO: COMUNIDAD
  // ═══════════════════════════════════════
  'community:view',         // Ver publicaciones de la comunidad
  'community:create',       // Crear publicaciones
  'community:update_own',   // Actualizar publicaciones propias
  'community:update_all',   // Actualizar cualquier publicación
  'community:delete_own',   // Eliminar publicaciones propias
  'community:delete_all',   // Eliminar cualquier publicación
  'community:moderate',     // Moderar contenido de la comunidad
  
  // ═══════════════════════════════════════
  // MÓDULO: GRUPOS
  // ═══════════════════════════════════════
  'groups:view',            // Ver grupos
  'groups:create',          // Crear grupos
  'groups:update',          // Actualizar grupos
  'groups:delete',          // Eliminar grupos
  'groups:manage_members',  // Gestionar miembros de grupos
  
  // ═══════════════════════════════════════
  // MÓDULO: SISTEMA
  // ═══════════════════════════════════════
  'system:settings',        // Gestionar configuración del sistema
  'system:backups',         // Gestionar copias de seguridad
  'system:logs',            // Ver y auditar logs del sistema
  'system:maintenance',     // Poner el sistema en mantenimiento
];

// 2. ROLES: Definición de roles del sistema
const roles = [
  { name: 'student', description: 'Estudiante del sistema' },
  { name: 'instructor', description: 'Instructor de cursos' },
  { name: 'moderator', description: 'Moderador de la comunidad' },
  { name: 'admin', description: 'Administrador del sistema' },
  { name: 'superadmin', description: 'Super administrador con acceso completo' },
];

// 3. RELACIONES: Permisos asignados a cada rol
const rolePermissions: Record<string, string[]> = {
  // ═══════════════════════════════════════
  // ESTUDIANTE (student)
  // Permisos básicos para consumir contenido
  // ═══════════════════════════════════════
  student: [
    // Cursos
    'courses:view',
    'courses:enroll',
    
    // Progreso y perfil
    'progress:view_own',
    'progress:update_own',
    'profile:view_own',
    'profile:update_own',
    'profile:view_others',
    
    // Inscripciones
    'enrollments:view_own',
    
    // Recursos
    'resources:view',
    'resources:create',
    'resources:update_own',
    'resources:delete_own',
    
    // Interacción social
    'comments:view',
    'comments:create',
    'comments:update_own',
    'comments:delete_own',
    'ratings:view',
    'ratings:create',
    'ratings:update_own',
    'ratings:delete_own',
    
    // Comunidad
    'community:view',
    'community:create',
    'community:update_own',
    'community:delete_own',
  ],

  // ═══════════════════════════════════════
  // INSTRUCTOR (instructor)
  // Estudiante + gestión de sus cursos
  // ═══════════════════════════════════════
  instructor: [
    // Hereda todos los permisos de estudiante
    'courses:view',
    'courses:enroll',
    'content:view',
    'progress:view_own',
    'progress:update_own',
    'profile:view_own',
    'profile:update_own',
    'profile:view_others',
    'enrollments:view_own',
    'resources:view',
    'resources:create',
    'resources:update_own',
    'resources:delete_own',
    'comments:view',
    'comments:create',
    'comments:update_own',
    'comments:delete_own',
    'ratings:view',
    'ratings:create',
    'ratings:update_own',
    'ratings:delete_own',
    'community:view',
    'community:create',
    'community:update_own',
    'community:delete_own',
    
    // Gestión de cursos propios
    'courses:create',
    'courses:update',
    'courses:publish',
    'courses:archive',
    'content:create',
    'content:update',
    'content:delete',
    'content:publish',
    'sections:create',
    'sections:update',
    'sections:delete',
    'sections:reorder',
    
    // Gestión de estudiantes en sus cursos
    'progress:view_all',
    'enrollments:view_all',
    'enrollments:grant',
    'users:view',
    
    // Categorías
    'categories:view',
    
    // Analíticas de sus cursos
    'analytics:view',
  ],

  // ═══════════════════════════════════════
  // MODERADOR (moderator)
  // Permisos de moderación de contenido
  // ═══════════════════════════════════════
  moderator: [
    // Permisos básicos
    'courses:view',
    'courses:view_all',
    'content:view',
    'profile:view_own',
    'profile:update_own',
    'profile:view_others',
    
    // Moderación de contenido
    'content:moderate',
    'content:delete',
    'resources:view_all',
    'resources:moderate',
    'resources:delete_all',
    'comments:view',
    'comments:update_all',
    'comments:delete_all',
    'comments:moderate',
    'ratings:view',
    'ratings:update_all',
    'ratings:delete_all',
    'ratings:moderate',
    
    // Moderación de comunidad
    'community:view',
    'community:update_all',
    'community:delete_all',
    'community:moderate',
    
    // Gestión de usuarios básica
    'users:view',
    'users:view_details',
    'users:ban',
    
    // Gestión de categorías
    'categories:view',
    'categories:create',
    'categories:update',
    
    // Grupos
    'groups:view',
    'groups:update',
    'groups:manage_members',
    
    // Progreso
    'progress:view_all',
    'enrollments:view_all',
  ],

  // ═══════════════════════════════════════
  // ADMINISTRADOR (admin)
  // Gestión completa excepto sistema crítico
  // ═══════════════════════════════════════
  admin: [
    // Cursos - Gestión completa
    'courses:view',
    'courses:view_all',
    'courses:create',
    'courses:update',
    'courses:delete',
    'courses:publish',
    'courses:archive',
    'courses:enroll',
    'content:view',
    'content:create',
    'content:update',
    'content:delete',
    'content:publish',
    'content:moderate',
    'sections:create',
    'sections:update',
    'sections:delete',
    'sections:reorder',
    
    // Usuarios - Gestión completa
    'users:view',
    'users:view_details',
    'users:create',
    'users:update',
    'users:delete',
    'users:ban',
    'profile:view_own',
    'profile:update_own',
    'profile:view_others',
    
    // Roles - Solo vista y asignación
    'roles:view',
    'roles:assign',
    'permissions:view',
    
    // Inscripciones
    'enrollments:view_own',
    'enrollments:view_all',
    'enrollments:create',
    'enrollments:update',
    'enrollments:delete',
    'enrollments:grant',
    
    // Progreso
    'progress:view_own',
    'progress:view_all',
    'progress:update_own',
    'progress:reset',
    
    // Categorías
    'categories:view',
    'categories:create',
    'categories:update',
    'categories:delete',
    
    // Recursos
    'resources:view',
    'resources:view_all',
    'resources:create',
    'resources:update_own',
    'resources:update_all',
    'resources:delete_own',
    'resources:delete_all',
    'resources:moderate',
    
    // Comentarios y calificaciones
    'comments:view',
    'comments:create',
    'comments:update_own',
    'comments:update_all',
    'comments:delete_own',
    'comments:delete_all',
    'comments:moderate',
    'ratings:view',
    'ratings:create',
    'ratings:update_own',
    'ratings:update_all',
    'ratings:delete_own',
    'ratings:delete_all',
    'ratings:moderate',
    
    // Ventas
    'sales:view',
    'sales:view_all',
    'sales:create',
    'sales:update',
    'sales:refund',
    'sales:reports',
    
    // Descuentos
    'discounts:view',
    'discounts:create',
    'discounts:update',
    'discounts:delete',
    
    // Analíticas
    'analytics:view',
    'analytics:view_advanced',
    'analytics:export',
    
    // Comunidad
    'community:view',
    'community:create',
    'community:update_own',
    'community:update_all',
    'community:delete_own',
    'community:delete_all',
    'community:moderate',
    
    // Grupos
    'groups:view',
    'groups:create',
    'groups:update',
    'groups:delete',
    'groups:manage_members',
    
    // Sistema - Solo logs
    'system:logs',
  ],

  // ═══════════════════════════════════════
  // SUPER ADMINISTRADOR (superadmin)
  // Acceso total al sistema
  // ═══════════════════════════════════════
  superadmin: [
    // Cursos - Acceso completo
    'courses:view',
    'courses:view_all',
    'courses:create',
    'courses:update',
    'courses:delete',
    'courses:publish',
    'courses:archive',
    'courses:enroll',
    'content:view',
    'content:create',
    'content:update',
    'content:delete',
    'content:publish',
    'content:moderate',
    'sections:create',
    'sections:update',
    'sections:delete',
    'sections:reorder',
    
    // Usuarios - Acceso completo
    'users:view',
    'users:view_details',
    'users:create',
    'users:update',
    'users:delete',
    'users:impersonate',
    'users:ban',
    'profile:view_own',
    'profile:update_own',
    'profile:view_others',
    
    // Roles y permisos - Gestión completa
    'roles:view',
    'roles:create',
    'roles:update',
    'roles:delete',
    'roles:assign',
    'permissions:view',
    'permissions:manage',
    
    // Inscripciones
    'enrollments:view_own',
    'enrollments:view_all',
    'enrollments:create',
    'enrollments:update',
    'enrollments:delete',
    'enrollments:grant',
    
    // Progreso
    'progress:view_own',
    'progress:view_all',
    'progress:update_own',
    'progress:reset',
    
    // Categorías
    'categories:view',
    'categories:create',
    'categories:update',
    'categories:delete',
    
    // Recursos
    'resources:view',
    'resources:view_all',
    'resources:create',
    'resources:update_own',
    'resources:update_all',
    'resources:delete_own',
    'resources:delete_all',
    'resources:moderate',
    
    // Comentarios y calificaciones
    'comments:view',
    'comments:create',
    'comments:update_own',
    'comments:update_all',
    'comments:delete_own',
    'comments:delete_all',
    'comments:moderate',
    'ratings:view',
    'ratings:create',
    'ratings:update_own',
    'ratings:update_all',
    'ratings:delete_own',
    'ratings:delete_all',
    'ratings:moderate',
    
    // Ventas
    'sales:view',
    'sales:view_all',
    'sales:create',
    'sales:update',
    'sales:refund',
    'sales:reports',
    
    // Descuentos
    'discounts:view',
    'discounts:create',
    'discounts:update',
    'discounts:delete',
    
    // Analíticas
    'analytics:view',
    'analytics:view_advanced',
    'analytics:export',
    
    // Comunidad
    'community:view',
    'community:create',
    'community:update_own',
    'community:update_all',
    'community:delete_own',
    'community:delete_all',
    'community:moderate',
    
    // Grupos
    'groups:view',
    'groups:create',
    'groups:update',
    'groups:delete',
    'groups:manage_members',
    
    // Sistema - Acceso completo
    'system:settings',
    'system:backups',
    'system:logs',
    'system:maintenance',
  ],
};

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

async function initializeRolesAndPermissions() {
  try {
    console.log("🚀 Iniciando inicialización de roles y permisos\n");
    await sequelize.authenticate();
    console.log("✅ Conexión establecida\n");

    // FASE 1: Insertar permisos
    console.log("📍 FASE 1: Insertando permisos");
    console.log("─".repeat(50));
    const permissionsData = permissions.map(name => ({
      name,
      description: generatePermissionDescription(name),
    }));
    await Permission.bulkCreate(permissionsData, { ignoreDuplicates: true });
    console.log(`✅ ${permissions.length} permisos insertados\n`);

    // FASE 2: Insertar roles
    console.log("📍 FASE 2: Insertando roles");
    console.log("─".repeat(50));
    await Role.bulkCreate(roles, { ignoreDuplicates: true });
    console.log(`✅ ${roles.length} roles insertados`);
    roles.forEach(role => console.log(`   • ${role.name}: ${role.description}`));
    console.log();

    // FASE 3: Crear relaciones
    console.log("📍 FASE 3: Creando relaciones roles-permisos");
    console.log("─".repeat(50));
    const relations = await buildRelations();
    await RolePermission.bulkCreate(relations, { ignoreDuplicates: true });
    console.log(`✅ ${relations.length} relaciones creadas\n`);


  } catch (error) {
    console.error("\n❌ Error:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

async function buildRelations() {
  const [allPermissions, allRoles] = await Promise.all([
    Permission.findAll(),
    Role.findAll()
  ]);

  const permissionMap = new Map(allPermissions.map(p => [p.name, p.id]));
  const roleMap = new Map(allRoles.map(r => [r.name, r.id]));

  const relations: Array<{ roleId: number; permissionId: number }> = [];

  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;

    for (const permissionName of permissionNames) {
      const permissionId = permissionMap.get(permissionName);
      if (permissionId) {
        relations.push({ roleId, permissionId });
      }
    }
  }

  return relations;
}

function generatePermissionDescription(permissionName: string): string {
  const [resource, action] = permissionName.split(':');
  
  const actions: Record<string, string> = {
    view: 'Ver', view_own: 'Ver propios', view_all: 'Ver todos', view_details: 'Ver detalles',
    view_others: 'Ver de otros', view_advanced: 'Ver avanzadas',
    create: 'Crear', update: 'Actualizar', update_own: 'Actualizar propios',
    update_all: 'Actualizar todos', delete: 'Eliminar', delete_own: 'Eliminar propios',
    delete_all: 'Eliminar todos', enroll: 'Inscribirse', publish: 'Publicar',
    archive: 'Archivar', moderate: 'Moderar', reorder: 'Reordenar',
    grant: 'Otorgar', reset: 'Resetear', impersonate: 'Suplantar',
    ban: 'Banear', assign: 'Asignar', manage: 'Gestionar',
    manage_members: 'Gestionar miembros', refund: 'Reembolsar',
    reports: 'Ver reportes', export: 'Exportar', settings: 'Configurar',
    backups: 'Gestionar copias de seguridad', logs: 'Ver registros',
    maintenance: 'Modo mantenimiento',
  };

  const resources: Record<string, string> = {
    courses: 'cursos', content: 'contenido', sections: 'secciones',
    enrollments: 'inscripciones', progress: 'progreso', users: 'usuarios',
    profile: 'perfil', roles: 'roles', permissions: 'permisos',
    categories: 'categorías', resources: 'recursos', comments: 'comentarios',
    ratings: 'calificaciones', sales: 'ventas', discounts: 'descuentos',
    analytics: 'analíticas', community: 'comunidad', groups: 'grupos',
    system: 'sistema',
  };

  return `${actions[action] || action} ${resources[resource] || resource}`;
}

// ============================================
// EJECUCIÓN
// ============================================

if (require.main === module) {
  initializeRolesAndPermissions()
    .then(() => {
      console.log("✅ Script finalizado\n");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error fatal:", error);
      process.exit(1);
    });
}

export default initializeRolesAndPermissions;

