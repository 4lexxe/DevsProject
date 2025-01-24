// Sincronización (sync.ts)
import Role from './models/Role';
import Permission from './models/Permission';
import RolePermission from './models/RolePermission';
import User from './models/User';
import Admin from './models/Admin';
import Course from './models/Course';
import Section from './models/Section';
import Content from './models/Content';
import HeaderSection from './models/HeaderSection';

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