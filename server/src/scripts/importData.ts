// Comando: npx ts-node src/scripts/importData.ts

import fs from 'fs';
import path from 'path';
import sequelize from '../infrastructure/database/db';
import User from '../modules/user/User';
import Plan from '../modules/subscription/models/Plan';
import DiscountEvent from '../modules/subscription/models/PlanDiscountEvent';
import Payment from '../modules/subscription/models/SubscriptionPayment';
import Invoice from '../modules/subscription/models/Invoice';
import Subscription from '../modules/subscription/models/Subscription';
import MPSubscription from '../modules/subscription/models/MPSubscription';
import Course from '../modules/course/models/Course';
import Section from '../modules/course/models/Section';
import Content from '../modules/course/models/Content';
import { CourseCategory } from '../modules/course/models/Course';

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
        await User.bulkCreate(data.users, { transaction });
        console.log(`✅ ${data.users.length} usuarios importados`);
      }
      
      // Insertar los planes
      if(data.plans && data.plans.length > 0) {
        await Plan.bulkCreate(data.plans, { transaction });
        console.log(`✅ ${data.plans.length} planes importados`);
      }

      // Insertar los eventos de descuento
      if (data.discountEvents && data.discountEvents.length > 0) {
        await DiscountEvent.bulkCreate(data.discountEvents, { transaction });
        console.log(`✅ ${data.discountEvents.length} eventos de descuento importados`);
      }

      // Insertar los cursos con sus secciones y contenidos
      if (data.courses && data.courses.length > 0) {
        console.log(`📚 Importando ${data.courses.length} cursos...`);
        
        for (const courseData of data.courses) {
          // Extraer categoryIds y sections antes de crear el curso
          const { categoryIds, sections, ...courseFields } = courseData;
          
          // Crear el curso
          const createdCourse = await Course.create(courseFields, { transaction });

          // Crear las relaciones curso-categoría
          if (categoryIds && categoryIds.length > 0) {
            const courseCategories = categoryIds.map((categoryId: number) => ({
              courseId: createdCourse.id,
              categoryId,
            }));
            await CourseCategory.bulkCreate(courseCategories, { transaction });
          }

          // Crear las secciones del curso
          if (sections && sections.length > 0) {
            
            for (const sectionData of sections) {
              // Extraer contents antes de crear la sección
              const { contents, ...sectionFields } = sectionData;
              
              const createdSection = await Section.create({
                ...sectionFields,
                courseId: createdCourse.id,
              }, { transaction });

              // Crear los contenidos de la sección
              if (contents && contents.length > 0) {
                for (const contentData of contents) {
                  await Content.create({
                    ...contentData,
                    sectionId: createdSection.id,
                  }, { transaction });
                }
              }
            }
          }
        }
        console.log(`✅ Todos los cursos importados exitosamente`);
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