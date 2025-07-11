import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Cargar variables de entorno
dotenv.config();

// Verificar que las variables estén cargadas correctamente
console.log('Dialect:', process.env.DB_DIALECT);
console.log('Database Name:', process.env.DB_NAME);

const sequelize = new Sequelize({
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: process.env.DB_DIALECT as 'postgres',
  logging: false,
});

// Importar todos los modelos después de crear la instancia de sequelize
import User from '../../modules/user/User';
import Role from '../../modules/role/Role';
import Permission from '../../modules/role/Permission';
import RolePermission from '../../modules/role/RolePermission';
import Resource from '../../modules/resource/Resource';
import Comment from '../../modules/resource/comment/Comment';
import Rating from '../../modules/resource/rating/Rating';
import { rolesIniciales } from '../../modules/role/Role';

// Función para inicializar la base de datos
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Probar la conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincronizar todos los modelos (crear tablas si no existen)
    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Modelos sincronizados correctamente.');

    // Ejecutar seeders en orden
    console.log('🌱 Ejecutando seeders...');
    
    // 1. Crear permisos
    console.log('📝 Creando permisos...');
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
    console.log('👥 Creando roles...');
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
    console.log('👑 Verificando usuario superadmin...');
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
        console.log('📧 Email: admin@admin.com');
        console.log('🔑 Password: superadmin');
      }
    }

    // 4. Crear algunos recursos de ejemplo si no existen
    console.log('📚 Verificando recursos de ejemplo...');
    const existingResources = await Resource.count();
    if (existingResources === 0) {
      const adminUser = await User.findOne({ where: { email: 'admin@admin.com' } });
      if (adminUser) {
        const sampleResources = [
          {
            title: 'Introducción a JavaScript',
            description: 'Aprende los fundamentos de JavaScript desde cero',
            url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Guide',
            type: 'link' as const,
            userId: adminUser.id,
            isVisible: true,
            coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
          },
          {
            title: 'Tutorial React',
            description: 'Guía completa para desarrollar aplicaciones con React',
            url: 'https://reactjs.org/tutorial/tutorial.html',
            type: 'document' as const,
            userId: adminUser.id,
            isVisible: true,
            coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
          },
          {
            title: 'Curso de Node.js',
            description: 'Aprende desarrollo backend con Node.js y Express',
            url: 'https://nodejs.org/en/docs/',
            type: 'video' as const,
            userId: adminUser.id,
            isVisible: true,
            coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
          }
        ];

        await Resource.bulkCreate(sampleResources);
        console.log('✅ Recursos de ejemplo creados correctamente');
      }
    }

    console.log('🎉 Base de datos inicializada completamente');
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    throw error;
  }
};

// Función para verificar el estado de la conexión
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
    return false;
  }
};

export default sequelize;
