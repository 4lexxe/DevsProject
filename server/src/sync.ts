import sequelize from './infrastructure/database/db';

import Role from './modules/role/Role';
import { rolesIniciales } from './modules/role/Role';
import Permission from './modules/role/Permission';
// Importaciones de modelos
import Role, { rolesIniciales } from './modules/role/Role';
import Permission from './modules/Permission/Permission';
import RolePermission from './modules/role/RolePermission';
import User from './modules/user/User';
import Admin from './modules/admin/Admin';
import SectionHeader from './modules/headerSection/HeaderSection';
import Recourse from './modules/resource/Resource';
import Rating from './modules/resource/rating/Rating';
import Comment from './modules/resource/comment/Comment';
import RoadMap from './modules/roadmap/RoadMap';

/* Modelos relacionados con el area de cursos */
import Category from './modules/category/Category';
import CareerType from './modules/careerType/CareerType';
import Course from './modules/course/Course';
import { CourseCategory } from './modules/course/Course';
import Section from './modules/section/Section';
import Content from './modules/content/Content';

// sync.ts
async function syncDatabase() {
  try {
    await sequelize.authenticate();

    // Orden CORREGIDO
    await Permission.sync({ force: true });
    await Role.sync({ force: true });
    await RolePermission.sync({ force: true }); // ¡Primero debe existir esta tabla!

    // Poblar datos DESPUÉS de crear todas las tablas
    // 2. Insertar datos de permisos y roles
    console.log(`${green}2. Poblando datos de permisos y roles...${reset}`);
    await seedInitialData();

    await User.sync({ force: true });

    await Admin.sync({ force: true });

    await SectionHeader.sync({ force: true });

    await Recourse.sync({ force: true });

    console.log(`${green}5. Sincronizando tablas de cursos...${reset}`);
    await Category.sync({ force: true });
    await CareerType.sync({ force: true })
    await Course.sync({ force: true });
    await CourseCategory.sync({ force: true });
    await Section.sync({ force: true });

    await Content.sync({ force: true });

    // Verificar que todos los roles se hayan creado
    const roles = await Role.findAll({ 
      include: [{ model: Permission, as: 'Permissions' }]
    });
    console.log(`\n${green}✓ Roles creados (${roles.length}/${rolesIniciales.length})${reset}`);
    roles.forEach(role => {
      console.log(`  - ${role.name}: ${role.Permissions?.length || 0} permisos`);
    });

    console.log(`\n${bold}${green}¡Sincronización completada con éxito!${reset}`);
  } catch (error) {
    console.error('\n❌ Error durante la sincronización:', error);
  } finally {
    await sequelize.close();
  }
}

// Función para poblar datos iniciales
async function seedInitialData() {
  try {
    // 1. Asegurar que los permisos existan
    console.log(`${green}→ Insertando permisos...${reset}`);
    await Permission.bulkCreate(
      Permission.permisos.map(p => ({
        name: p.name,
        description: p.description
      })),
      { ignoreDuplicates: true }
    );
    
    const permisos = await Permission.findAll();
    console.log(`${green}✓ ${permisos.length} permisos disponibles en la base de datos${reset}`);

    // 2. Crear roles y asignar permisos
    console.log(`${green}→ Creando roles y asignando permisos...${reset}`);
    
    for (const roleData of rolesIniciales) {
      console.log(`\n${cyan}Procesando rol: ${roleData.name}${reset}`);
      
      // Crear o encontrar el rol
      const [role, created] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: { 
          name: roleData.name, 
          description: roleData.description 
        },
      });
      
      console.log(`${green}✓ Rol ${created ? 'creado' : 'encontrado'}: ${role.name}${reset}`);

      // Buscar permisos por nombre (no por ID)
      const permissionNames = roleData.permissions as string[];
      console.log(`Buscando ${permissionNames.length} permisos por nombre...`);
      
      const permissions = await Permission.findAll({
        where: { name: permissionNames }
      });
      
      console.log(`${green}✓ Encontrados ${permissions.length}/${permissionNames.length} permisos${reset}`);

      // Mostrar permisos faltantes (si los hay)
      if (permissions.length < permissionNames.length) {
        const encontrados = permissions.map(p => p.name);
        const faltantes = permissionNames.filter(name => !encontrados.includes(name));
        console.log('⚠️ Permisos no encontrados:', faltantes);
      }

      // Asociar permisos al rol
      if (permissions.length > 0) {
        await role.setPermissions(permissions);
        console.log(`${green}✓ ${permissions.length} permisos asignados al rol ${role.name}${reset}`);
      }
    }
  }
}

// Ejecutar la sincronización
syncDatabase();
