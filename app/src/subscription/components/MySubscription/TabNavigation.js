import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function TabNavigation({ activeTab, onTabChange }) {
    return (_jsx("div", { className: "mb-6", children: _jsx("div", { className: "border-b border-[#eff6ff]", children: _jsxs("nav", { className: "-mb-px flex space-x-8", children: [_jsx("button", { onClick: () => onTabChange("details"), className: `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "details"
                            ? "border-[#1d4ed8] text-[#1d4ed8]"
                            : "border-transparent text-gray-500 hover:text-[#0c154c] hover:border-[#42d7c7]"}`, children: "Detalles de Suscripci\u00F3n" }), _jsx("button", { onClick: () => onTabChange("payments"), className: `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "payments"
                            ? "border-[#1d4ed8] text-[#1d4ed8]"
                            : "border-transparent text-gray-500 hover:text-[#0c154c] hover:border-[#42d7c7]"}`, children: "Historial de Pagos" })] }) }) }));
}
