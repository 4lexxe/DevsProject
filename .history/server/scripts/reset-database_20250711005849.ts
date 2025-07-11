import sequelize from '../src/infrastructure/database/db';
import { initializeDatabase } from '../src/infrastructure/database/db';

async function resetDatabase() {
  try {
    console.log('⚠️ ADVERTENCIA: Esto eliminará TODOS los datos de la base de datos');
    console.log('🔄 Reiniciando base de datos...');
    
    // Eliminar todas las tablas
    await sequelize.drop();
    console.log('✅ Tablas eliminadas');
    
    // Reinicializar
    await initializeDatabase();
    console.log('✅ Base de datos reinicializada exitosamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error reiniciando base de datos:', error);
    process.exit(1);
  }
}

resetDatabase();
