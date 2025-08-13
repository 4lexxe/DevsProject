import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BookCopy, ChevronDown, ChevronUp, } from "lucide-react";
import ContentViewer from "./ContentViewer";
const SectionModule = ({ section }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (_jsxs("div", { className: "bg-slate-50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-300", children: [_jsxs("div", { className: "cursor-pointer relative", onClick: () => setIsExpanded(!isExpanded), children: [_jsx("div", { className: "relative", children: _jsxs("div", { className: "relative h-24 w-full", children: [_jsx("div", { className: "absolute inset-0 bg-cover bg-center", style: {
                                        backgroundImage: `url(${section.coverImage ||
                                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"})`,
                                    } }), _jsx("div", { className: "absolute inset-0", style: {
                                        background: `linear-gradient(to right, 
                ${section.colorGradient[0]}cc, 
                ${section.colorGradient[1]}cc)`,
                                    } }), _jsx("div", { className: "absolute -bottom-6 left-6", children: _jsx("div", { className: "bg-white p-3 rounded-lg shadow-md", children: _jsx(BookCopy, {}) }) })] }) }), _jsxs("div", { className: "p-6 pt-8", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 mb-3", children: section.moduleType }), isExpanded ? (_jsx(ChevronUp, { className: "w-5 h-5 text-gray-500" })) : (_jsx(ChevronDown, { className: "w-5 h-5 text-gray-500" }))] }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: section.title }), _jsx("p", { className: "text-gray-600 mb-4 line-clamp-2", children: section.description })] })] }), isExpanded && (_jsx("div", { className: "border-t border-gray-100 py-6", children: _jsx("div", { className: "space-y-4", children: section.contents &&
                        section.contents.map((content) => (_jsx(ContentViewer, { courseId: section.courseId, content: content }, content.id))) }) }))] }));
};
export default SectionModule;
