import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, EyeOff, Video, FileText, ImageIcon, LinkIcon } from 'lucide-react';
import RatingComponent from '../components/Rating';
const getResourceIcon = (type) => {
    const iconProps = { className: "w-6 h-6" };
    switch (type) {
        case 'video':
            return _jsx(Video, { ...iconProps });
        case 'document':
            return _jsx(FileText, { ...iconProps });
        case 'image':
            return _jsx(ImageIcon, { ...iconProps });
        case 'link':
            return _jsx(LinkIcon, { ...iconProps });
        default:
            return null;
    }
};
const ResourceHeader = ({ resource }) => {
    return (_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx(Link, { to: "/recursos", className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(ArrowLeft, { className: "w-5 h-5 text-gray-600" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 flex-grow", children: resource.title })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx("div", { className: "p-2 rounded-md bg-gray-50 border border-gray-200", children: getResourceIcon(resource.type) }), _jsx("span", { className: "text-sm font-medium capitalize", children: resource.type })] }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Fecha no disponible' })] }), resource.isVisible ? (_jsxs("div", { className: "flex items-center gap-2 text-green-600", children: [_jsx(Eye, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Visible" })] })) : (_jsxs("div", { className: "flex items-center gap-2 text-gray-400", children: [_jsx(EyeOff, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "No visible" })] })), resource.id && _jsx(RatingComponent, { resourceId: resource.id, mode: "interactive" })] })] }));
};
export default ResourceHeader;
