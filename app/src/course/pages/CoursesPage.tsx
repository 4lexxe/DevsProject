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
  }, [activeByCategory ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header section */}
        <div className="px-4 py-6 md:py-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Todos los Cursos
            </h1>

          </div>
        </div>

        {/* Courses list section */}
        <div className="pb-20">
          <CoursesList courses={courses} />
        </div>
      </div>
    </div>
  );
};
