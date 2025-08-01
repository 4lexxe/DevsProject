import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Brain, Settings, Clock, TrendingUp } from 'lucide-react';
import { CourseSearchService } from '@/course/services/searchService';

interface SearchMode {
  id: 'traditional' | 'intelligent' | 'fuzzy';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface FuzzySearchInputProps {
  placeholder?: string;
  onSearch?: (query: string, mode: SearchMode) => void;
  className?: string;
  showModeSelector?: boolean;
  defaultMode?: 'traditional' | 'intelligent' | 'fuzzy';
}

const searchModes: SearchMode[] = [
  {
    id: 'traditional',
    name: 'Tradicional',
    description: 'Búsqueda exacta y rápida',
    icon: <Search className="w-4 h-4" />,
    color: 'text-gray-600'
  },
  {
    id: 'intelligent',
    name: 'Inteligente',
    description: 'Trie + Levenshtein para mejor precisión',
    icon: <Brain className="w-4 h-4" />,
    color: 'text-blue-600'
  },
  {
    id: 'fuzzy',
    name: 'Fuzzy',
    description: 'Corrección de errores tipográficos',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-purple-600'
  }
];

export default function FuzzySearchInput({ 
  placeholder = "Buscar cursos (prueba con errores: 'javascrpt', 'phyton')...", 
  onSearch,
  className = "",
  showModeSelector = true,
  defaultMode = 'fuzzy'
}: FuzzySearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMode, setSelectedMode] = useState<SearchMode>(
    searchModes.find(mode => mode.id === defaultMode) || searchModes[2]
  );
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [searchStats, setSearchStats] = useState<any>(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  // Obtener estadísticas de búsqueda al cargar
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await CourseSearchService.getStatistics();
        setSearchStats(stats);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };
    loadStats();
  }, []);

  // Debounce para las sugerencias con modo fuzzy
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          let results: string[] = [];
          
          if (selectedMode.id === 'fuzzy') {
            // Usar sugerencias fuzzy mejoradas
            results = await CourseSearchService.getFuzzySuggestions(query);
          } else {
            // Usar sugerencias tradicionales
            results = await CourseSearchService.getSuggestions(query);
          }
          
          setSuggestions(results);
          if (isFocused) {
            setShowSuggestions(true);
          }
          setSelectedSuggestionIndex(-1); // Reset selection when suggestions change
        } catch (error) {
          console.error('Error al obtener sugerencias:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        // Mantener sugerencias abiertas si el input está enfocado
        if (!isFocused) {
          setShowSuggestions(false);
        }
        setSelectedSuggestionIndex(-1);
      }
    }, selectedMode.id === 'fuzzy' ? 400 : 300); // Más tiempo para fuzzy

    return () => clearTimeout(timeoutId);
  }, [query, selectedMode, isFocused]);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowModeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery, selectedMode);
      } else {
        // Construir URL con parámetros del modo de búsqueda
        const params = new URLSearchParams({
          q: searchQuery,
          ...(selectedMode.id === 'fuzzy' && { useFuzzySearch: 'true', fuzzyThreshold: '0.3' }),
          ...(selectedMode.id === 'intelligent' && { useIntelligentSearch: 'true' })
        });
        navigate(`/search?${params.toString()}`);
      }
      setShowSuggestions(false);
      setShowModeDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedSuggestionIndex(-1); // Reset selection when typing
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Tab':
         if (showSuggestions && suggestions.length > 0) {
           e.preventDefault();
           setSelectedSuggestionIndex(prev => 
             prev < suggestions.length - 1 ? prev + 1 : 0
           );
         }
         break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          const selectedSuggestion = suggestions[selectedSuggestionIndex];
          handleSuggestionClick(selectedSuggestion);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setSelectedSuggestionIndex(-1);
    // Mostrar sugerencias si hay texto o si ya hay sugerencias cargadas
    if (query.length >= 2 || suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // No cerrar sugerencias si el foco se mueve a una sugerencia
    if (suggestionsRef.current && suggestionsRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setIsFocused(false);
    // Solo cerrar si no hay query o después de un delay más largo
    setTimeout(() => {
      // Verificar si el input sigue sin foco y no hay interacción
      if (!inputRef.current?.matches(':focus') && !query.trim()) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      } else if (!inputRef.current?.matches(':focus')) {
        // Si hay texto pero no hay foco, cerrar después de más tiempo
        setTimeout(() => {
          if (!inputRef.current?.matches(':focus')) {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
          }
        }, 500);
      }
    }, 100);
  };

  const handleModeSelect = (mode: SearchMode) => {
    setSelectedMode(mode);
    setShowModeDropdown(false);
    // Limpiar sugerencias para recargar con el nuevo modo
    setSuggestions([]);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex">
          {/* Selector de modo de búsqueda */}
          {showModeSelector && (
            <div className="relative" ref={modeDropdownRef}>
              <button
                type="button"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className={`flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  isFocused ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                <span className={selectedMode.color}>
                  {selectedMode.icon}
                </span>
                <Settings className="w-3 h-3 ml-1 text-gray-400" />
              </button>
              
              {/* Dropdown de modos */}
              {showModeDropdown && (
                <div className="absolute z-50 top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2">Modo de Búsqueda</div>
                    {searchModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => handleModeSelect(mode)}
                        className={`w-full flex items-start p-2 rounded-md hover:bg-gray-50 transition-colors ${
                          selectedMode.id === mode.id ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                      >
                        <span className={`${mode.color} mt-0.5`}>
                          {mode.icon}
                        </span>
                        <div className="ml-2 text-left">
                          <div className="text-sm font-medium text-gray-900">{mode.name}</div>
                          <div className="text-xs text-gray-500">{mode.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Estadísticas */}
                  {searchStats && (
                    <div className="border-t border-gray-200 p-2">
                      <div className="text-xs font-medium text-gray-500 mb-1">Estadísticas</div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {searchStats.totalSearches || 0} búsquedas
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          ~{searchStats.avgSearchTime || 0}ms
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Input de búsqueda */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 transition-colors ${
                isFocused ? 'text-blue-500' : 'text-gray-400'
              }`} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`block w-full pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                showModeSelector ? 'rounded-r-lg' : 'rounded-lg'
              } ${
                isFocused ? 'border-blue-500' : 'border-gray-300'
              }`}
            />
            
            {/* Indicador de modo activo */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className={`flex items-center space-x-1 text-xs ${
                selectedMode.color
              }`}>
                {selectedMode.icon}
                <span className="hidden sm:inline">{selectedMode.name}</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Sugerencias mejoradas */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={suggestionsRef}
          className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              {selectedMode.id === 'fuzzy' ? 'Corrigiendo errores...' : 'Buscando sugerencias...'}
            </div>
          ) : (
            <>
              {selectedMode.id === 'fuzzy' && suggestions.length > 0 && (
                <div className="px-4 py-2 text-xs text-purple-600 bg-purple-50 border-b border-purple-100">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Sugerencias con corrección de errores
                </div>
              )}
              {suggestions.map((suggestion, index) => {
                const isSelected = selectedSuggestionIndex === index;
                return (
                  <button
                     key={index}
                     onClick={() => handleSuggestionClick(suggestion)}
                     onMouseDown={(e) => e.preventDefault()} // Prevenir blur del input
                     className={`w-full px-4 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg focus:outline-none ${
                       isSelected 
                         ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500' 
                         : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
                     }`}
                   >
                    <div className="flex items-center">
                      <span className={isSelected ? 'text-blue-600' : selectedMode.color}>
                        {selectedMode.icon}
                      </span>
                      <span className="ml-2">{suggestion}</span>
                      {selectedMode.id === 'fuzzy' && query !== suggestion && (
                        <span className={`ml-auto text-xs ${
                          isSelected ? 'text-blue-500' : 'text-purple-500'
                        }`}>corregido</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}