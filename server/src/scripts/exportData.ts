// comando : npx ts-node src/scripts/exportData.ts

import fs from 'fs';
import path from 'path';
import sequelize from '../infrastructure/database/db';
import MPSubPlan from '../modules/subscription/models/MPSubPlan';

async function exportData() {
  try {
    // Autenticar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Consultar datos de la base de datos
    const mpSubPlans = await MPSubPlan.findAll();

    // Crear un objeto con los datos
    const data = {
      mpSubPlans: mpSubPlans.map(mpSubPlan => mpSubPlan.toJSON()),
    };

    // Definir la ruta del archivo de salida
    const outputPath = path.join(__dirname, 'data/exportedDataTest.json');
    /* const outputPath = path.join(__dirname, 'data/exportedDataTest.json'); */

    // Escribir los datos en el archivo
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log('Datos exportados exitosamente a', outputPath);
  } catch (error) {
    console.error('Error al exportar datos:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
  }
}

// Ejecutar la función de exportación
exportData();