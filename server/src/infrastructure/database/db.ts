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
  logging: console.log, // Habilitar logs para consultas
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

export default sequelize;
