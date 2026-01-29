import { CourseData } from "../../interfaces/CourseDetail";
import { Settings, Hash, CheckCircle2, XCircle, Calendar, Cog } from "lucide-react";

interface TechnicalInfoProps {
  courseData: CourseData;
  formatDate: (dateString: string) => string;
}

export default function TechnicalInfo({ courseData, formatDate }: TechnicalInfoProps) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Datos Técnicos y Metadatos
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-gray-500" />
              <h4 className="font-semibold text-gray-900">
                Identificadores
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Course ID:</span>
                <span className="font-mono text-gray-900 font-medium">{courseData.id}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Admin ID:</span>
                <span className="font-mono text-gray-900 font-medium">{courseData.adminId}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-gray-600">Career Type ID:</span>
                <span className="font-mono text-gray-900 font-medium">{courseData.careerTypeId}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-gray-500" />
              <h4 className="font-semibold text-gray-900">
                Estados y Configuración
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Activo:</span>
                <div className="flex items-center gap-1.5">
                  {courseData.isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-medium ${courseData.isActive ? "text-green-600" : "text-red-600"}`}>
                    {courseData.isActive ? "SÍ" : "NO"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-gray-600">En Desarrollo:</span>
                <div className="flex items-center gap-1.5">
                  {courseData.isInDevelopment ? (
                    <Cog className="w-4 h-4 text-gray-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`font-medium ${courseData.isInDevelopment ? "text-gray-600" : "text-green-600"}`}>
                    {courseData.isInDevelopment ? "SÍ" : "NO"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-gray-600">Prerrequisitos:</span>
                <span className="text-gray-900 font-medium">{courseData.prerequisites?.length || 0} definidos</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <h4 className="font-semibold text-gray-900">
                Timestamps
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Creado:</span>
                <span className="text-gray-900 font-medium">{formatDate(courseData.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-gray-600">Actualizado:</span>
                <span className="text-gray-900 font-medium">{formatDate(courseData.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
