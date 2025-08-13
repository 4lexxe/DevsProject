import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, ArrowLeft, BookOpen, FileText, Video, Image, Download } from "lucide-react";
import MarkdownPreview from "./MarkdownPreview";
import SecureVideoPlayer from "./SecureVideoPlayer";
import { Link } from "react-router-dom";
function ContentDetail({ content, courseId }) {
    // Función para obtener el icono según el tipo de archivo
    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'video':
                return _jsx(Video, { className: "w-5 h-5 text-red-600" });
            case 'pdf':
                return _jsx(FileText, { className: "w-5 h-5 text-red-600" });
            case 'presentation':
                return _jsx(FileText, { className: "w-5 h-5 text-orange-600" });
            case 'image':
                return _jsx(Image, { className: "w-5 h-5 text-green-600" });
            default:
                return _jsx(FileText, { className: "w-5 h-5 text-gray-600" });
        }
    };
    // Función para formatear el tamaño del archivo
    const formatFileSize = (bytes) => {
        const size = parseInt(bytes);
        if (size < 1024)
            return `${size} B`;
        if (size < 1024 * 1024)
            return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };
    // Función para renderizar la vista previa según el tipo
    const renderFilePreview = (file) => {
        switch (file.fileType) {
            case 'video':
                return (_jsx("div", { className: "aspect-video bg-gray-100 rounded-lg overflow-hidden", children: _jsx(SecureVideoPlayer, { contentFileId: file.id, title: file.originalName, className: "w-full h-full", onError: (error) => {
                            console.error('Error en reproductor de video:', error);
                        } }) }));
            case 'pdf':
                return (_jsx("div", { className: "aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden", children: _jsx("iframe", { src: file.drivePreviewLink, className: "w-full h-full border-0", title: file.originalName }) }));
            case 'presentation':
                return (_jsx("div", { className: "aspect-video bg-gray-100 rounded-lg overflow-hidden", children: _jsx("iframe", { src: file.drivePreviewLink, className: "w-full h-full border-0", title: file.originalName, allowFullScreen: true }) }));
            case 'image':
                return (_jsx("div", { className: "aspect-video bg-gray-100 rounded-lg overflow-hidden", children: file.thumbnailLink ? (_jsx("img", { src: file.thumbnailLink, alt: file.originalName, className: "w-full h-full object-contain" })) : (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Image, { className: "w-16 h-16 text-gray-400" }) })) }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg border overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-cyan-600 to-blue-900 p-6 text-white", children: [_jsx("h1", { className: "text-3xl font-bold mb-4", children: content.title }), _jsxs("div", { className: "flex items-center text-sm", children: [_jsx(Clock, { className: "w-4 h-4 mr-2" }), _jsxs("span", { children: [content.duration, " minutos"] })] })] }), _jsxs("div", { className: "p-6", children: [_jsx("p", { className: "text-slate-700 mb-6 text-lg leading-relaxed", children: content.text }), content.resources && content.resources.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent", children: "Recursos adicionales" }), _jsx("div", { className: "grid gap-4", children: content.resources.map((resource, index) => (_jsx("a", { href: resource.url, target: "_blank", rel: "noopener noreferrer", className: "p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 hover:from-cyan-50 hover:to-slate-100 transition-all duration-300 flex items-center group", children: _jsx("span", { className: "text-slate-800 group-hover:text-cyan-900 transition-colors", children: resource.title }) }, index))) })] })), content.files && content.files.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent", children: "Archivos del contenido" }), _jsx("div", { className: "grid gap-6", children: content.files.map((file) => (_jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [getFileIcon(file.fileType), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-slate-800", children: file.originalName }), _jsx("p", { className: "text-sm text-slate-600", children: file.fileType.toUpperCase() })] })] }), file.allowDownload && file.driveWebContentLink && (_jsxs("a", { href: file.driveWebContentLink, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-4 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Descargar" })] }))] }), ['video', 'pdf', 'presentation', 'image'].includes(file.fileType) && (_jsx("div", { className: "mt-4", children: renderFilePreview(file) })), file.description && (_jsx("p", { className: "mt-4 text-slate-700 text-sm", children: file.description }))] }, file.id))) })] })), content.markdown && (_jsx("div", { className: "mt-8", children: _jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent", children: "Contenido Detallado" }), _jsx(MarkdownPreview, { markdown: content.markdown })] }) })), content.quiz && content.quiz.length > 0 && (_jsx("div", { className: "mt-8", children: _jsxs(Link, { to: `/course/section/content/${content.id}/quiz`, className: "w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl", children: [_jsx(BookOpen, { className: "w-6 h-6" }), _jsx("span", { className: "text-lg font-semibold", children: "Comenzar Quiz" })] }) }))] }), _jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 flex justify-between items-center", children: [_jsxs("p", { className: "text-sm text-slate-600", children: ["\u00DAltima actualizaci\u00F3n:", " ", new Date(content.updatedAt).toLocaleDateString()] }), _jsxs(Link, { to: `/course/${courseId}`, className: "inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300 shadow-md hover:shadow-lg", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), _jsx("span", { children: "Volver al Inicio" })] })] })] }));
}
export default ContentDetail;
