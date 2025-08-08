import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FileText, } from "lucide-react";
import { Link } from "react-router-dom";
const ContentViewer = ({ content, courseId }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };
    const renderSectionHeader = (icon, title, duration) => (_jsx(Link, { to: `/course/${courseId}/section/content/${content.id}`, children: _jsx("div", { className: "flex items-center justify-between w-full", children: _jsxs("div", { className: "flex items-center gap-2", children: [icon, _jsx("span", { className: "font-medium", children: title }), duration && (_jsxs("span", { className: "text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full ml-2", children: [duration, " min"] }))] }) }) }));
    return (_jsx("div", { className: "space-y-4 w-full max-w-3xl mx-auto", children: content.title && (_jsx("div", { className: " rounded-lg overflow-hidden", children: _jsx("button", { className: "w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors", onClick: () => toggleSection("text"), children: renderSectionHeader(_jsx(FileText, { className: "w-5 h-5 text-blue-600 flex-shrink-0" }), content.title || "Content Description", content.duration) }) })) }));
};
export default ContentViewer;
