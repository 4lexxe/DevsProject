import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string, // Nombre de la base de datos
  process.env.DB_USER as string, // Usuario
  process.env.DB_PASSWORD as string, // Contraseña
  {
    host: process.env.DB_HOST, // Host
    port: Number(process.env.DB_PORT), // Puerto
    dialect: process.env.DB_DIALECT as any, // Dialecto
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

export default sequelize;