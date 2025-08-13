import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { ExternalLink, ImageIcon } from 'lucide-react';
const ResourceContent = ({ resource }) => {
    const [isImageError, setIsImageError] = useState(false);
    const isGoogleDriveUrl = (url) => {
        return url.includes('drive.google.com');
    };
    const generateGoogleDriveEmbedUrl = (url) => {
        const fileId = url.split('/d/')[1]?.split('/')[0];
        if (fileId) {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        throw new Error('No se pudo extraer el ID del archivo de Google Drive.');
    };
    const renderContent = () => {
        const isGoogleDriveVideo = isGoogleDriveUrl(resource.url);
        const embedUrl = isGoogleDriveVideo ? generateGoogleDriveEmbedUrl(resource.url) : resource.url;
        switch (resource.type) {
            case 'video':
                return (_jsx("div", { className: "aspect-video w-full rounded-lg overflow-hidden bg-gray-100", children: isGoogleDriveVideo ? (_jsx("iframe", { src: embedUrl, width: "100%", height: "100%", allow: "autoplay", title: "Video Player", className: "rounded-lg" })) : (_jsx(ReactPlayer, { url: embedUrl, width: "100%", height: "100%", controls: true, playing: false, className: "react-player" })) }));
            case 'image':
                return (_jsx("div", { className: "relative rounded-lg overflow-hidden bg-gray-100", children: !isImageError ? (_jsx("img", { src: resource.url, alt: resource.title, className: "w-full h-auto", onError: () => setIsImageError(true) })) : (_jsx("div", { className: "aspect-video w-full flex items-center justify-center bg-gray-100 text-gray-400", children: _jsx(ImageIcon, { className: "w-12 h-12" }) })) }));
            case 'document':
            case 'link':
                return (_jsxs("a", { href: resource.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors", children: [_jsx(ExternalLink, { className: "w-4 h-4 mr-2" }), "Abrir recurso"] }));
        }
    };
    return (_jsx("div", { className: "p-6 border-b border-gray-200", children: renderContent() }));
};
export default ResourceContent;
