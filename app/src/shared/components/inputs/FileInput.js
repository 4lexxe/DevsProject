import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
function FileInput() {
    const [formData, setFormData] = useState({
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, avatar: file }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: "avatar", className: "block text-sm font-medium text-gray-700 mb-1", children: "Avatar" }), _jsxs("div", { className: "mt-1 flex items-center space-x-4", children: [avatarPreview ? (_jsx("img", { src: avatarPreview || "/placeholder.svg", alt: "Avatar preview", className: "w-12 h-12 rounded-full object-cover" })) : (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-12 h-12 text-gray-300", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" }) })), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "avatar", name: "avatar", type: "file", accept: "image/*", className: "sr-only", onChange: handleChange }), _jsx("label", { htmlFor: "avatar", className: "cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500", children: "Elegir archivo" }), formData.avatar && (_jsx("p", { className: "mt-2 text-sm text-gray-500 truncate max-w-xs", children: formData.avatar.name }))] })] })] }));
}
export default FileInput;
