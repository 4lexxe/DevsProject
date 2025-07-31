import { CourseData } from "../../interfaces/CourseDetail";

interface TechnicalInfoProps {
  courseData: CourseData;
  formatDate: (dateString: string) => string;
}

export default function TechnicalInfo({ courseData, formatDate }: TechnicalInfoProps) {
  return (
    <div className="rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
          Datos Técnicos y Metadatos
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2" style={{ color: "#0c154c" }}>
              Identificadores
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Course ID:</span>
                <span className="font-mono">{courseData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admin ID:</span>
                <span className="font-mono">{courseData.adminId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Career Type ID:</span>
                <span className="font-mono">{courseData.careerTypeId}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: "#0c154c" }}>
              Estados y Configuración
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Activo:</span>
                <span style={{ color: courseData.isActive ? "#42d7c7" : "#ef4444" }}>
                  {courseData.isActive ? "SÍ" : "NO"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En Desarrollo:</span>
                <span style={{ color: courseData.isInDevelopment ? "#02ffff" : "#42d7c7" }}>
                  {courseData.isInDevelopment ? "SÍ" : "NO"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prerrequisitos:</span>
                <span>{courseData.prerequisites || "No definidos"}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: "#0c154c" }}>
              Timestamps
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Creado:</span>
                <span>{formatDate(courseData.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última actualización:</span>
                <span>{formatDate(courseData.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
