import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils/util"; // Asegúrate de que tienes una función para concatenar clases
export default function ProgressBar({ progress, color = "blue", showLabel = false, className = "", }) {
    const colorVariants = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        red: "bg-red-500",
        yellow: "bg-yellow-500",
    };
    return (_jsx("div", { className: cn("w-full bg-gray-200 rounded-full h-4", className), children: _jsx("div", { className: cn("h-4 rounded-full transition-all duration-300 ease-in-out", colorVariants[color]), style: { width: `${Math.min(Math.max(progress, 0), 100)}%` }, children: showLabel && (_jsxs("span", { className: "text-white text-xs font-bold block text-center", children: [progress, "%"] })) }) }));
}
