import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getById } from '../services/courseServices';
import HeroCourse from '../components/courses/HeroCourse';
import CourseOverview from '../components/courses/CourseOverview';
import LearningOutcomes from '../components/courses/LearningOutcomes';
import SectionList from '../components/courses/SectionList';
import { Course } from '../interfaces/viewnerCourseInterface';


const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleCount, setModuleCount] = useState<number>(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const course = await getById(id);
        if (course) {
          setCourse(course);
          const count = course.sections.length;
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
    <div>
      {/* Hero section with full width */}
      <div className="w-full">
        <HeroCourse
          title={course.title}
          description={course.summary}
          image={course.image}
          categories={course.categories}
        />
      </div>
      
      {/* Content section with constrained width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CourseOverview
              about={course.about}
              careerType={course.careerType.name}
              numberOfModules={moduleCount}
              createdAt={course.createdAt}
            />
            
            {/* Sections List */}
            <div className="mt-12">
              <SectionList courseId={id || ''} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <LearningOutcomes outcomes={course.learningOutcomes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;