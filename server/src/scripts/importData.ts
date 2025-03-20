// Comando: npx ts-node src/scripts/importData.ts

import fs from 'fs';
import path from 'path';
import sequelize from '../infrastructure/database/db';
import User from '../modules/user/User';
import Plan from '../modules/subscription/models/Plan';
import DiscountEvent from '../modules/subscription/models/DiscountEvent';
import MPSubPlan from '../modules/subscription/models/MPSubPlan';
import Payment from '../modules/subscription/models/Payment';
import Invoice from '../modules/subscription/models/Invoice';
import Subscription from '../modules/subscription/models/Subscription';
import MPSubscription from '../modules/subscription/models/MPSubscription';

async function importData() {
  try {
    // Autenticar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Leer el archivo de datos
    const filePath = path.join(__dirname, 'data/exportedDataTest.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    // Insertar los datos en la base de datos
    await sequelize.transaction(async (transaction) => {
      // Insertar los usuarios
      if(data.users && data.users.length > 0) {
        await User.bulkCreate(data.users, { transaction })
      };
      // Insertar los planes
      if(data.plans && data.plans.length > 0) {
        await Plan.bulkCreate(data.plans, { transaction });
      }

      // Insertar los eventos de descuento
      if (data.discountEvents && data.discountEvents.length > 0) {
        await DiscountEvent.bulkCreate(data.discountEvents, { transaction });
      }

      // Insertar MPSubPlans
      if (data.mpSubPlans && data.mpSubPlans.length > 0) {
        await MPSubPlan.bulkCreate(data.mpSubPlans, { transaction });
      }
      
      // Insertar Subscriptions
      if (data.subscriptions && data.subscriptions.length > 0) {
        await Subscription.bulkCreate(data.subscriptions, { transaction });
      }

      // Insertar MPSubscriptions
      if (data.mpSubscriptions && data.mpSubscriptions.length > 0) {
        await MPSubscription.bulkCreate(data.mpSubscriptions, { transaction });
      }

      // Insertar Payments
      if (data.payments && data.payments.length > 0) {
        await Payment.bulkCreate(data.payments, { transaction });
      }

      // Insertar Invoices
      if (data.invoices && data.invoices.length > 0) {
        await Invoice.bulkCreate(data.invoices, { transaction });
      }
    });

    console.log('Datos importados exitosamente.');
  } catch (error) {
    console.error('Error al importar datos:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
  }
}

// Ejecutar la función de importación
importData();