import { CourseData } from "../../interfaces/CourseDetail";
import FontelloIcon from "@/shared/components/icons/FontelloIcon";
import { CheckCircle2, XCircle, Settings, Edit, User, Hash } from "lucide-react";

interface CourseHeaderProps {
  courseData: CourseData;
  onEditCourse: () => void;
}

export default function CourseHeader({ courseData, onEditCourse }: CourseHeaderProps) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
      <div className="p-6">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="text-2xl font-semibold text-gray-900">
                {courseData.title}
              </h1>
              <div
                className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: courseData.isActive ? "#10b981" : "#6b7280" }}
              >
                {courseData.isActive ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {courseData.isActive ? "Activo" : "Inactivo"}
              </div>
              {courseData.isInDevelopment && (
                <div className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300">
                  <Settings className="w-3 h-3" />
                  En Desarrollo
                </div>
              )}
            </div>
            <p className="text-gray-600 text-base leading-relaxed mb-4 max-w-4xl">
              {courseData.about}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Hash className="w-3.5 h-3.5" />
                <span>ID: {courseData.id}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <User className="w-3.5 h-3.5" />
                <span>Admin: {courseData.adminId}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onEditCourse}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar Curso
          </button>
        </div>
      </div>
    </div>
  );
}
