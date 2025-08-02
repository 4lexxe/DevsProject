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
        <label className="block text-sm font-medium" style={{ color: "#0c154c" }}>
          Cursos * ({selectedCourses.length} seleccionados)
        </label>
        <button
          type="button"
          onClick={onSelectAllCourses}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {selectedCourses.length === courses.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
        </button>
      </div>
      
      <div className="max-h-48 overflow-y-auto border-2 rounded-lg p-3 space-y-2" style={{ borderColor: "#42d7c7" }}>
        {courses.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay cursos disponibles</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`course-${course.id}`}
                checked={selectedCourses.includes(course.id)}
                onChange={() => onCourseToggle(course.id)}
                className="w-4 h-4 rounded border-2 focus:ring-2 focus:ring-blue-500"
                style={{ accentColor: "#42d7c7" }}
              />
              <label 
                htmlFor={`course-${course.id}`}
                className="text-sm cursor-pointer flex-1"
                style={{ color: "#0c154c" }}
              >
                {course.title}
              </label>
            </div>
          ))
        )}
      </div>
      
      {selectedCourses.length === 0 && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          Debes seleccionar al menos un curso
        </p>
      )}
    </div>
  );
}
