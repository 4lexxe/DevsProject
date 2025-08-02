import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { CourseSearchService } from '@/course/services/searchService';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchInput({ 
  placeholder = "Buscar cursos...", 
  onSearch,
  className = ""
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false);
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Función para obtener sugerencias con debounce mejorado
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await CourseSearchService.getSuggestions(searchQuery);
      // Solo actualizar si el query no ha cambiado mientras esperábamos
      if (searchQuery === query) {
        setSuggestions(results);
        // Solo mostrar si está enfocado Y hay resultados Y no estamos en proceso de búsqueda
        setShowSuggestions(isFocused && results.length > 0);
      }
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      if (searchQuery === query) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } finally {
      if (searchQuery === query) {
        setIsLoading(false);
      }
    }
  }, [query, isFocused]);

  // Debounce para las sugerencias
  useEffect(() => {
    // Limpiar timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Solo buscar si está enfocado para evitar búsquedas innecesarias
    if (isFocused) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      // Si no está enfocado, limpiar sugerencias inmediatamente
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, isFocused, fetchSuggestions]);

  // Reset selected suggestion when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar escape global
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSuggestions) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSuggestions]);

  const handleSearch = useCallback((searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      // Limpiar estado de sugerencias inmediatamente
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      setIsLoading(false);
      
      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
      
      // Desenfocar el input después de un pequeño delay para evitar parpadeos
      setTimeout(() => {
        inputRef.current?.blur();
      }, 100);
    }
  }, [onSearch, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      setQuery(selectedSuggestion);
      handleSearch(selectedSuggestion);
    } else {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Solo actualizar si el valor realmente cambió
    if (newValue !== query) {
      setQuery(newValue);
      setSelectedSuggestionIndex(-1);
      
      // Si el input está vacío, ocultar sugerencias inmediatamente
      if (!newValue.trim()) {
        setShowSuggestions(false);
        setSuggestions([]);
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        if (showSuggestions && suggestions.length > 0) {
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        if (showSuggestions && suggestions.length > 0) {
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        }
        break;
      case 'Enter':
        // El manejo del Enter se hace en handleSubmit para mejor control
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        // Permitir navegación con Tab
        if (showSuggestions) {
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
        }
        break;
      // Las flechas izquierda/derecha no se interceptan, permitiendo navegación normal en el texto
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setSelectedSuggestionIndex(-1);
    // No mostrar sugerencias inmediatamente al hacer focus para evitar parpadeos
    // Las sugerencias se mostrarán cuando se complete la búsqueda en fetchSuggestions
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Solo ocultar si no estamos sobre las sugerencias
    if (!isMouseOverSuggestions) {
      setTimeout(() => {
        if (!inputRef.current?.matches(':focus') && !isMouseOverSuggestions) {
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
        }
      }, 150);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </form>

      {/* Sugerencias estilo YouTube */}
      {isFocused && showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto"
          onMouseEnter={() => setIsMouseOverSuggestions(true)}
          onMouseLeave={() => setIsMouseOverSuggestions(false)}
        >
          {isLoading ? (
            <div className="flex items-center px-4 py-4 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
              Buscando sugerencias...
            </div>
          ) : (
            <>
              {suggestions.length > 0 && (
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      className={`w-full px-4 py-3 text-left text-sm focus:outline-none transition-all duration-150 ${
                        selectedSuggestionIndex === index
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Search className={`h-4 w-4 mr-3 flex-shrink-0 ${
                          selectedSuggestionIndex === index ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                        <span className="truncate font-medium">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              

            </>
          )}
        </div>
      )}
    </div>
  );
}