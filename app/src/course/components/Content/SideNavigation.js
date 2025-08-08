import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CircleDot, ChevronRight, ChevronDown } from "lucide-react";
export default function Sidebar({ currentId, navigate, isExpanded: externalIsExpanded, setIsExpanded: setExternalIsExpanded, }) {
    const [internalIsExpanded, setInternalIsExpanded] = useState(true);
    const [expandedSections, setExpandedSections] = useState([]);
    // Use external state if provided, otherwise use internal state
    const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
    const setIsExpanded = setExternalIsExpanded || setInternalIsExpanded;
    // Auto expand section that contains current content
    useEffect(() => {
        navigate.sections.forEach((section) => {
            if (section.contents.some((content) => content.id === currentId)) {
                setExpandedSections((prev) => prev.includes(section.id) ? prev : [...prev, section.id]);
            }
        });
    }, [currentId, navigate.sections]);
    const toggleSection = (sectionId) => {
        setExpandedSections((prev) => prev.includes(sectionId)
            ? prev.filter((id) => id !== sectionId)
            : [...prev, sectionId]);
    };
    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };
    return (_jsxs("div", { className: "p-4 h-full", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "p-2 hover:bg-gray-200 rounded transition-colors duration-300", onClick: toggleSidebar, children: _jsx(ChevronRight, { className: `transform transition-transform duration-500 ${isExpanded ? "" : "rotate-180"}`, size: 20 }) }), _jsx("div", { className: `overflow-hidden transition-all duration-500 ${isExpanded ? "opacity-100" : "opacity-0 max-w-0"}`, children: _jsx("h1", { className: "text-lg font-medium ", children: navigate.title }) })] }), _jsx("div", { className: `space-y-2 transition-all duration-500 overflow-hidden  ${isExpanded ? "opacity-100 " : "opacity-0 max-h-0"}`, children: navigate.sections.map((section) => (_jsxs("div", { className: "rounded-lg bg-gray-200 mt-4", children: [_jsxs("button", { onClick: () => toggleSection(section.id), className: "w-full p-4 flex items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: section.title }), _jsxs("div", { className: "text-sm text-gray-600", children: [section.contents.length, " contenidos"] })] }) }), _jsx("div", { className: "flex items-center gap-2", children: _jsx(ChevronDown, { size: 20, className: `transition-transform ${expandedSections.includes(section.id) ? "rotate-180" : ""}` }) })] }), _jsx("div", { className: `px-4 transition-all duration-400 overflow-hidden ${expandedSections.includes(section.id)
                                ? "max-h-96 opacity-100 pb-4"
                                : "max-h-0 opacity-0 pb-0"}`, children: section.contents.map((content) => (_jsx(Link, { to: `/course/${navigate.id}/section/content/${content.id}`, className: "w-full", children: _jsxs("div", { className: `flex items-center gap-2 p-2 rounded ${currentId === content.id
                                        ? "bg-gray-300"
                                        : "hover:bg-gray-300"}`, children: [currentId === content.id && (_jsx(CircleDot, { className: "w-5 h-5 text-cyan-600 ml-2" })), _jsx("span", { className: `font-medium ${currentId === content.id ? "font-bold" : ""}`, children: content.title })] }) }, content.id))) })] }, section.id))) })] }));
}
