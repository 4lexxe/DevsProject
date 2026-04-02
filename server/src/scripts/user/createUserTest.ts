import sequelize from '../../infrastructure/database/db';
import User from '../../modules/user/User';
import Role from '../../modules/rbac/models/Role';
import bcrypt from 'bcrypt';

/**
 * Script para crear usuarios de prueba para cada rol existente en el sistema
 * Ejecutar con: npx ts-node src/scripts/user/createUserTest.ts
 * 
👤 Usuarios que creará:
test.instructor@example.com - Rol: instructor
test.user_moderator@example.com - Rol: user_moderator
test.manager@example.com - Rol: manager
test.admin@example.com - Rol: admin
Contraseña para todos: Test123!
 */

async function createTestUsers() {
  try {
    console.log('🚀 Iniciando creación de usuarios de prueba...\n');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida\n');

    // Obtener todos los roles
    const roles = await Role.findAll({
      order: [['id', 'ASC']]
    });

    if (roles.length === 0) {
      console.log('❌ No se encontraron roles en la base de datos');
      console.log('💡 Ejecuta primero: npm run sync\n');
      process.exit(1);
    }

    console.log(`📋 Roles encontrados: ${roles.length}\n`);

    // Contraseña por defecto para todos los usuarios de prueba
    const defaultPassword = 'Test123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const createdUsers = [];
    const existingUsers = [];
    const errors = [];

    // Crear un usuario de prueba para cada rol
    for (const role of roles) {
      const testEmail = `test.${role.name}@example.com`;
      const testUsername = `test_${role.name}`;

      try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
          where: { email: testEmail }
        });

        if (existingUser) {
          existingUsers.push({
            role: role.name,
            email: testEmail,
            username: testUsername
          });
          continue;
        }

        // Crear el usuario
        const newUser = await User.create({
          name: `Test ${role.name.charAt(0).toUpperCase() + role.name.slice(1)}`,
          surname: 'User',
          email: testEmail,
          password: hashedPassword,
          phone: '+1234567890',
          roleId: role.id,
          username: testUsername,
          displayName: `Test ${role.name}`,
          authProvider: 'local',
          registrationIp: '127.0.0.1',
          lastLoginIp: '127.0.0.1',
          isActiveSession: false,
          registrationGeo: {
            city: 'Test City',
            region: 'Test Region',
            country: 'Test Country',
            loc: [0, 0],
            timezone: 'UTC',
            isProxy: false
          },
          lastLoginGeo: null,
          suspiciousActivities: []
        });

        createdUsers.push({
          id: newUser.id,
          role: role.name,
          email: testEmail,
          username: testUsername
        });

      } catch (error: any) {
        errors.push({
          role: role.name,
          error: error.message
        });
      }
    }

    // Mostrar resultados
    console.log('═══════════════════════════════════════════════════════\n');

    if (createdUsers.length > 0) {
      console.log(`✅ Usuarios creados exitosamente: ${createdUsers.length}\n`);
      createdUsers.forEach(user => {
        console.log(`  👤 Rol: ${user.role.toUpperCase()}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Username: ${user.username}`);
        console.log(`     Password: ${defaultPassword}`);
        console.log(`     ID: ${user.id}\n`);
      });
    }

    if (existingUsers.length > 0) {
      console.log(`⚠️  Usuarios ya existentes: ${existingUsers.length}\n`);
      existingUsers.forEach(user => {
        console.log(`  👤 Rol: ${user.role.toUpperCase()}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Username: ${user.username}\n`);
      });
    }

    if (errors.length > 0) {
      console.log(`❌ Errores durante la creación: ${errors.length}\n`);
      errors.forEach(err => {
        console.log(`  👤 Rol: ${err.role.toUpperCase()}`);
        console.log(`     Error: ${err.error}\n`);
      });
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📝 CREDENCIALES DE ACCESO:');
    console.log('   Password para todos: Test123!');
    console.log('   Formato email: test.[rol]@example.com');
    console.log('   Formato username: test_[rol]');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('✅ Script completado exitosamente\n');

  } catch (error: any) {
    console.error('❌ Error general en el script:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
createTestUsers();
