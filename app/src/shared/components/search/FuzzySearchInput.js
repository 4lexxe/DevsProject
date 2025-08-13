import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Brain, Settings, Clock, TrendingUp } from 'lucide-react';
import { CourseSearchService } from '@/course/services/searchService';
const searchModes = [
    {
        id: 'traditional',
        name: 'Tradicional',
        description: 'Búsqueda exacta y rápida',
        icon: _jsx(Search, { className: "w-4 h-4" }),
        color: 'text-gray-600'
    },
    {
        id: 'intelligent',
        name: 'Inteligente',
        description: 'Trie + Levenshtein para mejor precisión',
        icon: _jsx(Brain, { className: "w-4 h-4" }),
        color: 'text-blue-600'
    },
    {
        id: 'fuzzy',
        name: 'Fuzzy',
        description: 'Corrección de errores tipográficos',
        icon: _jsx(Zap, { className: "w-4 h-4" }),
        color: 'text-purple-600'
    }
];
export default function FuzzySearchInput({ placeholder = "Buscar cursos (prueba con errores: 'javascrpt', 'phyton')...", onSearch, className = "", showModeSelector = true, defaultMode = 'fuzzy' }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedMode, setSelectedMode] = useState(searchModes.find(mode => mode.id === defaultMode) || searchModes[2]);
    const [showModeDropdown, setShowModeDropdown] = useState(false);
    const [searchStats, setSearchStats] = useState(null);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const modeDropdownRef = useRef(null);
    // Obtener estadísticas de búsqueda al cargar
    useEffect(() => {
        const loadStats = async () => {
            try {
                const stats = await CourseSearchService.getStatistics();
                setSearchStats(stats);
            }
            catch (error) {
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
                    let results = [];
                    if (selectedMode.id === 'fuzzy') {
                        // Usar sugerencias fuzzy mejoradas
                        results = await CourseSearchService.getFuzzySuggestions(query);
                    }
                    else {
                        // Usar sugerencias tradicionales
                        results = await CourseSearchService.getSuggestions(query);
                    }
                    setSuggestions(results);
                    if (isFocused) {
                        setShowSuggestions(true);
                    }
                    setSelectedSuggestionIndex(-1); // Reset selection when suggestions change
                }
                catch (error) {
                    console.error('Error al obtener sugerencias:', error);
                    setSuggestions([]);
                }
                finally {
                    setIsLoading(false);
                }
            }
            else {
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
        const handleClickOutside = (event) => {
            if (suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (modeDropdownRef.current &&
                !modeDropdownRef.current.contains(event.target)) {
                setShowModeDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSearch = (searchQuery) => {
        if (searchQuery.trim()) {
            if (onSearch) {
                onSearch(searchQuery, selectedMode);
            }
            else {
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
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch(query);
    };
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };
    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setSelectedSuggestionIndex(-1); // Reset selection when typing
    };
    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0)
            return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
                break;
            case 'Tab':
                if (showSuggestions && suggestions.length > 0) {
                    e.preventDefault();
                    setSelectedSuggestionIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
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
    const handleBlur = (e) => {
        // No cerrar sugerencias si el foco se mueve a una sugerencia
        if (suggestionsRef.current && suggestionsRef.current.contains(e.relatedTarget)) {
            return;
        }
        setIsFocused(false);
        // Solo cerrar si no hay query o después de un delay más largo
        setTimeout(() => {
            // Verificar si el input sigue sin foco y no hay interacción
            if (!inputRef.current?.matches(':focus') && !query.trim()) {
                setShowSuggestions(false);
                setSelectedSuggestionIndex(-1);
            }
            else if (!inputRef.current?.matches(':focus')) {
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
    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
        setShowModeDropdown(false);
        // Limpiar sugerencias para recargar con el nuevo modo
        setSuggestions([]);
    };
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsx("form", { onSubmit: handleSubmit, className: "relative", children: _jsxs("div", { className: "flex", children: [showModeSelector && (_jsxs("div", { className: "relative", ref: modeDropdownRef, children: [_jsxs("button", { type: "button", onClick: () => setShowModeDropdown(!showModeDropdown), className: `flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${isFocused ? 'border-blue-500' : 'border-gray-300'}`, children: [_jsx("span", { className: selectedMode.color, children: selectedMode.icon }), _jsx(Settings, { className: "w-3 h-3 ml-1 text-gray-400" })] }), showModeDropdown && (_jsxs("div", { className: "absolute z-50 top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg", children: [_jsxs("div", { className: "p-2", children: [_jsx("div", { className: "text-xs font-medium text-gray-500 mb-2", children: "Modo de B\u00FAsqueda" }), searchModes.map((mode) => (_jsxs("button", { onClick: () => handleModeSelect(mode), className: `w-full flex items-start p-2 rounded-md hover:bg-gray-50 transition-colors ${selectedMode.id === mode.id ? 'bg-blue-50 border border-blue-200' : ''}`, children: [_jsx("span", { className: `${mode.color} mt-0.5`, children: mode.icon }), _jsxs("div", { className: "ml-2 text-left", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: mode.name }), _jsx("div", { className: "text-xs text-gray-500", children: mode.description })] })] }, mode.id)))] }), searchStats && (_jsxs("div", { className: "border-t border-gray-200 p-2", children: [_jsx("div", { className: "text-xs font-medium text-gray-500 mb-1", children: "Estad\u00EDsticas" }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-600", children: [_jsxs("span", { className: "flex items-center", children: [_jsx(TrendingUp, { className: "w-3 h-3 mr-1" }), searchStats.totalSearches || 0, " b\u00FAsquedas"] }), _jsxs("span", { className: "flex items-center", children: [_jsx(Clock, { className: "w-3 h-3 mr-1" }), "~", searchStats.avgSearchTime || 0, "ms"] })] })] }))] }))] })), _jsxs("div", { className: "relative flex-1", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: `h-5 w-5 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}` }) }), _jsx("input", { ref: inputRef, type: "text", value: query, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, className: `block w-full pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${showModeSelector ? 'rounded-r-lg' : 'rounded-lg'} ${isFocused ? 'border-blue-500' : 'border-gray-300'}` }), _jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: _jsxs("div", { className: `flex items-center space-x-1 text-xs ${selectedMode.color}`, children: [selectedMode.icon, _jsx("span", { className: "hidden sm:inline", children: selectedMode.name })] }) })] })] }) }), showSuggestions && (suggestions.length > 0 || isLoading) && (_jsx("div", { ref: suggestionsRef, className: "absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto", children: isLoading ? (_jsxs("div", { className: "px-4 py-3 text-sm text-gray-500 flex items-center", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" }), selectedMode.id === 'fuzzy' ? 'Corrigiendo errores...' : 'Buscando sugerencias...'] })) : (_jsxs(_Fragment, { children: [selectedMode.id === 'fuzzy' && suggestions.length > 0 && (_jsxs("div", { className: "px-4 py-2 text-xs text-purple-600 bg-purple-50 border-b border-purple-100", children: [_jsx(Zap, { className: "w-3 h-3 inline mr-1" }), "Sugerencias con correcci\u00F3n de errores"] })), suggestions.map((suggestion, index) => {
                            const isSelected = selectedSuggestionIndex === index;
                            return (_jsx("button", { onClick: () => handleSuggestionClick(suggestion), onMouseDown: (e) => e.preventDefault(), className: `w-full px-4 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg focus:outline-none ${isSelected
                                    ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500'
                                    : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'}`, children: _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: isSelected ? 'text-blue-600' : selectedMode.color, children: selectedMode.icon }), _jsx("span", { className: "ml-2", children: suggestion }), selectedMode.id === 'fuzzy' && query !== suggestion && (_jsx("span", { className: `ml-auto text-xs ${isSelected ? 'text-blue-500' : 'text-purple-500'}`, children: "corregido" }))] }) }, index));
                        })] })) }))] }));
}
