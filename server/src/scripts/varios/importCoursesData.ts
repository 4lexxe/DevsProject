import fs from 'fs';
import path from 'path';
import sequelize from '../../infrastructure/database/db';
import Course, { CourseCategory } from '../../modules/course/models/Course';
import Category from '../../modules/course/models/Category';
import CareerType from '../../modules/course/models/CareerType';
import Admin from '../../modules/admin/Admin';

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

async function importCoursesData() {
  try {
    console.log('🚀 Iniciando importación de datos de cursos...');

    // Leer el archivo JSON
    const dataPath = path.join(__dirname, 'data', 'coursesData.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data: ImportData = JSON.parse(rawData);

    // Sincronizar la base de datos
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos sincronizada');

    // Verificar que existe al menos un admin
    let admin = await Admin.findByPk(1);
    if (!admin) {
      console.log('⚠️  No se encontró admin con ID 1, creando admin por defecto...');
      admin = await Admin.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashedpassword', // En producción usar hash real
        isActive: true
      });
      console.log('✅ Admin creado con ID:', admin.id);
    }

    // Importar tipos de carrera
    console.log('📚 Importando tipos de carrera...');
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
        console.log(`  ✅ Tipo de carrera creado: ${careerType.name}`);
      } else {
        console.log(`  ⚠️  Tipo de carrera ya existe: ${careerType.name}`);
      }
    }

    // Importar categorías
    console.log('🏷️  Importando categorías...');
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
        console.log(`  ✅ Categoría creada: ${category.name}`);
      } else {
        console.log(`  ⚠️  Categoría ya existe: ${category.name}`);
      }
    }

    // Importar cursos
    console.log('📖 Importando cursos...');
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
          adminId: admin.id // Usar el ID del admin encontrado/creado
        }
      });
      
      if (created) {
        console.log(`  ✅ Curso creado: ${course.title}`);
        
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
          console.log(`    🔗 Relaciones con categorías creadas: ${courseData.categoryIds.join(', ')}`);
        }
      } else {
        console.log(`  ⚠️  Curso ya existe: ${course.title}`);
      }
    }

    console.log('\n🎉 Importación completada exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - Tipos de carrera: ${data.careerTypes.length}`);
    console.log(`   - Categorías: ${data.categories.length}`);
    console.log(`   - Cursos: ${data.courses.length}`);

    // Mostrar estadísticas finales
    const totalCourses = await Course.count();
    const totalCategories = await Category.count();
    const totalCareerTypes = await CareerType.count();
    const totalRelations = await CourseCategory.count();

    console.log(`\n📈 Estado actual de la base de datos:`);
    console.log(`   - Total cursos: ${totalCourses}`);
    console.log(`   - Total categorías: ${totalCategories}`);
    console.log(`   - Total tipos de carrera: ${totalCareerTypes}`);
    console.log(`   - Total relaciones curso-categoría: ${totalRelations}`);

  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  importCoursesData()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export default importCoursesData;