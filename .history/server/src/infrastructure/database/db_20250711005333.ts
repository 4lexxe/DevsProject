import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Role, { rolesIniciales } from '../modules/role/Role';
import Permission from '../modules/role/Permission';
import RolePermission from '../modules/role/RolePermission';
import User from '../modules/user/User';

// Cargar variables de entorno
dotenv.config();

// Verificar que las variables estén cargadas correctamente
console.log('Dialect:', process.env.DB_DIALECT);
console.log('Database Name:', process.env.DB_NAME);

const sequelize = new Sequelize({
  database: process.env.DB_NAME as string, // Nombre de la base de datos
  username: process.env.DB_USER as string, // Usuario
  password: process.env.DB_PASSWORD as string, // Contraseña
  host: process.env.DB_HOST, // Host
  port: Number(process.env.DB_PORT), // Puerto
  dialect: process.env.DB_DIALECT as 'postgres', // Dialecto (aquí lo obtienes desde el archivo .env)
  logging: false, // para habilitar logs para consultas poner console.log
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Probar la conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincronizar todos los modelos
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Modelos sincronizados correctamente.');

    // Ejecutar seeders en orden
    console.log('🌱 Ejecutando seeders...');
    
    // 1. Crear/actualizar permisos
    await Permission.sync();
    console.log('🔐 Actualizando permisos...');
    
    for (const permiso of Permission.permisos) {
      await Permission.findOrCreate({
        where: { name: permiso.name },
        defaults: permiso
      });
    }
    console.log('✅ Permisos actualizados correctamente');

    // 2. Crear/actualizar roles y asignar permisos
    console.log('👥 Actualizando roles y permisos...');
    
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

      // Actualizar descripción si cambió
      if (role.description !== roleData.description) {
        await role.update({ description: roleData.description });
        console.log(`📝 Descripción actualizada para rol: ${roleData.name}`);
      }

      // Obtener permisos para este rol
      const permissions = await Permission.findAll({
        where: { name: roleData.permissions }
      });

      console.log(`🔐 Asignando ${permissions.length} permisos al rol ${roleData.name}`);
      console.log(`📋 Permisos: ${roleData.permissions.join(', ')}`);
      
      // **IMPORTANTE**: Limpiar permisos existentes y reasignar los nuevos
      await RolePermission.destroy({ where: { roleId: role.id } });
      
      const rolePermissions = permissions.map(permission => ({
        roleId: role.id,
        permissionId: permission.id
      }));

      if (rolePermissions.length > 0) {
        await RolePermission.bulkCreate(rolePermissions);
      }

      console.log(`✅ Rol ${roleData.name} configurado con ${permissions.length} permisos`);
    }

    // 3. Crear usuario superadmin si no existe
    const existingAdmin = await User.findOne({ where: { email: 'admin@admin.com' } });
    if (!existingAdmin) {
      const superadminRole = await Role.findOne({ where: { name: 'superadmin' } });
      if (superadminRole) {
        const hashedPassword = await bcrypt.hash('superadmin', 10);
        await User.create({
          name: 'Super Admin',
          email: 'admin@admin.com',
          password: hashedPassword,
          username: 'superadmin',
          displayName: 'Super Administrador',
          roleId: superadminRole.id,
          isActiveSession: false
        });
        console.log('✅ Usuario superadmin creado correctamente');
      }
    }

    // 4. **NUEVO**: Verificar y actualizar usuarios existentes con permisos correctos
    console.log('🔄 Verificando usuarios existentes...');
    
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

    for (const user of users) {
      const userRole = user.Role;
      if (userRole) {
        const currentPermissions = userRole.Permissions?.map(p => p.name) || [];