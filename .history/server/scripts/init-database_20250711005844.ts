import { initializeDatabase } from '../src/infrastructure/database/db';

async function main() {
  try {
    console.log('🚀 Iniciando configuración de base de datos...');
    await initializeDatabase();
    console.log('✅ Base de datos configurada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
    process.exit(1);
  }
}

main();
