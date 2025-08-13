import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { AlertCircle, ShoppingBag, X, Loader2 } from 'lucide-react';
import { cancelPendingOrder } from '@/course/services/directPurchaseService';
const PendingOrderModal = ({ isOpen, onClose, orderData, errorMessage, onOrderCancelled }) => {
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);
    if (!isOpen)
        return null;
    const handleGoToOrders = () => {
        // Navegar a la página de órdenes
        window.location.href = '/user/orders';
    };
    const handleCancelOrder = async () => {
        try {
            setCancelling(true);
            setCancelError(null);
            await cancelPendingOrder(orderData.orderId);
            // Llamar al callback para notificar que la orden fue cancelada
            onOrderCancelled();
            // No cerramos el modal aquí, lo hace el componente padre
        }
        catch (error) {
            console.error('Error cancelling order:', error);
            setCancelError(error.response?.data?.message || 'Error al cancelar la orden');
        }
        finally {
            setCancelling(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg max-w-md w-full mx-4 shadow-xl", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-amber-100 rounded-full", children: _jsx(AlertCircle, { className: "w-6 h-6 text-amber-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Orden Pendiente" })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-700 leading-relaxed", children: errorMessage }), orderData.expirationDate && (_jsx("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Expira:" }), " ", new Date(orderData.expirationDate).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })] }) })), cancelError && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded-lg", children: _jsx("p", { className: "text-sm text-red-800", children: cancelError }) })), _jsxs("div", { className: "pt-2", children: [_jsx("p", { className: "text-sm text-gray-600 mb-4", children: "\u00BFQu\u00E9 te gustar\u00EDa hacer?" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: handleGoToOrders, className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors", children: [_jsx(ShoppingBag, { className: "w-4 h-4" }), "Ver mis \u00F3rdenes"] }), _jsx("button", { onClick: handleCancelOrder, disabled: cancelling, className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors", children: cancelling ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), "Cancelando..."] })) : (_jsxs(_Fragment, { children: [_jsx(X, { className: "w-4 h-4" }), "Cancelar orden pendiente"] })) })] })] })] }) }), _jsx("div", { className: "px-6 py-3 bg-gray-50 rounded-b-lg", children: _jsx("p", { className: "text-xs text-gray-500 text-center", children: "Al cancelar la orden pendiente podr\u00E1s realizar una nueva compra" }) })] }) }));
};
export default PendingOrderModal;
