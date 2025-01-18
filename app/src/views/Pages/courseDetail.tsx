import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourses } from '../../services/courseServices'; // Asegúrate de tener este servicio
import { getModulesCount as fetchModulesCount } from '../../services/courseServices'; // Importamos el servicio para obtener el conteo de módulos
import HeroCourse from '../components/courses/HeroCourse'; // Importamos el HeroCourse
import CourseOverview from '../components/courses/CourseOverview'; // Importamos el CourseOverview

interface Course {
  id: number;
  title: string;
  image: string;
  summary: string;
  category: string;
  about: string; // Descripción
  relatedCareerType: string; // Tipo de carrera
  createdAt: string; // Fecha de creación
  modules: Array<any>; // Aquí se puede definir como una lista de módulos o algo más específico
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el id de los parámetros de la URL
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleCount, setModuleCount] = useState<number>(0); // Para el conteo de módulos

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Obtener todos los cursos
        const courses = await getCourses();
        const fetchedCourse: Course | undefined = courses.find(
          (course: Course) => course.id === Number(id)
        );

        if (fetchedCourse) {
          setCourse(fetchedCourse);

          // Obtener el número de módulos asociados al curso
          const count = await fetchModulesCount(Number(id));
          setModuleCount(count);
        } else {
          setError('Curso no encontrado.');
        }
      } catch (err) {
        console.error('Error al cargar el curso:', err);
        setError('Hubo un error al cargar los datos del curso.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return <p className="p-6 text-blue-500">Cargando curso...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!course) {
    return <p className="p-6 text-red-500">Curso no encontrado.</p>;
  }

  return (
    <div className="p-6">
      {/* Pasamos los datos del curso al HeroCourse */}
      <HeroCourse
        title={course.title}
        description={course.summary}
        image={course.image}
        category={course.category}
      />
      <div className="mt-8">
        {/* Pasamos los datos del curso al CourseOverview */}
        <CourseOverview
          about={course.about}
          relatedCareerType={course.relatedCareerType}
          numberOfModules={moduleCount}
          createdAt={course.createdAt}
        />
      </div>
    </div>
  );
};

export default CourseDetails;

// Servicio para obtener el conteo de módulos
export const getModulesCount = async (courseId: number): Promise<number> => {
  try {
    const response = await fetch(`/api/courses/${courseId}/modules/count`);
    if (!response.ok) {
      throw new Error('Error al obtener el conteo de módulos');
    }

    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error al obtener el conteo de módulos:', error);
    throw error;
  }
};