import CoursesList from "../components/courses/CoursesList";
import { getCourses } from "../services/courseServices";
import { getCoursesByCategory } from "@/home/services/categoriesService";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CoursesPage({ activeByCategory = false }) {
  const { categoryId } = useParams<{ categoryId: string | undefined }>();

  const [courses, setCourses] = useState<any[]>([]);
  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error("No se pudieron cargar los cursos", error);
    }
  };

  const fetchCoursesByCategory = async () => {
    if (categoryId) {
      try {
        const data = await getCoursesByCategory(categoryId);
        setCourses(data);
      } catch (error) {
        console.error("No se pudo obtener los cursos por categoria: ", error);
      }
    }
  };

  useEffect(() => {
    if (activeByCategory) {
      fetchCoursesByCategory();
    } else {
      fetchCourses();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-neutral-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-black mb-12">
          Todos los Cursos
        </h1>
        <Link to="/course/form">
          <button className="px-6 py-3 text-md rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform duration-300 hover:scale-105 text-white bg-blue-600 hover:bg-blue-700">
            Crear nuevo curso
          </button>
        </Link>
        <CoursesList courses={courses} />
      </div>
    </div>
  );
}
