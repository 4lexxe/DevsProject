// comando : npx ts-node src/scripts/exportData.ts

import fs from 'fs';
import path from 'path';
import sequelize from '../infrastructure/database/db';
import MPSubPlan from '../modules/subscription/models/MPSubPlan';
import Payment from '../modules/subscription/models/Payment';
import Invoice from '../modules/subscription/models/Invoice';
import Subscription from '../modules/subscription/models/Subscription';
import MPSubscription from '../modules/subscription/models/MPSubscription';

async function exportData() {
  try {
    // Autenticar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Consultar datos de la base de datos
    const mpSubPlans = await MPSubPlan.findAll();
    const subscriptions = await Subscription.findAll();
    const mpSubscriptions = await MPSubscription.findAll();
    const payments = await Payment.findAll();
    const invoices = await Invoice.findAll();

    // Crear un objeto con los datos
    const data = {
      mpSubPlans: mpSubPlans.map(mpSubPlan => {
        const subData = mpSubPlan.toJSON();
        delete subData.id;
        return subData;
      }),
      subscriptions: subscriptions.map(subscription => {
        const subData = subscription.toJSON();
        delete subData.id;
        return subData;
      }),
      mpSubscriptions: mpSubscriptions.map(mpSubscription => mpSubscription.toJSON()),
      payments: payments.map(payment => payment.toJSON()),
      invoices: invoices.map(invoice => {
        const invoiceData = invoice.toJSON();
        delete invoiceData.id;
        return invoiceData;
      }),
    };

    // Definir la ruta del archivo de salida
    const outputPath = path.join(__dirname, 'data/exportedDataTest.json');

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