import CourseListItem from "./CourseListItem";
import { Category, CareerType } from "@/course/interfaces/ViewnerCourse";
import { Loader2 } from "lucide-react";

interface Course {
  id: number;
  title: string;
  summary: string;
  image: string;
  categories: Category[];
  careerType: CareerType;
}

export default function CoursesList({ courses }: { courses: Course[] }) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl shadow-sm overflow-hidden">
          {courses === null || courses === undefined ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="mt-4 text-gray-600">Cargando cursos...</p>
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center py-8 text-gray-600">
              No se encontraron cursos.
            </p>
          ) : (
            courses.map((course) => (
              <CourseListItem
                key={course.id}
                {...course}
                categories={course.categories}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
