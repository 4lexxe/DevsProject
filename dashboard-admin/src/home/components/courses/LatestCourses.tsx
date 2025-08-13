import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { getCourses } from '@/course/services/courseServices';
import type { CourseData } from '@/course/interfaces/CourseDetail'; 

export default function LatestCourses() {
  const [courses, setCourses] = useState<CourseData[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses(); // Llamada a la API para obtener los cursos
        // Ordenar los cursos por fecha de creación, de más reciente a más antiguo
        const sortedCourses = data
          .sort((a: CourseData, b: CourseData) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3); // Obtener solo los tres más recientes
        setCourses(sortedCourses); // Establecer los cursos en el estado
      } catch (error) {
        console.error('No se pudieron cargar los cursos', error);
      }
    };

    fetchCourses();
  }, []);

  /* useEffect(() => {
    console.log(courses)
  }, [courses]) */

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Últimos Cursos</h2>
          <a
            href="/cursos"
            className="flex items-center text-[#00D7FF] hover:text-[#66E7FF] transition-colors"
          >
            Ver todos
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              summary={course.summary}
              courseName={course.categories?.[0]?.name || 'Sin categoría'} // Muestra la primera categoría
              image={course.image}
              careerType={course.careerType?.name || 'Sin tipo de carrera'} // Muestra el tipo de carrera relacionada
            />
          ))}
        </div>
      </div>
    </section>
  );
}