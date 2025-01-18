import React, { useEffect, useState } from 'react';
import { getCourses } from '../../../services/courseServices';
import CourseCard from './CourseCard';
import { ArrowRight } from 'react-feather';

// Interfaz ajustada para reflejar los datos correctos
interface Course {
  id: number;
  title: string;
  summary: string; // Resumen del curso
  category: string; // Categoría del curso
  image: string; // URL de la imagen
  relatedCareerType: string; // Tipo de carrera relacionada
}

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses(); // Llamada a la API para obtener los cursos
        setCourses(data); // Establece los cursos en el estado
      } catch (error) {
        console.error('No se pudieron cargar los cursos', error);
      }
    };

    fetchCourses();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  return (
    <section className="py-16 px-6 bg-[#CCF7FF]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Cursos Disponibles</h2>
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
              courseName={course.category} // Ahora muestra la categoría
              image={course.image}
              relatedCareerType={course.relatedCareerType} // Muestra el tipo de carrera relacionada
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesList;