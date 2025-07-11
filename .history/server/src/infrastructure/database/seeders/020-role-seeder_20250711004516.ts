import { QueryInterface } from 'sequelize';
import Role, { rolesIniciales } from '../../../modules/role/Role';
import Permission from '../../../modules/role/Permission';
import RolePermission from '../../../modules/role/RolePermission';

export default {
  async up(queryInterface: QueryInterface) {
    console.log('🔄 Ejecutando seeder de roles y permisos...');

    try {
      // Crear o actualizar roles
      for (const roleData of rolesIniciales) {
        console.log(`📝 Procesando rol: ${roleData.name}`);
        
        // Buscar o crear el rol
        let [role] = await Role.findOrCreate({
          where: { name: roleData.name },
          defaults: {
            name: roleData.name,
            description: roleData.description,
          }
        });

        // Actualizar descripción si el rol ya existía
        if (role.description !== roleData.description) {
          await role.update({ description: roleData.description });
          console.log(`📝 Descripción actualizada para rol: ${roleData.name}`);
        }

        // Obtener todos los permisos que debe tener este rol
        const permissions = await Permission.findAll({
          where: {
            name: roleData.permissions
          }
        });

        console.log(`🔐 Asignando ${permissions.length} permisos al rol ${roleData.name}`);
        
        // Limpiar permisos existentes y asignar los nuevos
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
          console.log(`✅ Permisos asignados correctamente al rol ${roleData.name}`);
        }
      }

      console.log('✅ Seeder de roles completado exitosamente');
    } catch (error) {
      console.error('❌ Error en seeder de roles:', error);
      throw error;
    }
  },

  async down(queryInterface: QueryInterface) {
    console.log('🔄 Revirtiendo seeder de roles...');
    
    try {
      // Eliminar todas las asociaciones de roles y permisos
      await queryInterface.bulkDelete('RolePermissions', {}, {});
      
      // Eliminar roles (excepto superadmin para evitar problemas)
      await queryInterface.bulkDelete('Roles', {
        name: ['student', 'instructor', 'moderator', 'admin']
      }, {});
      
      console.log('✅ Seeder de roles revertido exitosamente');
    } catch (error) {
      console.error('❌ Error al revertir seeder de roles:', error);
      throw error;
    }
  }
};
