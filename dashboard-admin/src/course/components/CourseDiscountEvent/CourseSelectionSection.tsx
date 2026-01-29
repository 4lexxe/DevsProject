import { BookOpen, AlertCircle } from "lucide-react";

interface Course {
  id: number;
  title: string;
}

interface CourseSelectionSectionProps {
  courses: Course[];
  selectedCourses: number[];
  onCourseToggle: (courseId: number) => void;
  onSelectAllCourses: () => void;
}

export default function CourseSelectionSection({ 
  courses, 
  selectedCourses, 
  onCourseToggle, 
  onSelectAllCourses 
}: CourseSelectionSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-900">
          Cursos <span className="text-red-500">*</span> ({selectedCourses.length} seleccionados)
        </label>
        <button
          type="button"
          onClick={onSelectAllCourses}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          {selectedCourses.length === courses.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
        </button>
      </div>
      
      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-2 bg-white">
        {courses.length === 0 ? (
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            No hay cursos disponibles
          </p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="flex items-center space-x-3 py-1">
              <input
                type="checkbox"
                id={`course-${course.id}`}
                checked={selectedCourses.includes(course.id)}
                onChange={() => onCourseToggle(course.id)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-gray-900 text-gray-900"
              />
              <label 
                htmlFor={`course-${course.id}`}
                className="text-sm cursor-pointer flex-1 text-gray-900 font-medium"
              >
                {course.title}
              </label>
            </div>
          ))
        )}
      </div>
      
      {selectedCourses.length === 0 && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          Debes seleccionar al menos un curso
        </p>
      )}
    </div>
  );
}
