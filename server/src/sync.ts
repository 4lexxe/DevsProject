import sequelize from './infrastructure/database/db';

import Role from './modules/role/Role';
import { rolesIniciales } from './modules/role/Role';
import Permission from './modules/role/Permission';
import RolePermission from './modules/role/RolePermission';
import User from './modules/user/User';
import Admin from './modules/admin/Admin';
import SectionHeader from './modules/headerSection/HeaderSection';
import Recourse from './modules/resource/Resource';

/* Modelos relacionados con el area de cursos */
import Category from './modules/category/Category';
import CareerType from './modules/careerType/CareerType';
import Course from './modules/course/Course';
import { CourseCategory } from './modules/course/Course';
import Section from './modules/section/Section';

import FileContent from './modules/content/models/FileContent';
import ImageContent from './modules/content/models/ImageContent';
import LinkContent from './modules/content/models/LinkContent';
import QuizContent from './modules/content/models/QuizContent';
import TextContent from './modules/content/models/TextContent';
import VideoContent from './modules/content/models/VideoContent';

// sync.ts
async function syncDatabase() {
  try {
    await sequelize.authenticate();

    // Orden CORREGIDO
    await Permission.sync({ force: true });
    await Role.sync({ force: true });
    await RolePermission.sync({ force: true }); // ¡Primero debe existir esta tabla!

    // Poblar datos DESPUÉS de crear todas las tablas
    /* await seedInitialData(); */

    await User.sync({ force: true });

    await Admin.sync({ force: true });

    await SectionHeader.sync({ force: true });

    await Recourse.sync({ force: true });

    await Category.sync({ force: true });
    await CareerType.sync({ force: true })
    await Course.sync({ force: true });
    await CourseCategory.sync({ force: true });
    await Section.sync({ force: true });

    await FileContent.sync({ force: true })
    await ImageContent.sync({ force: true })
    await LinkContent.sync({ force: true })
    await QuizContent.sync({ force: true })
    await TextContent.sync({ force: true })
    await VideoContent.sync({ force: true })


    
    console.log('¡Sincronización exitosa!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

/* async function seedInitialData() {
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
} */

syncDatabase();