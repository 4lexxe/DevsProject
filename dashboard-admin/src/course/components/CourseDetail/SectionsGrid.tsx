import { Section } from "../../interfaces/CourseDetail";
import { FolderOpen, Plus, Edit, Trash2, Palette, Hash, Calendar, RefreshCw, Image } from "lucide-react";

interface SectionsGridProps {
  sections: Section[];
  onCreateSection: () => void;
  onSectionClick: (section: Section) => void;
  onEditSection: (e: React.MouseEvent, section: Section) => void;
  onDeleteSection?: (e: React.MouseEvent, sectionId: string) => void;
  formatDate: (dateString: string) => string;
  getModuleTypeBg: (type: string) => string;
}

export default function SectionsGrid({ 
  sections, 
  onCreateSection, 
  onSectionClick, 
  onEditSection, 
  onDeleteSection,
  formatDate, 
  getModuleTypeBg 
}: SectionsGridProps) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Módulos/Secciones ({sections.length})
            </h3>
          </div>
          <button 
            onClick={onCreateSection}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nueva Sección
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white"
              onClick={() => onSectionClick(section)}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Contenido principal */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-blue-600">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-base break-words text-gray-900 mb-1">
                          {section.title}
                        </h4>
                        <p className="text-gray-600 text-sm break-words">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: getModuleTypeBg(section.moduleType) }}
                      >
                        {section.moduleType}
                      </div>
                      <button 
                        onClick={(e) => onEditSection(e, section)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors shadow-sm"
                        title="Editar sección"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      {onDeleteSection && (
                        <button 
                          onClick={(e) => onDeleteSection(e, section.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors shadow-sm"
                          title="Eliminar sección completa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Información de gradiente */}
                  {section.colorGradient && section.colorGradient.length >= 2 && (
                    <div className="mb-3 p-3 rounded-lg border border-gray-200 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-4 h-4 text-gray-500" />
                        <h5 className="text-sm font-semibold text-gray-900">
                          Gradiente configurado
                        </h5>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Preview del gradiente */}
                        <div
                          className="w-full sm:w-32 h-8 rounded border border-gray-300 flex-shrink-0"
                          style={{
                            background: `linear-gradient(to right, ${section.colorGradient[0]}, ${section.colorGradient[1]})`,
                          }}
                        ></div>
                        {/* Colores individuales */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: section.colorGradient[0] }}
                            ></div>
                            <span className="text-xs font-mono text-gray-600">{section.colorGradient[0]}</span>
                          </div>
                          <span className="text-gray-400">→</span>
                          <div className="flex items-center gap-1.5">
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
                  <div className="text-xs text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3 h-3" />
                      <span>ID: {section.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>Creado: {formatDate(section.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3" />
                      <span>Actualizado: {formatDate(section.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Image className="w-3 h-3" />
                      <span>Cover: {section.coverImage ? "Configurada" : "No definida"}</span>
                    </div>
                  </div>
                </div>

                {/* Imagen de cover si existe - posicionada a la derecha en desktop */}
                {section.coverImage && (
                  <div className="relative w-full h-32 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 order-first lg:order-last">
                    <img
                      src={section.coverImage || "/placeholder.svg?height=128&width=128&query=section cover"}
                      alt={`Cover de ${section.title}`}
                      className="object-cover w-full h-full"
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
