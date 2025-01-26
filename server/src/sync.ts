import sequelize from './infrastructure/database/db';
import Permission from './modules/role/Permission';
import Role from './modules/role/Role';
import User from './modules/user/User';
import Admin from './modules/admin/Admin';
import { setupAssociations } from './modules/role/associations';

const colors = {
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

async function syncDb() {
  try {
    console.log(`${colors.cyan}🛠  Iniciando sincronización...${colors.reset}`);

    // 1. Configurar relaciones primero
    console.log(`${colors.cyan}🔗 Estableciendo relaciones...${colors.reset}`);
    setupAssociations();

    // 2. Sincronizar estructura de BD
    console.log(`${colors.cyan}🔨 Creando estructura...${colors.reset}`);
    await sequelize.sync({
      force: true,
      logging: (sql) => console.log(`${colors.cyan}⚡ ${sql}${colors.reset}`),
      hooks: true
    });

    // 3. Poblar datos iniciales
    console.log(`${colors.cyan}🌱 Sembrando datos base...${colors.reset}`);
    await seedCoreData();

    console.log(`${colors.green}✅ Sistema listo!${colors.reset}`);
    console.log(`${colors.cyan}📦 Tablas creadas:
      ├─ ${Permission.permisosIniciales.length} Permisos
      ├─ ${Role.initialRoles.length} Roles
      ├─ Usuarios
      └─ Administradores${colors.reset}`);

  } catch (error) {
    handleSyncError(error);
  }
}

async function seedCoreData() {
  // 1. Crear permisos
  await Permission.bulkCreate(Permission.permisosIniciales, {
    updateOnDuplicate: ['description']
  });

  // 2. Crear roles y asignar permisos
  const createdRoles = await Promise.all(
    Role.initialRoles.map(async (roleData) => {
      const role = await Role.create(roleData);
      const permissions = await Permission.findAll({
        where: { name: roleData.permissions }
      });
      for (const permission of permissions) {
          await role.addPermission(permission);
      }
      return role;
    })
  );

  // 3. Crear superadmin
  const superadmin = createdRoles.find(r => r.name === 'superadmin');
  if (!superadmin) throw new Error('Rol superadmin no existe');

  const [adminUser] = await User.upsert({
    email: 'admin@devsproject.com',
    name: 'Administrador Principal',
    password: 'Temporal123!',
    roleId: superadmin.id,
    registrationIp: '127.0.0.1',
    lastLoginIp: '127.0.0.1'
  });

  await Admin.upsert({
    userId: adminUser.id,
    name: adminUser.name,
    isSuperAdmin: true,
    permissions: ['*'],
    admin_since: new Date()
  });
}

function handleSyncError(error: unknown) {
  console.error(`\n${colors.red}⛔ Error durante la sincronización:${colors.reset}`);
  
  if (error instanceof Error) {
    console.error(`${colors.yellow}📄 ${error.message}${colors.reset}`);
    console.error(`${colors.red}🔍 Stack: ${error.stack}${colors.reset}`);
  } else {
    console.error(`${colors.red}⚠️  Error desconocido:`, error);
  }
  
  process.exit(1);
}

syncDb();