import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, CreditCard } from 'lucide-react';
const TabNavigation = ({ activeTab, onTabChange }) => {
    return (_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex bg-white rounded-lg p-1 shadow-sm", style: { border: "2px solid #42d7c7" }, children: [_jsx("button", { onClick: () => onTabChange('orders'), className: `flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${activeTab === 'orders'
                        ? 'text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'}`, style: activeTab === 'orders' ? { backgroundColor: "#42d7c7" } : {}, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(FileText, { className: "h-4 w-4" }), "Mis \u00D3rdenes"] }) }), _jsx("button", { onClick: () => onTabChange('payments'), className: `flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${activeTab === 'payments'
                        ? 'text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'}`, style: activeTab === 'payments' ? { backgroundColor: "#42d7c7" } : {}, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4" }), "Mis Pagos"] }) })] }) }));
};
export default TabNavigation;
