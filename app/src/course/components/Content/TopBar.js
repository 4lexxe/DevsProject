import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MoveLeft, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function TopBar({ courseId, prev, next, title, reloadContent, }) {
    return (_jsxs("div", { className: "flex items-center justify-between h-12 px-2 rounded-lg", style: { backgroundColor: "#f2f6f9" }, children: [prev ? (_jsx(Link, { to: `/course/${courseId}/section/content/${prev}`, className: "p-2 rounded-md hover:bg-gray-300 transition-colors", children: _jsx(MoveLeft, {}) })) : (_jsx("div", { className: "p-2" })), _jsx("h1", { className: "text-center font-medium text-sm sm:text-base truncate max-w-[70%]", children: title ? title : "Título del contenido" }), next ? (_jsx(Link, { to: `/course/${courseId}/section/content/${next}`, className: "p-2 rounded-md hover:bg-gray-300 transition-colors", children: _jsx(MoveRight, {}) })) : (_jsx("div", { className: "p-2" }))] }));
}
