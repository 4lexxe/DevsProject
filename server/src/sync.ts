import sequelize from './config/db';  // Asegúrate de tener la conexión de sequelize
import Admin from './models/Admin';    // Importamos el modelo Admin
import Course from './models/Course';  // Importar el modelo de Course
import Content from './models/Content';  // Importar el modelo de Content
import Section from './models/Section';  // Importar el modelo de Section

// Función para verificar si la tabla existe
const checkIfTableExists = async (tableName: string) => {
  const [results] = await sequelize.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = :tableName;
  `, { replacements: { tableName } });
  return results.length > 0;
};

// Sincronizar todos los modelos con un enfoque de fuerza bruta
const syncDb = async () => {
  try {
    const models = [Admin, Course, Section, Content]; // Asegúrate de que Section esté antes de Content

    // Itera sobre los modelos para forzar la creación de las tablas
    for (const model of models) {
      let tableExists = await checkIfTableExists(model.tableName);

      // Mientras la tabla no exista, intenta crearla
      while (!tableExists) {
        console.log(`La tabla ${model.tableName} no existe. Intentando crearla...`);
        
        // Forzar la creación de la tabla
        await model.sync({ force: true });

        // Verificar si la tabla ahora existe
        tableExists = await checkIfTableExists(model.tableName);
      }

      console.log(`La tabla ${model.tableName} se ha creado correctamente.`);
    }

  } catch (error) {
    console.error('Error sincronizando la base de datos:', error);
  }
};

// Llamamos a la función para realizar la sincronización
syncDb();