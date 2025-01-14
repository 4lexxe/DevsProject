import sequelize from './config/db';
import User from './models/User';
import Role from './models/Role';
import Admin from './models/Admin';

sequelize.sync({ force: true })  // Eliminar las tablas existentes
  .then(() => {
    console.log('Tablas sincronizadas');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  }); 