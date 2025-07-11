import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

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

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
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
    
    // 1. Crear permisos
    await Permission.sync();
    const existingPermissions = await Permission.count();
    if (existingPermissions === 0) {
      await Permission.bulkCreate(Permission.permisos, {
        updateOnDuplicate: ['description']
      });
      console.log('✅ Permisos creados correctamente');
    } else {
      // Actualizar permisos existentes y crear nuevos
      for (const permiso of Permission.permisos) {
        await Permission.findOrCreate({
          where: { name: permiso.name },
          defaults: permiso
        });
      }
      console.log('✅ Permisos actualizados correctamente');
    }

    // 2. Crear roles y asignar permisos
    for (const roleData of rolesIniciales) {
      // Buscar o crear el rol
      let [role] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: {
          name: roleData.name,
          description: roleData.description,
        }
      });

      // Actualizar descripción
      if (role.description !== roleData.description) {
        await role.update({ description: roleData.description });
      }

      // Obtener permisos para este rol
      const permissions = await Permission.findAll({
        where: { name: roleData.permissions }
      });

      // Limpiar y reasignar permisos
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

    console.log('🎉 Base de datos inicializada completamente');
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    throw error;
  }
};

export default sequelize;
