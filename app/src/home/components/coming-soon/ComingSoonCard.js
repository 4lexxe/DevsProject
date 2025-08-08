import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookOpen, Briefcase } from "lucide-react";
export function ComingSoonCard({ className = "", imageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070", aspectRatio = "square", title, category, careerType }) {
    const aspectRatioClasses = {
        portrait: "aspect-[3/4]",
        landscape: "aspect-[4/3]",
        square: "aspect-square"
    };
    return (_jsxs("div", { className: `relative overflow-hidden rounded-lg bg-card group ${className}`, children: [_jsxs("div", { className: `${aspectRatioClasses[aspectRatio]} w-full h-full`, children: [_jsx("img", { src: imageUrl, alt: title, className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" })] }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 text-white", children: [_jsxs("div", { className: "flex flex-wrap gap-3 mb-3 text-gray-300 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(BookOpen, { className: "w-4 h-4" }), _jsx("span", { className: "opacity-90", children: category })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Briefcase, { className: "w-4 h-4" }), _jsx("span", { className: "opacity-90", children: careerType })] })] }), _jsx("h3", { className: "text-lg font-medium leading-tight", children: title }), _jsx("p", { className: "text-sm mt-2", children: "En desarrollo" })] })] }));
}
