import { Clock, Plus, Settings } from "lucide-react";
import { Section } from "../../interfaces/CourseDetail";

interface SectionsGridProps {
  sections: Section[];
  onCreateSection: () => void;
  onSectionClick: (sectionId: string) => void;
  onEditSection: (e: React.MouseEvent, sectionId: string) => void;
  formatDate: (dateString: string) => string;
  getModuleTypeBg: (type: string) => string;
}

export default function SectionsGrid({ 
  sections, 
  onCreateSection, 
  onSectionClick, 
  onEditSection, 
  formatDate, 
  getModuleTypeBg 
}: SectionsGridProps) {
  return (
    <div className="rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
            <Clock className="h-5 w-5 inline-block mr-2" />
            Módulos/Secciones Configuradas ({sections.length})
          </h3>
          <button 
            onClick={onCreateSection}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Sección
          </button>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              style={{ borderColor: "#1d4ed8" }}
              onClick={() => onSectionClick(section.id)}
            >
              <div className="flex flex-col lg:flex-row gap-4 mb-3">
                {/* Contenido principal */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: "#1d4ed8" }}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-lg break-words" style={{ color: "#0c154c" }}>
                          {section.title}
                        </h4>
                        <p className="text-gray-600 text-sm break-words">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex-shrink-0 self-start text-white"
                        style={{ backgroundColor: getModuleTypeBg(section.moduleType) }}
                      >
                        {section.moduleType}
                      </div>
                      <button 
                        onClick={(e) => onEditSection(e, section.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                        title="Editar sección"
                      >
                        <Settings className="w-3 h-3" />
                        Editar
                      </button>
                    </div>
                  </div>

                  {/* Información de gradiente */}
                  {section.colorGradient && section.colorGradient.length >= 2 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2" style={{ color: "#0c154c" }}>
                        Gradiente configurado:
                      </h5>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Preview del gradiente */}
                        <div
                          className="w-full sm:w-32 h-8 rounded border flex-shrink-0"
                          style={{
                            background: `linear-gradient(to right, ${section.colorGradient[0]}, ${section.colorGradient[1]})`,
                          }}
                        ></div>
                        {/* Colores individuales */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: section.colorGradient[0] }}
                            ></div>
                            <span className="text-xs font-mono text-gray-600">{section.colorGradient[0]}</span>
                          </div>
                          <span className="text-gray-400">→</span>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: section.colorGradient[1] }}
                            ></div>
                            <span className="text-xs font-mono text-gray-600">{section.colorGradient[1]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadatos técnicos */}
                  <div
                    className="text-xs text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t"
                    style={{ borderColor: "#eff6ff" }}
                  >
                    <span>Sección ID: {section.id}</span>
                    <span>Curso ID: {section.courseId}</span>
                    <span>Creado: {formatDate(section.createdAt)}</span>
                    <span>Actualizado: {formatDate(section.updatedAt)}</span>
                    <span>Cover Image: {section.coverImage ? "Configurada" : "No definida"}</span>
                    <span>Gradiente: {section.colorGradient?.length || 0} colores</span>
                  </div>
                </div>

                {/* Imagen de cover si existe - posicionada a la derecha en desktop */}
                {section.coverImage && (
                  <div className="relative w-full h-32 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden order-first lg:order-last">
                    <img
                      src={section.coverImage || "/placeholder.svg?height=128&width=128&query=section cover"}
                      alt={`Cover de ${section.title}`}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
