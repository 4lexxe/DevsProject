import sequelize from '../src/infrastructure/database/db';
import Role, { rolesIniciales } from '../src/modules/role/Role';
import Permission from '../src/modules/role/Permission';
import RolePermission from '../src/modules/role/RolePermission';
import User from '../src/modules/user/User';

async function updateUserPermissions() {
  try {
    console.log('🔄 Actualizando permisos de usuarios...');

    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // 1. Actualizar permisos en la tabla Permission
    for (const permiso of Permission.permisos) {
      await Permission.findOrCreate({
        where: { name: permiso.name },
        defaults: permiso
      });
    }
    console.log('✅ Permisos actualizados en la base de datos');

    // 2. Actualizar roles y sus permisos
    for (const roleData of rolesIniciales) {
      console.log(`📝 Actualizando rol: ${roleData.name}`);
      
      // Buscar el rol
      const role = await Role.findOne({ where: { name: roleData.name } });
      if (!role) {
        console.log(`⚠️ Rol ${roleData.name} no encontrado, creándolo...`);
        const newRole = await Role.create({
          name: roleData.name,
          description: roleData.description
        });
        
        // Asignar permisos al nuevo rol
        const permissions = await Permission.findAll({
          where: { name: roleData.permissions }
        });
        
        const rolePermissions = permissions.map(permission => ({
          roleId: newRole.id,
          permissionId: permission.id
        }));
        
        await RolePermission.bulkCreate(rolePermissions);
        continue;
      }

      // Actualizar descripción del rol
      await role.update({ description: roleData.description });

      // Obtener los permisos que debe tener este rol
      const permissions = await Permission.findAll({
        where: { name: roleData.permissions }
      });

      console.log(`🔐 Asignando ${permissions.length} permisos al rol ${roleData.name}`);
      
      // Limpiar permisos existentes
      await RolePermission.destroy({
        where: { roleId: role.id }
      });

      // Crear las nuevas asociaciones
      const rolePermissions = permissions.map(permission => ({
        roleId: role.id,
        permissionId: permission.id
      }));

      if (rolePermissions.length > 0) {
        await RolePermission.bulkCreate(rolePermissions);
      }

      console.log(`✅ Permisos actualizados para el rol ${roleData.name}`);
    }

    // 3. Verificar usuarios existentes
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'Role',
        include: [{
          model: Permission,
          as: 'Permissions'
        }]
      }]
    });

    console.log(`📊 Usuarios encontrados: ${users.length}`);
    
    for (const user of users) {
      const roleName = user.Role?.name || 'sin rol';
      const permissionCount = user.Role?.Permissions?.length || 0;
      console.log(`👤 Usuario ${user.name} (${user.email}) - Rol: ${roleName} - Permisos: ${permissionCount}`);
    }

    console.log('🎉 Actualización de permisos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error actualizando permisos:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar el script
updateUserPermissions().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
