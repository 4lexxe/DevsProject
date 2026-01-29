import { CourseData } from "../../interfaces/CourseDetail";
import { Folder, GraduationCap, CheckCircle2, XCircle, Hash, Calendar } from "lucide-react";

interface CategoriesAndCareerProps {
  courseData: CourseData;
  formatDate: (dateString: string) => string;
}

export default function CategoriesAndCareer({ courseData, formatDate }: CategoriesAndCareerProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Categorías */}
      <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Categorías Asignadas ({courseData.categories.length})
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {courseData.categories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Folder className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold text-base text-gray-900">
                        {category.name}
                      </h4>
                      <div
                        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: category.isActive ? "#10b981" : "#6b7280" }}
                      >
                        {category.isActive ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {category.isActive ? "Activa" : "Inactiva"}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{category.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        <span>ID: {category.id}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(category.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tipo de carrera */}
      <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Carrera Asociada
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white">
            <GraduationCap className="w-6 h-6 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {courseData.careerType.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">{courseData.careerType.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Hash className="w-3 h-3" />
                <span>ID: {courseData.careerTypeId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
