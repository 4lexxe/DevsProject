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
  'course:view',
  'course:create',
  'course:update',
  'course:delete',

  // ═══════════════════════════════════════
  // MÓDULO: SECCIONES
  // ═══════════════════════════════════════
  'section:view',
  'section:create',
  'section:update',
  'section:delete',

  // ═══════════════════════════════════════
  // MÓDULO: CONTENIDO
  // ═══════════════════════════════════════
  'content:view',
  'content:create',
  'content:update',
  'content:delete',

  // ═══════════════════════════════════════
  // MÓDULO: ARCHIVOS DE CONTENIDO
  // ═══════════════════════════════════════
  'content_file:view',
  'content_file:create',
  'content_file:update',
  'content_file:delete',

  // ═══════════════════════════════════════
  // MÓDULO: TIPO DE CARRERA
  // ═══════════════════════════════════════
  'career_type:view',
  'career_type:create',
  'career_type:update',
  'career_type:delete',

  // ═══════════════════════════════════════
  // MÓDULO: CATEGORÍAS
  // ═══════════════════════════════════════
  'category:view',
  'category:create',
  'category:update',
  'category:delete',

  // ═══════════════════════════════════════
  // MÓDULO: HEADER SECTION
  // ═══════════════════════════════════════
  'header_section:view',
  'header_section:create',
  'header_section:update',
  'header_section:delete',

  // ═══════════════════════════════════════
  // MÓDULO: DESCUENTOS DE CURSOS
  // ═══════════════════════════════════════
  'course_discount:view',
  'course_discount:create',
  'course_discount:update',
  'course_discount:delete',

  // ═══════════════════════════════════════
  // MÓDULO: ACCESO A CURSOS
  // ═══════════════════════════════════════
  'course_access:view',
  'course_access:grant',
  'course_access:revoke',
  'course_access:history',

  // ═══════════════════════════════════════
  // MÓDULO: ÓRDENES
  // ═══════════════════════════════════════
  'order:view',
  'order:create',
  'order:update',
  'order:delete',

  // ═══════════════════════════════════════
  // MÓDULO: USUARIOS
  // ═══════════════════════════════════════
  'user:view',
  'user:create',
  'user:update',
  'user:delete',

  // ═══════════════════════════════════════
  // MÓDULO: ROLES
  // ═══════════════════════════════════════
  'role:view',
  'role:create',
  'role:update',
  'role:delete',
  'role:assign',

  // ═══════════════════════════════════════
  // MÓDULO: PERMISOS
  // ═══════════════════════════════════════
  'permission:view',
  'permission:create',
  'permission:update',
  'permission:delete',

  // ═══════════════════════════════════════
  // MÓDULO: ADMINISTRADORES
  // ═══════════════════════════════════════
  'admin:view',
  'admin:create',
  'admin:update',
  'admin:delete',
];

// 2. ROLES: Definición de roles del sistema
const roles = [
  { name: 'user', description: 'Usuario registrado estándar sin permisos administrativos' },
  { name: 'instructor', description: 'Instructor con permisos de gestión de cursos' },
  { name: 'user_moderator', description: 'Moderador de usuarios con permisos RBAC' },
  { name: 'manager', description: 'Gestor con permisos de compras y promociones' },
  { name: 'admin', description: 'Administrador con acceso completo al sistema' },
];

// 3. RELACIONES: Permisos asignados a cada rol
const rolePermissions: Record<string, string[]> = {
  // ═══════════════════════════════════════
  // USER (Usuario estándar)
  // Sin permisos administrativos
  // ═══════════════════════════════════════
  user: [],

  // ═══════════════════════════════════════
  // INSTRUCTOR
  // Permisos completos del área de cursos
  // ═══════════════════════════════════════
  instructor: [
    'course:view',
    'course:create',
    'course:update',
    'course:delete',
    'section:view',
    'section:create',
    'section:update',
    'section:delete',
    'content:view',
    'content:create',
    'content:update',
    'content:delete',
    'content_file:view',
    'content_file:create',
    'content_file:update',
    'content_file:delete',
    'career_type:view',
    'career_type:create',
    'career_type:update',
    'career_type:delete',
    'category:view',
    'category:create',
    'category:update',
    'category:delete',
  ],

  // ═══════════════════════════════════════
  // USER_MODERATOR
  // Permisos completos de RBAC
  // ═══════════════════════════════════════
  user_moderator: [
    'user:view',
    'user:create',
    'user:update',
    'user:delete',
    'role:view',
    'role:create',
    'role:update',
    'role:delete',
    'role:assign',
    'permission:view',
    'permission:create',
    'permission:update',
    'permission:delete',
  ],

  // ═══════════════════════════════════════
  // MANAGER
  // Permisos del área Purchase + Header Section
  // ═══════════════════════════════════════
  manager: [
    'header_section:view',
    'header_section:create',
    'header_section:update',
    'header_section:delete',
    'course_discount:view',
    'course_discount:create',
    'course_discount:update',
    'course_discount:delete',
    'course_access:view',
    'course_access:grant',
    'course_access:revoke',
    'course_access:history',
    'order:view',
    'order:create',
    'order:update',
    'order:delete',
  ],

  // ═══════════════════════════════════════
  // ADMIN
  // Todos los permisos del sistema
  // ═══════════════════════════════════════
  admin: [
    // Cursos
    'course:view',
    'course:create',
    'course:update',
    'course:delete',
    'section:view',
    'section:create',
    'section:update',
    'section:delete',
    'content:view',
    'content:create',
    'content:update',
    'content:delete',
    'content_file:view',
    'content_file:create',
    'content_file:update',
    'content_file:delete',
    'career_type:view',
    'career_type:create',
    'career_type:update',
    'career_type:delete',
    'category:view',
    'category:create',
    'category:update',
    'category:delete',
    // Header Section
    'header_section:view',
    'header_section:create',
    'header_section:update',
    'header_section:delete',
    // Purchase
    'course_discount:view',
    'course_discount:create',
    'course_discount:update',
    'course_discount:delete',
    'course_access:view',
    'course_access:grant',
    'course_access:revoke',
    'course_access:history',
    'order:view',
    'order:create',
    'order:update',
    'order:delete',
    // RBAC
    'user:view',
    'user:create',
    'user:update',
    'user:delete',
    'role:view',
    'role:create',
    'role:update',
    'role:delete',
    'role:assign',
    'permission:view',
    'permission:create',
    'permission:update',
    'permission:delete',
    // Administradores
    'admin:view',
    'admin:create',
    'admin:update',
    'admin:delete',
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
    view: 'Ver',
    create: 'Crear',
    update: 'Actualizar',
    delete: 'Eliminar',
    grant: 'Otorgar',
    revoke: 'Revocar',
    history: 'Ver historial',
    assign: 'Asignar',
  };

  const resources: Record<string, string> = {
    course: 'cursos',
    section: 'secciones',
    content: 'contenido',
    content_file: 'archivos de contenido',
    career_type: 'tipos de carrera',
    category: 'categorías',
    header_section: 'secciones de header',
    course_discount: 'descuentos de cursos',
    course_access: 'acceso a cursos',
    order: 'órdenes',
    user: 'usuarios',
    role: 'roles',
    permission: 'permisos',
    admin: 'administradores',
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

