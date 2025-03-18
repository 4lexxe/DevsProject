import sequelize from './infrastructure/database/db';

import Role from './modules/role/Role';
import { rolesIniciales } from './modules/role/Role';
import Permission from './modules/role/Permission';
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

/* Modelos relacionados con el foro */

import {ForumCategory, ForumPost, ForumReply, ForumVotePost, ForumVoteReply, ForumFlair, Report, ForumReactionPost, ForumReactionReply, predefinedFlairs, predefinedCategories, PostFlair, UserFlair} from './modules/forum/models/index';

// sync.ts
async function syncDatabase() {
  try {
    await sequelize.authenticate();

    // Orden CORREGIDO
    await Permission.sync({ force: true });
    await Role.sync({ force: true });
    await RolePermission.sync({ force: true }); // ¡Primero debe existir esta tabla!

    
    await User.sync({ force: true });
    
    await Admin.sync({ force: true });
    
    await SectionHeader.sync({ force: true });
    
    await Recourse.sync({ force: true });
    
    await Category.sync({ force: true });
    await CareerType.sync({ force: true })
    await Course.sync({ force: true });
    await CourseCategory.sync({ force: true });
    await Section.sync({ force: true });
    
    await Content.sync({ force: true });
    
    await Rating.sync({ force: true });

    await Comment.sync({ force: true });
    await Recourse.sync({ force: true });
    
    await RoadMap.sync({ force: true });
    
    // Sincronizar modelos del foro
    // Sincronizar modelos del foro en el orden correcto
    await ForumCategory.sync({ force: true });
    await ForumPost.sync({ force: true });
    await ForumReply.sync({ force: true });
    // Sincronizar modelos dependientes después
    await ForumVotePost.sync({ force: true });
    await ForumVoteReply.sync({ force: true });
    await ForumFlair.sync({ force: true });
    await PostFlair.sync({ force: true });
    await UserFlair.sync({ force: true });
    await Report.sync({ force: true });
    await ForumReactionPost.sync({ force: true });
    await ForumReactionReply.sync({ force: true });
    
    // Poblar datos DESPUÉS de crear todas las tablas
     await seedInitialData(); 
     await initializeForumFlairs();
     await initializeForumCategories();
    console.log('¡Sincronización exitosa!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

async function seedInitialData() {
  // Inicializar roles y permisos
  for (const roleData of rolesIniciales) {
    const [role] = await Role.findOrCreate({
      where: { name: roleData.name },
      defaults: { 
        name: roleData.name, 
        description: roleData.description 
      },
    });

    const permissions = await Permission.findAll({
      where: { name: roleData.permissions }
    });

    // Modificar esta parte
    if (permissions.length > 0) {
      await Promise.all(permissions.map(async (permission) => {
        await role.addPermission(permission);
      }));
    }
  }
} 

/**
 * @function initializeForumFlairs
 * @description Inicializa los distintivos predefinidos en la base de datos
 * @returns {Promise<void>}
 */
async function initializeForumFlairs(): Promise<void> {
  try {
    for (const flair of predefinedFlairs) {
      await ForumFlair.findOrCreate({
        where: { name: flair.name },
        defaults: flair
      });
    }
    console.log('Distintivos predefinidos del foro inicializados correctamente.');
  } catch (error) {
    console.error('Error al inicializar los distintivos predefinidos del foro:', error);
  }
}

/**
 * @function initializeForumCategories
 * @description Inicializa las categorías predefinidas del foro en la base de datos
 * @returns {Promise<void>}
 */
async function initializeForumCategories(): Promise<void> {
  try {
    console.log(`Iniciando la carga de ${predefinedCategories.length} categorías predefinidas...`);
    
    for (const category of predefinedCategories) {
      console.log(`Procesando categoría: ${category.name}`);
      
      const [categoryInstance, created] = await ForumCategory.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
      
      if (created) {
        console.log(`Categoría "${category.name}" creada con éxito.`);
      } else {
        console.log(`Categoría "${category.name}" ya existe, actualizada si es necesario.`);
        // Actualizar campos si es necesario
        await categoryInstance.update({
          description: category.description,
          icon: category.icon
        });
      }
    }
    
    // Verificamos si realmente se crearon las categorías
    const totalCategories = await ForumCategory.count();
    console.log(`Total de categorías en la base de datos: ${totalCategories}`);
    
    if (totalCategories > 0) {
      console.log('Categorías predefinidas del foro inicializadas correctamente.');
    } else {
      console.error('Advertencia: No se encontraron categorías en la base de datos después de la inicialización.');
    }
  } catch (error) {
    console.error('Error al inicializar las categorías predefinidas del foro:', error);
    throw error; // Propagamos el error para que la sincronización falle si esto falla
  }
}

syncDatabase();