import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, Link as LinkIcon, Image as ImageIcon, Video as VideoIcon, } from 'lucide-react';
const ResourceTypeSelector = ({ type, onChange }) => {
    const getResourceIcon = (type) => {
        const iconProps = { className: "w-5 h-5" };
        switch (type) {
            case 'video':
                return _jsx(VideoIcon, { ...iconProps });
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
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: "type", className: "block text-sm font-medium text-gray-700", children: "Tipo de Recurso *" }), _jsx("div", { className: "mt-1 flex items-center gap-4", children: _jsxs("div", { className: "flex items-center", children: [getResourceIcon(type), _jsxs("select", { id: "type", name: "type", value: type, onChange: onChange, className: "ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", children: [_jsx("option", { value: "video", children: "Video" }), _jsx("option", { value: "document", children: "Documento" }), _jsx("option", { value: "image", children: "Imagen" }), _jsx("option", { value: "link", children: "Enlace" })] })] }) })] }));
};
export default ResourceTypeSelector;
