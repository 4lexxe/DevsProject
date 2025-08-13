import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/InputFile.tsx
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../shared/api/axios';
const InputFile = ({ value, onChange, error }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(value);
    // Manejar cambios en el campo de archivo
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const MAX_FILE_SIZE = 10 * 1024 * 1024;
                if (file.size > MAX_FILE_SIZE) {
                    toast.error('El archivo es demasiado grande. El límite es de 10MB.');
                    return;
                }
                if (!file.type.startsWith('image/')) {
                    toast.error('Solo se permiten imágenes.');
                    return;
                }
                setIsLoading(true);
                const formData = new FormData();
                formData.append('file', file);
                const response = await api.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data?.url) {
                    setPreviewUrl(response.data.url);
                    onChange(response.data.url);
                }
                else {
                    throw new Error('URL no recibida del servidor');
                }
            }
            catch (error) {
                console.error('Error al subir archivo:', error);
                toast.error('Error al subir el archivo. Por favor, intenta nuevamente.');
            }
            finally {
                setIsLoading(false);
            }
        }
    };
    // Manejar arrastre y soltura
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const event = { target: { files: [file] } };
            handleFileChange(event);
        }
    };
    // Eliminar archivo
    const handleRemove = () => {
        onChange(null); // Limpiar la URL en el padre
        setPreviewUrl(null); // Limpiar la vista previa
    };
    return (_jsxs("div", { className: "w-full max-w-md mx-auto", children: [_jsx("label", { htmlFor: "file", className: "block text-sm font-medium text-gray-700 mb-2", children: "Subir archivo *" }), !previewUrl ? (_jsxs("div", { className: `
            relative rounded-lg border-2 border-dashed
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            transition-all duration-200 ease-in-out
            hover:border-blue-400 hover:bg-blue-50
          `, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, children: [_jsx("input", { type: "file", id: "file", name: "file", accept: "image/*", onChange: handleFileChange, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" }), _jsxs("div", { className: "flex flex-col items-center justify-center px-6 py-8", children: [_jsx(Upload, { className: "w-12 h-12 text-gray-400 mb-3" }), _jsxs("div", { className: "text-center", children: [_jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium text-blue-600 hover:text-blue-500", children: "Haz clic para subir" }), ' ', "o arrastra y suelta"] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Solo im\u00E1genes (m\u00E1x. 10MB)" })] })] })] })) : (_jsx("div", { className: "mt-2 relative", children: _jsx("div", { className: "relative group", children: _jsxs("div", { className: "relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden", children: [_jsx("img", { src: previewUrl, alt: "Preview", className: "w-full h-full object-contain" }), _jsx("div", { className: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center", children: _jsx("button", { onClick: handleRemove, className: "p-2 rounded-full bg-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200", type: "button", children: _jsx(X, { className: "w-5 h-5 text-gray-600" }) }) })] }) }) })), isLoading && (_jsx("p", { className: "mt-2 text-sm text-blue-600", children: "Subiendo archivo..." })), error && (_jsx("p", { className: "mt-2 text-sm text-red-600", children: error }))] }));
};
export default InputFile;
