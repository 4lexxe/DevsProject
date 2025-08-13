import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Calendar, ShoppingCart, CheckCircle, Clock, XCircle, CreditCard, Target } from 'lucide-react';
const OrderCard = ({ order, onPayment, onCancel, cancellingOrder }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };
    const isOrderExpired = (expirationDate) => {
        if (!expirationDate)
            return false;
        return new Date(expirationDate) < new Date();
    };
    const getTimeRemaining = (expirationDate) => {
        if (!expirationDate)
            return null;
        const now = new Date();
        const expiration = new Date(expirationDate);
        const diff = expiration.getTime() - now.getTime();
        if (diff <= 0)
            return "Expirada";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days} día${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}`;
        }
        else if (hours > 0) {
            return `${hours}h ${minutes}m restantes`;
        }
        else {
            return `${minutes}m restantes`;
        }
    };
    const getStatusColor = (status, expired) => {
        // Si la orden está marcada como expirada, usar color de expirada
        if (expired || status === "expired") {
            return { backgroundColor: "#f97316", color: "white" };
        }
        switch (status) {
            case "paid":
                return { backgroundColor: "#10b981", color: "white" };
            case "active":
                return { backgroundColor: "#02ffff", color: "#0c154c" };
            case "pending":
                return { backgroundColor: "#fbbf24", color: "#0c154c" };
            case "cancelled":
            case "rejected":
                return { backgroundColor: "#ef4444", color: "white" };
            default:
                return { backgroundColor: "#6b7280", color: "white" };
        }
    };
    const getStatusIcon = (status, expired) => {
        // Si la orden está marcada como expirada, usar ícono de expirada
        if (expired || status === "expired") {
            return _jsx(Clock, { className: "h-4 w-4" });
        }
        switch (status) {
            case "paid":
                return _jsx(CheckCircle, { className: "h-4 w-4" });
            case "active":
                return _jsx(CheckCircle, { className: "h-4 w-4" });
            case "pending":
                return _jsx(Clock, { className: "h-4 w-4" });
            case "cancelled":
            case "rejected":
                return _jsx(XCircle, { className: "h-4 w-4" });
            default:
                return _jsx(Clock, { className: "h-4 w-4" });
        }
    };
    const getStatusText = (status, expired) => {
        // Si la orden está marcada como expirada, mostrar texto de expirada
        if (expired || status === "expired") {
            return "Expirada";
        }
        switch (status) {
            case "paid":
                return "Pagado";
            case "active":
                return "Activo";
            case "pending":
                return "Pendiente de Pago";
            case "cancelled":
                return "Cancelado";
            case "rejected":
                return "Rechazado";
            default:
                return "Desconocido";
        }
    };
    // Determinar si la orden está expirada (por fecha o por campo expired)
    const orderExpired = order.expired || isOrderExpired(order.expirationDateTo) || order.status === "expired";
    const timeRemaining = getTimeRemaining(order.expirationDateTo);
    const isUrgent = timeRemaining && (timeRemaining.includes('h') || timeRemaining.includes('m')) && !timeRemaining.includes('día');
    return (_jsxs("div", { className: `border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${order.status === 'pending' && orderExpired ? 'border-red-300 bg-red-50' :
            orderExpired ? 'border-orange-300 bg-orange-50' : ''}`, style: {
            borderColor: order.status === 'pending' && orderExpired ? "#fca5a5" :
                orderExpired ? "#fdba74" : "#42d7c7",
            backgroundColor: order.status === 'pending' && orderExpired ? "#fef2f2" :
                orderExpired ? "#fff7ed" : "white"
        }, children: [order.status === 'pending' && order.expirationDateTo && (_jsx(_Fragment, { children: orderExpired ? (_jsxs("div", { className: "bg-red-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2", children: [_jsx(XCircle, { className: "h-4 w-4" }), "Esta orden ha expirado el ", formatDateTime(order.expirationDateTo)] })) : (isUrgent && (_jsxs("div", { className: "bg-orange-500 text-white px-4 py-2 text-sm font-medium flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4" }), "\u26A0\uFE0F Esta orden expira en ", timeRemaining, " - \u00A1Completa tu pago pronto!"] }))) })), order.status === 'expired' && (_jsxs("div", { className: "bg-orange-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4" }), "Esta orden ha expirado autom\u00E1ticamente"] })), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold mb-2", style: { color: "#0c154c" }, children: ["Orden #", order.id] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), "Creada: ", formatDate(order.createdAt)] }), order.expirationDateTo && order.status === 'pending' && (_jsxs("span", { className: `flex items-center gap-1 ${orderExpired ? 'text-red-600' : 'text-orange-600'}`, children: [_jsx(Clock, { className: "h-4 w-4" }), orderExpired ? (_jsxs("span", { className: "font-medium", children: ["Expirada el ", formatDateTime(order.expirationDateTo)] })) : (_jsxs("span", { children: ["Expira: ", getTimeRemaining(order.expirationDateTo)] }))] })), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(ShoppingCart, { className: "h-4 w-4" }), order.orderCourses.length, " ", order.orderCourses.length === 1 ? "curso" : "cursos"] })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-3 mt-4 md:mt-0", children: [_jsx("div", { className: "text-2xl font-bold", style: { color: "#1d4ed8" }, children: formatCurrency(order.finalPrice) }), _jsxs("div", { className: "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium", style: getStatusColor(order.status, orderExpired), children: [_jsx("span", { className: "mr-2", children: getStatusIcon(order.status, orderExpired) }), getStatusText(order.status, orderExpired)] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "font-semibold mb-3", style: { color: "#0c154c" }, children: "Cursos incluidos:" }), _jsx("div", { className: "space-y-3", children: order.orderCourses.map((orderCourse, index) => (_jsxs("div", { className: "flex justify-between items-center p-4 rounded-lg", style: { backgroundColor: "#eff6ff" }, children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: orderCourse.course.title }), _jsx("div", { className: "text-sm text-gray-600 mt-1", children: orderCourse.course.summary }), orderCourse.discountValue > 0 && (_jsxs("div", { className: "text-xs text-green-600 mt-1 flex items-center gap-1", children: [_jsx(Target, { className: "h-3 w-3" }), "Descuento: ", orderCourse.discountValue, "%"] }))] }), _jsxs("div", { className: "flex flex-col items-end ml-4", children: [orderCourse.discountValue > 0 && (_jsx("div", { className: "text-sm text-gray-500 line-through", children: formatCurrency(orderCourse.unitPrice) })), _jsx("div", { className: "font-bold text-lg", style: { color: "#1d4ed8" }, children: formatCurrency(orderCourse.priceWithDiscount) })] })] }, index))) })] }), order.discountAmount > 0 && (_jsx("div", { className: "mb-6 p-4 rounded-lg", style: { backgroundColor: "#f0fdf4" }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Resumen del pedido" }), _jsxs("div", { className: "flex items-center gap-4 mt-1", children: [_jsxs("span", { className: "text-sm text-gray-500", children: ["Precio original: ", formatCurrency(order.totalPrice)] }), _jsxs("span", { className: "text-sm text-green-600 font-medium", children: ["Descuento: -", formatCurrency(order.discountAmount)] })] })] }), _jsxs("div", { className: "text-lg font-bold text-green-600", children: ["\u00A1Ahorraste ", formatCurrency(order.discountAmount), "!"] })] }) })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [order.status === "pending" && order.initPoint && !orderExpired && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => onPayment(order.initPoint), className: "flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:opacity-90", style: { backgroundColor: "#42d7c7" }, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4" }), "Completar Pago"] }) }), _jsx("button", { onClick: () => onCancel(order.id), disabled: cancellingOrder === order.id, className: "px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed", style: { borderColor: "#ef4444", color: "#ef4444", backgroundColor: "white" }, children: _jsx("span", { className: "flex items-center justify-center gap-2", children: cancellingOrder === order.id ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" }), "Cancelando..."] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "h-4 w-4" }), "Cancelar Orden"] })) }) })] })), order.status === "pending" && orderExpired && (_jsx("button", { onClick: () => onCancel(order.id), disabled: cancellingOrder === order.id, className: "w-full px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed", style: { borderColor: "#ef4444", color: "#ef4444", backgroundColor: "white" }, children: _jsx("span", { className: "flex items-center justify-center gap-2", children: cancellingOrder === order.id ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" }), "Cancelando..."] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "h-4 w-4" }), "Eliminar Orden Expirada"] })) }) }))] })] })] }));
};
export default OrderCard;
