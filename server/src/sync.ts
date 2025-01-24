// Sincronización (sync.ts)
import Role from './modules/role/Role';
import Permission from './modules/role/Permission'
import RolePermission from './modules/role/RolePermission';
import User from './modules/user/User';
import Admin from './modules/admin/Admin';
import Course from './modules/course/Course';
import Section from './modules/section/Section';
import Content from './modules/content/Content';
import HeaderSection from './modules/headerSection/HeaderSection';

async function syncDb() {
  try {
    // Sincroniza la tabla Permissions sin borrar
    await Permission.sync({ alter: true });
    console.log('Tabla Permissions sincronizada');

    // Sincroniza la tabla Roles sin borrar
    await Role.sync({ alter: true });
    console.log('Tabla Roles sincronizada');

    // Sincroniza la tabla RolePermission sin borrar
    await RolePermission.sync({ alter: true });
    console.log('Tabla RolePermission sincronizada');

    // Sincroniza las demás tablas sin borrar
    await User.sync({ alter: true });
    console.log('Tabla Users sincronizada');

    // Sincroniza la tabla Admin sin borrar
    await Admin.sync({ alter: true });
    console.log('Tabla Admin sincronizada');

    console.log('Tablas sincronizadas correctamente');
  } catch (error) {
    console.error('Error sincronizando la base de datos:', error);
  }
}

syncDb();