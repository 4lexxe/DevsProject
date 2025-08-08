import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FeatureCard({ title, description }) {
    return (_jsxs("div", { className: "p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200", children: [_jsx("div", { className: "w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-3 bg-[#CCF7FF] rounded-lg flex items-center justify-center" }), _jsx("h3", { className: "font-semibold text-black mb-1 text-md sm:text-lg", children: title }), _jsx("p", { className: "text-xs sm:text-sm text-black/70", children: description })] }));
}
