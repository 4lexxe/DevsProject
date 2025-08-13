import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PlayCircle, FileText, Code, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
export default function ModuleContent({ content, expandedContent, onToggleContent }) {
    const getIcon = (type) => {
        switch (type) {
            case 'video': return _jsx(PlayCircle, { className: "w-5 h-5 text-blue-600 mt-1" });
            case 'reading': return _jsx(FileText, { className: "w-5 h-5 text-blue-600 mt-1" });
            case 'practice': return _jsx(Code, { className: "w-5 h-5 text-blue-600 mt-1" });
            case 'diagram': return _jsx(ImageIcon, { className: "w-5 h-5 text-blue-600 mt-1" });
            default: return null;
        }
    };
    return (_jsx("div", { className: "space-y-4", children: content.map((item, index) => (_jsx("div", { children: item.expandable ? (_jsxs("div", { className: "flex items-start space-x-3 cursor-pointer", onClick: () => onToggleContent(item.id), children: [getIcon(item.type), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: item.title }), _jsx("p", { className: "text-sm text-gray-600", children: item.duration })] }), expandedContent === item.id ? (_jsx(ChevronUp, { className: "w-5 h-5 text-gray-500" })) : (_jsx(ChevronDown, { className: "w-5 h-5 text-gray-500" }))] }), expandedContent === item.id && item.content && (_jsx("div", { className: "mt-4 p-4 bg-gray-50 rounded-lg text-gray-700", children: item.content }))] })] })) : (_jsxs("div", { className: "flex items-start space-x-3", children: [getIcon(item.type), _jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: item.title }), _jsx("p", { className: "text-sm text-gray-600", children: item.duration })] })] })) }, index))) }));
}
