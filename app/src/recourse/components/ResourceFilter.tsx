import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Calendar, Clock, FileText, Link as LinkIcon, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

// Tipos de filtros disponibles
export interface ResourceFilters {
  types: string[];
  dateRange: {
    from: string | null;
    to: string | null;
  };
  searchTerm: string;
}

interface ResourceFilterProps {
  onFilterChange: (filters: ResourceFilters) => void;
  className?: string;
}

const ResourceFilter: React.FC<ResourceFilterProps> = ({ onFilterChange, className = '' }) => {
  // Estado para controlar la visibilidad del filtro en móviles
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Estado para los filtros
  const [filters, setFilters] = useState<ResourceFilters>({
    types: [],
    dateRange: {
      from: null,
      to: null
    },
    searchTerm: ''
  });

  // Estado para controlar qué secciones están expandidas
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    date: true
  });

  // Manejar cambios en los tipos de recursos
  const handleTypeChange = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    const newFilters = {
      ...filters,
      types: newTypes
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Manejar cambios en el rango de fechas
  const handleDateChange = (field: 'from' | 'to', value: string) => {
    const newFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value || null
      }
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Manejar cambios en el término de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      searchTerm: e.target.value
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    const newFilters = {
      types: [],
      dateRange: {
        from: null,
        to: null
      },
      searchTerm: ''
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Alternar la visibilidad de una sección
  const toggleSection = (section: 'type' | 'date') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = filters.types.length > 0 || 
                          filters.dateRange.from !== null || 
                          filters.dateRange.to !== null ||
                          filters.searchTerm.trim() !== '';

  return (
    <div className={`${className}`}>
      {/* Botón para mostrar/ocultar filtros en móviles */}
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50"
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium text-white bg-blue-600 rounded-full">
            {filters.types.length + (filters.dateRange.from ? 1 : 0) + (filters.dateRange.to ? 1 : 0) + (filters.searchTerm ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Contenedor principal de filtros */}
      <div className={`
        bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300
        ${isFilterVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100'}
      `}>
        <div className="p-4">
          {/* Cabecera del filtro */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              Filtros
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
          </div>

          {/* Búsqueda */}
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar por título..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sección de tipos de recursos */}
          <div className="mb-4 border-t border-gray-100 pt-4">
            <button
              onClick={() => toggleSection('type')}
              className="flex justify-between items-center w-full text-left mb-2"
            >
              <span className="text-sm font-medium text-gray-700">Tipo de recurso</span>
              {expandedSections.type ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.type && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="type-video"
                    type="checkbox"
                    checked={filters.types.includes('video')}
                    onChange={() => handleTypeChange('video')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="type-video" className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                    <VideoIcon className="w-4 h-4 text-gray-500" />
                    Video
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="type-document"
                    type="checkbox"
                    checked={filters.types.includes('document')}
                    onChange={() => handleTypeChange('document')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="type-document" className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                    <FileText className="w-4 h-4 text-gray-500" />
                    Documento
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="type-image"
                    type="checkbox"
                    checked={filters.types.includes('image')}
                    onChange={() => handleTypeChange('image')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="type-image" className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    Imagen
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="type-link"
                    type="checkbox"
                    checked={filters.types.includes('link')}
                    onChange={() => handleTypeChange('link')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="type-link" className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                    <LinkIcon className="w-4 h-4 text-gray-500" />
                    Enlace
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Sección de rango de fechas */}
          <div className="mb-4 border-t border-gray-100 pt-4">
            <button
              onClick={() => toggleSection('date')}
              className="flex justify-between items-center w-full text-left mb-2"
            >
              <span className="text-sm font-medium text-gray-700">Fecha de creación</span>
              {expandedSections.date ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.date && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="date-from" className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Desde
                  </label>
                  <input
                    type="date"
                    id="date-from"
                    value={filters.dateRange.from || ''}
                    onChange={(e) => handleDateChange('from', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="date-to" className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Hasta
                  </label>
                  <input
                    type="date"
                    id="date-to"
                    value={filters.dateRange.to || ''}
                    onChange={(e) => handleDateChange('to', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Resumen de filtros activos */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Filtros activos
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.types.map(type => (
                  <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {type === 'video' && <VideoIcon className="w-3 h-3 mr-1" />}
                    {type === 'document' && <FileText className="w-3 h-3 mr-1" />}
                    {type === 'image' && <ImageIcon className="w-3 h-3 mr-1" />}
                    {type === 'link' && <LinkIcon className="w-3 h-3 mr-1" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                    <button
                      onClick={() => handleTypeChange(type)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {filters.dateRange.from && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Calendar className="w-3 h-3 mr-1" />
                    Desde: {filters.dateRange.from}
                    <button
                      onClick={() => handleDateChange('from', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.dateRange.to && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Calendar className="w-3 h-3 mr-1" />
                    Hasta: {filters.dateRange.to}
                    <button
                      onClick={() => handleDateChange('to', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Búsqueda: {filters.searchTerm}
                    <button
                      onClick={() => {
                        const newFilters = {...filters, searchTerm: ''};
                        setFilters(newFilters);
                        onFilterChange(newFilters);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceFilter; 