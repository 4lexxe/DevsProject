import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X } from 'lucide-react';
import { CourseSearchService } from '@/course/services/searchService';
import { motion, AnimatePresence } from 'framer-motion';
export default function MobileSearchOverlay({ isOpen, onClose, placeholder = "Buscar cursos...", onSearch }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    // Auto-focus cuando se abre
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);
    // Debounce para las sugerencias
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true);
                try {
                    const results = await CourseSearchService.getSuggestions(query);
                    setSuggestions(results);
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
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);
    // Reset selected suggestion when suggestions change
    useEffect(() => {
        setSelectedSuggestionIndex(-1);
    }, [suggestions]);
    const handleSearch = (searchQuery) => {
        if (searchQuery.trim()) {
            if (onSearch) {
                onSearch(searchQuery);
            }
            else {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
            onClose();
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
            handleSearch(suggestions[selectedSuggestionIndex]);
        }
        else {
            handleSearch(query);
        }
    };
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };
    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setSelectedSuggestionIndex(-1);
    };
    const handleKeyDown = (e) => {
        if (suggestions.length === 0)
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
            case 'Enter':
                if (selectedSuggestionIndex >= 0) {
                    e.preventDefault();
                    const selectedSuggestion = suggestions[selectedSuggestionIndex];
                    setQuery(selectedSuggestion);
                    handleSearch(selectedSuggestion);
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    };
    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.focus();
    };
    if (!isOpen)
        return null;
    return (_jsx(AnimatePresence, { children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, className: "fixed inset-0 bg-white z-[60] flex flex-col", children: [_jsxs(motion.div, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.1 }, className: "flex items-center px-4 py-3 border-b border-gray-200 bg-white", children: [_jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-full mr-2 transition-colors", children: _jsx(ArrowLeft, { className: "h-6 w-6 text-gray-600" }) }), _jsx("form", { onSubmit: handleSubmit, className: "flex-1 relative", children: _jsxs("div", { className: "relative", children: [_jsx("input", { ref: inputRef, type: "text", value: query, onChange: handleInputChange, onKeyDown: handleKeyDown, placeholder: placeholder, className: "w-full pl-4 pr-10 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" }), query && (_jsx("button", { type: "button", onClick: handleClear, className: "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(X, { className: "h-5 w-5 text-gray-400" }) }))] }) })] }), _jsxs(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 }, className: "flex-1 overflow-y-auto bg-gray-50", children: [isLoading && (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2" }), _jsx("span", { className: "text-gray-600", children: "Buscando sugerencias..." })] })), !isLoading && suggestions.length > 0 && (_jsxs("div", { className: "bg-white", children: [_jsx("div", { className: "px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100", children: "Sugerencias" }), suggestions.map((suggestion, index) => (_jsx("button", { onClick: () => handleSuggestionClick(suggestion), className: `w-full px-4 py-4 text-left border-b border-gray-100 transition-colors ${selectedSuggestionIndex === index
                                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                        : 'hover:bg-gray-50'}`, children: _jsxs("div", { className: "flex items-center", children: [_jsx(Search, { className: `h-5 w-5 mr-3 ${selectedSuggestionIndex === index ? 'text-blue-500' : 'text-gray-400'}` }), _jsx("span", { className: `text-base ${selectedSuggestionIndex === index ? 'text-blue-700 font-medium' : 'text-gray-700'}`, children: suggestion })] }) }, index)))] })), !isLoading && query.length >= 2 && suggestions.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-gray-500", children: [_jsx(Search, { className: "h-12 w-12 mb-4 text-gray-300" }), _jsx("p", { className: "text-lg font-medium mb-2", children: "No se encontraron sugerencias" }), _jsx("p", { className: "text-sm text-center px-4", children: "Intenta con otros t\u00E9rminos de b\u00FAsqueda" })] })), query.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-gray-500", children: [_jsx(Search, { className: "h-16 w-16 mb-4 text-gray-300" }), _jsx("p", { className: "text-xl font-medium mb-2", children: "\u00BFQu\u00E9 quieres aprender?" }), _jsx("p", { className: "text-sm text-center px-4", children: "Busca cursos, recursos y m\u00E1s contenido educativo" })] }))] })] }) }));
}
