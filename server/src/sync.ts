// Sincronización (sync.ts)
import Role from './models/Role';
import User from './models/User';
import Admin from './models/Admin';
import Course from './models/Course';
import Section from './models/Section';
import Content from './models/Content';

async function syncDb() {
  try {
    // Sincroniza la tabla Roles sin borrar
    await Role.sync({ alter: true });
    console.log('Tabla Roles sincronizada');

    // Sincroniza las demás tablas sin borrar
    await User.sync({ alter: true });
    await Admin.sync({ alter: true });
    await Course.sync({ alter: true });
    await Section.sync({ alter: true });
    await Content.sync({ alter: true });

    console.log('Tablas sincronizadas correctamente');
  } catch (error) {
    console.error('Error sincronizando la base de datos:', error);
  }
}

syncDb();