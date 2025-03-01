import React, { useState } from 'react';
import { HeaderSection } from '../../services/headerSectionServices';
import { Edit2, Trash2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

interface HeaderSectionListProps {
  headerSections: HeaderSection[];
  onEdit: (headerSection: HeaderSection) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const HeaderSectionList: React.FC<HeaderSectionListProps> = ({
  headerSections,
  onEdit,
  onDelete,
  loading
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  if (headerSections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay secciones disponibles</h3>
        <p className="text-sm text-gray-500 max-w-md">
          Crea tu primera sección de encabezado para mostrarla en el carrusel principal de la página de inicio.
        </p>
      </div>
    );
  }

  // Calcular altura dinámica basada en la cantidad de secciones
  const getTableHeight = () => {
    const baseHeight = 80; // Altura mínima en píxeles (reducida)
    const rowHeight = 65; // Altura aproximada de cada fila en píxeles (reducida)
    const maxHeight = 400; // Altura máxima en píxeles (reducida)
    
    // Si hay pocas secciones, usar altura exacta
    if (headerSections.length <= 3) {
      return baseHeight + (headerSections.length * rowHeight);
    }
    
    // Para más secciones, usar altura máxima
    return Math.min(baseHeight + (headerSections.length * rowHeight), maxHeight);
  };

  return (
    <div className="space-y-6">
      {/* Vista para móviles (tarjetas) */}
      <div className="lg:hidden space-y-4">
        {headerSections.map((section) => (
          <div 
            key={section.id} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-32 bg-gray-200">
              <img 
                className="absolute inset-0 w-full h-full object-cover" 
                src={section.image} 
                alt={section.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold truncate">{section.title}</h3>
                <p className="text-white/80 text-sm truncate">{section.slogan}</p>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 truncate">
                  {section.about.length > 50 ? `${section.about.substring(0, 50)}...` : section.about}
                </p>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(section)}
                  disabled={loading}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Editar"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => section.id && onDelete(section.id)}
                  disabled={loading}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Vista para escritorio (tabla) */}
      <div className="hidden lg:block overflow-hidden">
        <div 
          className="overflow-x-auto overflow-y-auto border border-gray-200 rounded-lg"
          style={{ maxHeight: `${getTableHeight()}px` }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Slogan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {headerSections.map((section) => {
                const isExpanded = expandedRows[section.id || ''];
                
                return (
                  <tr key={section.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => onEdit(section)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => section.id && onDelete(section.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                          <img 
                            className="h-full w-full object-cover" 
                            src={section.image} 
                            alt={section.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x48?text=No+disponible';
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleRowExpand(section.id || '')}
                        className="flex items-center text-left focus:outline-none group"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex items-center">
                            {isExpanded ? section.title : truncateText(section.title, 15)}
                            {section.title.length > 15 && (
                              isExpanded ? 
                                <ChevronUp className="h-4 w-4 ml-1 text-gray-400" /> : 
                                <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 md:hidden">
                            {isExpanded ? section.slogan : truncateText(section.slogan, 20)}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <button 
                        onClick={() => toggleRowExpand(section.id || '')}
                        className="text-left focus:outline-none group"
                      >
                        <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors flex items-center">
                          {isExpanded ? section.slogan : truncateText(section.slogan, 20)}
                          {section.slogan.length > 20 && (
                            isExpanded ? 
                              <ChevronUp className="h-4 w-4 ml-1 text-gray-400" /> : 
                              <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <button 
                        onClick={() => toggleRowExpand(section.id || '')}
                        className="text-left focus:outline-none group"
                      >
                        <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors flex items-center">
                          {isExpanded ? (
                            <span className="whitespace-normal">{section.about}</span>
                          ) : (
                            <span className="truncate max-w-xs inline-block">{truncateText(section.about, 30)}</span>
                          )}
                          {section.about.length > 30 && (
                            isExpanded ? 
                              <ChevronUp className="h-4 w-4 ml-1 text-gray-400 flex-shrink-0" /> : 
                              <ChevronDown className="h-4 w-4 ml-1 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    </td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HeaderSectionList; 