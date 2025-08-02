import { Edit } from "lucide-react";
import { CourseData } from "../../interfaces/CourseDetail";

interface CourseHeaderProps {
  courseData: CourseData;
  onEditCourse: () => void;
}

export default function CourseHeader({ courseData, onEditCourse }: CourseHeaderProps) {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <div
        className="flex flex-col space-y-1.5 p-6 text-white"
        style={{ background: "linear-gradient(to right, #0c154c, #1d4ed8)" }}
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative w-24 h-24 bg-white rounded-lg p-2 flex-shrink-0 mx-auto md:mx-0">
            <img
              src={courseData.image || "/placeholder.svg"}
              alt={courseData.title}
              className="object-contain"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-2xl font-bold leading-none tracking-tight">
                {courseData.title} (ID: {courseData.id})
              </h3>
              <div
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white border-white"
                style={{ backgroundColor: courseData.isActive ? "#42d7c7" : "#6b7280" }}
              >
                {courseData.isActive ? "Activo" : "Inactivo"}
              </div>
              {courseData.isInDevelopment && (
                <div
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-white text-white"
                  style={{ backgroundColor: "#02ffff", color: "#0c154c" }}
                >
                  En Desarrollo
                </div>
              )}
              <button 
                onClick={onEditCourse}
                className="ml-auto flex items-center gap-2 px-3 py-1 bg-white text-blue-900 rounded text-sm hover:bg-gray-100"
              >
                <Edit className="w-4 h-4" />
                Editar Curso
              </button>
            </div>
            <p className="text-blue-100 text-lg mb-3">
              Estado: {courseData.isActive ? "ACTIVO" : "INACTIVO"} | Desarrollo:{" "}
              {courseData.isInDevelopment ? "EN DESARROLLO" : "COMPLETADO"} | Admin ID: {courseData.adminId}
            </p>
            <p className="text-blue-50">{courseData.about}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
