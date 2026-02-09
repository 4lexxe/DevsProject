import fs from 'fs';
import path from 'path';
import sequelize from '../infrastructure/database/db';
import { Op } from 'sequelize';
import Course, { CourseCategory } from '../modules/course/models/Course';
import Category from '../modules/course/models/Category';
import CareerType from '../modules/course/models/CareerType';
import Admin from '../modules/admin/Admin';

interface CourseData {
  id: number;
  title: string;
  image: string;
  summary: string;
  about: string;
  careerTypeId: number;
  learningOutcomes: string[];
  prerequisites: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  price: number;
  adminId: number;
  categoryIds: number[];
}

interface CategoryData {
  id: number;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
}

interface CareerTypeData {
  id: number;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
}

interface ImportData {
  careerTypes: CareerTypeData[];
  categories: CategoryData[];
  courses: CourseData[];
}

async function importMarketingCourses() {
  try {
    console.log(' Iniciando importación de cursos de marketing y negocios...');

    // Leer el archivo JSON
    const dataPath = path.join(__dirname, 'data', 'marketingCoursesData.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data: ImportData = JSON.parse(rawData);

    // Sincronizar la base de datos
    await sequelize.sync({ force: false });
    console.log(' Base de datos sincronizada');

    // Verificar que existe al menos un admin
    let admin = await Admin.findByPk(1);
    if (!admin) {
      console.log('  No se encontró admin con ID 1, creando admin por defecto...');
      admin = await Admin.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashedpassword',
        isActive: true
      });
      console.log(' Admin creado con ID:', admin.id);
    }

    // Importar nuevos tipos de carrera
    console.log(' Importando tipos de carrera de negocios...');
    for (const careerTypeData of data.careerTypes) {
      const [careerType, created] = await CareerType.findOrCreate({
        where: { id: careerTypeData.id },
        defaults: {
          name: careerTypeData.name,
          icon: careerTypeData.icon,
          description: careerTypeData.description,
          isActive: careerTypeData.isActive
        }
      });
      
      if (created) {
        console.log(`   Nuevo tipo de carrera: ${careerType.name}`);
      } else {
        console.log(`    Tipo de carrera ya existe: ${careerType.name}`);
      }
    }

    // Importar nuevas categorías
    console.log('  Importando categorías de marketing...');
    for (const categoryData of data.categories) {
      const [category, created] = await Category.findOrCreate({
        where: { id: categoryData.id },
        defaults: {
          name: categoryData.name,
          icon: categoryData.icon,
          description: categoryData.description,
          isActive: categoryData.isActive
        }
      });
      
      if (created) {
        console.log(`   Nueva categoría: ${category.name}`);
      } else {
        console.log(`    Categoría ya existe: ${category.name}`);
      }
    }

    // Importar cursos de marketing
    console.log(' Importando cursos de marketing y negocios...');
    let newCoursesCount = 0;
    
    for (const courseData of data.courses) {
      const [course, created] = await Course.findOrCreate({
        where: { id: courseData.id },
        defaults: {
          title: courseData.title,
          image: courseData.image,
          summary: courseData.summary,
          about: courseData.about,
          careerTypeId: courseData.careerTypeId,
          learningOutcomes: courseData.learningOutcomes,
          prerequisites: courseData.prerequisites,
          isActive: courseData.isActive,
          isInDevelopment: courseData.isInDevelopment,
          price: courseData.price,
          adminId: admin.id
        }
      });
      
      if (created) {
        newCoursesCount++;
        console.log(`   Nuevo curso: ${course.title}`);
        
        // Crear relaciones con categorías
        if (courseData.categoryIds && courseData.categoryIds.length > 0) {
          for (const categoryId of courseData.categoryIds) {
            await CourseCategory.findOrCreate({
              where: {
                courseId: course.id,
                categoryId: categoryId
              }
            });
          }
          console.log(`     Relaciones con categorías: ${courseData.categoryIds.join(', ')}`);
        }
      } else {
        console.log(`    Curso ya existe: ${course.title}`);
      }
    }

    console.log('\n Importación de cursos de marketing completada!');
    console.log(` Resumen de nuevos elementos:`);
    console.log(`   - Nuevos tipos de carrera: ${data.careerTypes.length}`);
    console.log(`   - Nuevas categorías: ${data.categories.length}`);
    console.log(`   - Nuevos cursos: ${newCoursesCount}`);

    // Mostrar estadísticas finales
    const totalCourses = await Course.count();
    const totalCategories = await Category.count();
    const totalCareerTypes = await CareerType.count();
    const totalRelations = await CourseCategory.count();

    console.log(`\n Estado actual de la base de datos:`);
    console.log(`   - Total cursos: ${totalCourses}`);
    console.log(`   - Total categorías: ${totalCategories}`);
    console.log(`   - Total tipos de carrera: ${totalCareerTypes}`);
    console.log(`   - Total relaciones curso-categoría: ${totalRelations}`);

    // Mostrar cursos más caros (premium)
    console.log(`\n Cursos Premium (más de $200):`);
    const premiumCourses = await Course.findAll({
      where: {
        price: {
          [Op.gte]: 200
        }
      },
      attributes: ['title', 'price'],
      order: [['price', 'DESC']]
    });

    for (const course of premiumCourses) {
      console.log(`   - ${course.title}: $${course.price}`);
    }

    // Mostrar distribución por tipo de carrera
    console.log(`\n Distribución actualizada por área:`);
    const careerTypes = await CareerType.findAll({
      include: [{
        model: Course,
        as: 'courses',
        attributes: ['id']
      }]
    });

    for (const careerType of careerTypes) {
      const courseCount = (careerType as any).courses?.length || 0;
      console.log(`   - ${careerType.name}: ${courseCount} cursos`);
    }

  } catch (error) {
    console.error(' Error durante la importación:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  importMarketingCourses()
    .then(() => {
      console.log(' Script de cursos de marketing completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error(' Error en el script:', error);
      process.exit(1);
    });
}

export default importMarketingCourses;