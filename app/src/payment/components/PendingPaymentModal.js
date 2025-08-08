import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertTriangle, Eye, CreditCard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const PendingPaymentModal = ({ isOpen, onClose, onContinue, loading = false }) => {
    const navigate = useNavigate();
    const handleViewOrders = () => {
        navigate('/user/orders');
        onClose();
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsx("div", { className: "bg-white rounded-lg max-w-md w-full shadow-xl", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-yellow-100 rounded-full", children: _jsx(AlertTriangle, { className: "w-6 h-6 text-yellow-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Pago Pendiente" })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-gray-600 mb-3", children: "Tienes un pago pendiente en tu carrito. Para agregar nuevos cursos, puedes:" }), _jsxs("ul", { className: "text-sm text-gray-500 space-y-1 ml-4", children: [_jsx("li", { children: "\u2022 Ver tu orden pendiente y completar el pago" }), _jsx("li", { children: "\u2022 Cancelar la orden pendiente y crear una nueva" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("button", { onClick: handleViewOrders, className: "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium", children: [_jsx(Eye, { className: "w-4 h-4" }), "Ver \u00D3rdenes"] }), _jsx("button", { onClick: onContinue, disabled: loading, className: `flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${loading
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`, children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Cancelando..."] })) : (_jsxs(_Fragment, { children: [_jsx(CreditCard, { className: "w-4 h-4" }), "Continuar"] })) })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-gray-200", children: _jsx("p", { className: "text-xs text-gray-500 text-center", children: "Al continuar, se cancelar\u00E1 tu pago pendiente actual" }) })] }) }) }));
};
export default PendingPaymentModal;
