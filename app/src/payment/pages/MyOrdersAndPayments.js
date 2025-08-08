"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CreditCard, Calendar, CheckCircle, Clock, XCircle, FileText, ShoppingCart, Target, Wallet, Zap, Building2, Ticket, Smartphone, Info } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { cartService } from "../services/cartService";
import { paymentService } from "../services";
import { useAuth } from "@/user/contexts/AuthContext";
export default function MyOrdersAndPayments() {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [cancellingOrder, setCancellingOrder] = useState(null);
    useEffect(() => {
        if (user) {
            if (activeTab === 'orders') {
                loadOrders();
            }
            else {
                loadPayments();
            }
        }
    }, [activeTab, user]);
    const loadOrders = async (page = 1) => {
        try {
            setLoading(true);
            const response = await cartService.getOrders(page, 10);
            setOrders(response.data);
            setPagination(response.pagination);
        }
        catch (err) {
            setError('Error al cargar las órdenes');
            console.error('Error loading orders:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const loadPayments = async () => {
        try {
            setLoading(true);
            const paymentsData = await paymentService.getPaymentHistory();
            setPayments(paymentsData);
        }
        catch (err) {
            setError('Error al cargar los pagos');
            console.error('Error loading payments:', err);
        }
        finally {
            setLoading(false);
        }
    };
    // Función mejorada para obtener el nombre del método de pago según MercadoPago API
    const getPaymentMethodName = (paymentMethodId, paymentTypeId) => {
        // Métodos de pago específicos de MercadoPago
        const methods = {
            // Tarjetas de crédito
            visa: "Visa",
            master: "Mastercard",
            amex: "American Express",
            elo: "Elo",
            hipercard: "Hipercard",
            diners: "Diners Club",
            cabal: "Cabal",
            argencard: "Argencard",
            naranja: "Naranja",
            shopping: "Shopping",
            cencosud: "Cencosud",
            cordobesa: "Cordobesa",
            tarjeta_ml: "Tarjeta MercadoLibre",
            // Dinero en cuenta
            account_money: "Dinero en cuenta MercadoPago",
            // Débito inmediato
            debin: "Débito inmediato (DEBIN)",
            // PSE (Colombia)
            pse: "PSE",
            // PIX (Brasil)
            pix: "PIX",
            // Efectivo
            pagofacil: "Pago Fácil",
            rapipago: "Rapipago",
            bapropagos: "Bapro Pagos",
            cobro_express: "Cobro Express",
            redlink: "Red Link",
            // Transferencia bancaria
            banco_frances: "Banco Francés",
            banco_galicia: "Banco Galicia",
            banco_santander: "Banco Santander",
            banco_ciudad: "Banco Ciudad",
            banco_macro: "Banco Macro",
            banco_nacion: "Banco Nación",
            banco_supervielle: "Banco Supervielle",
            banco_comafi: "Banco Comafi",
            banco_patagonia: "Banco Patagonia",
            // Wallets digitales
            mercadopago_wallet: "MercadoPago Wallet",
            moyap: "Moyap",
            // Otros
            webpay: "Webpay",
            khipu: "Khipu",
            payu: "PayU",
        };
        // Tipos de pago
        const types = {
            credit_card: "Tarjeta de Crédito",
            debit_card: "Tarjeta de Débito",
            prepaid_card: "Tarjeta Prepaga",
            account_money: "Dinero en Cuenta",
            bank_transfer: "Transferencia Bancaria",
            ticket: "Efectivo",
            digital_wallet: "Billetera Digital",
            crypto_transfer: "Criptomonedas",
            voucher_card: "Vale",
            digital_currency: "Moneda Digital",
            pse: "PSE - Pagos Seguros en Línea",
            pix: "PIX - Transferencia Instantánea"
        };
        const method = methods[paymentMethodId?.toLowerCase()] || paymentMethodId || 'Método desconocido';
        const type = types[paymentTypeId?.toLowerCase()] || paymentTypeId || 'Tipo desconocido';
        // Si es dinero en cuenta, solo mostrar eso
        if (paymentMethodId?.toLowerCase() === 'account_money' || paymentTypeId?.toLowerCase() === 'account_money') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Wallet, { className: "h-4 w-4" }), "Dinero en cuenta MercadoPago"] }));
        }
        // Si es PIX, solo mostrar eso
        if (paymentMethodId?.toLowerCase() === 'pix' || paymentTypeId?.toLowerCase() === 'pix') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-4 w-4" }), "PIX - Transferencia Instant\u00E1nea"] }));
        }
        // Si es DEBIN, solo mostrar eso
        if (paymentMethodId?.toLowerCase() === 'debin') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Building2, { className: "h-4 w-4" }), "D\u00E9bito inmediato (DEBIN)"] }));
        }
        // Para tarjetas, mostrar tipo + método
        if (paymentTypeId?.toLowerCase().includes('card')) {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4" }), type, " ", method] }));
        }
        // Para efectivo
        if (paymentTypeId?.toLowerCase() === 'ticket') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Ticket, { className: "h-4 w-4" }), method] }));
        }
        // Para transferencias bancarias
        if (paymentTypeId?.toLowerCase() === 'bank_transfer') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Building2, { className: "h-4 w-4" }), method] }));
        }
        // Para wallets digitales
        if (paymentTypeId?.toLowerCase() === 'digital_wallet') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Smartphone, { className: "h-4 w-4" }), method] }));
        }
        // Default: mostrar tipo y método
        return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4" }), type, " - ", method] }));
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "paid":
            case "approved":
                return { backgroundColor: "#42d7c7", color: "#0c154c" };
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
    const getStatusIcon = (status) => {
        switch (status) {
            case "paid":
            case "approved":
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
    const getStatusText = (status) => {
        switch (status) {
            case "paid":
                return "Pagado";
            case "approved":
                return "Aprobado";
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
    const handlePayment = (initPoint) => {
        if (initPoint) {
            window.open(initPoint, "_blank");
        }
    };
    const showPaymentInfo = (payment) => {
        setSelectedPayment(payment);
    };
    const closePaymentInfo = () => {
        setSelectedPayment(null);
    };
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
    const handleCancelOrder = async (orderId) => {
        try {
            setCancellingOrder(orderId);
            await cartService.cancelPendingCart();
            // Recargar las órdenes para reflejar el cambio
            await loadOrders();
        }
        catch (error) {
            console.error('Error cancelling order:', error);
            setError('Error al cancelar la orden');
        }
        finally {
            setCancellingOrder(null);
        }
    };
    // Ordenar por fecha más reciente primero
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // Verificaciones condicionales después de todos los hooks
    if (authLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Verificando autenticaci\u00F3n..." })] }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" }), _jsxs("p", { className: "mt-4 text-gray-600", children: ["Cargando ", activeTab === 'orders' ? 'órdenes' : 'pagos', "..."] })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-red-600", children: error }), _jsx("button", { onClick: () => activeTab === 'orders' ? loadOrders() : loadPayments(), className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors", children: "Reintentar" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen", style: { backgroundColor: "#eff6ff" }, children: _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", style: { color: "#0c154c" }, children: "Mis Compras" }), _jsx("p", { className: "text-gray-600", children: "Historial completo de tus \u00F3rdenes y pagos" })] }), _jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex bg-white rounded-lg p-1 shadow-sm", style: { border: "2px solid #42d7c7" }, children: [_jsx("button", { onClick: () => setActiveTab('orders'), className: `flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${activeTab === 'orders'
                                    ? 'text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'}`, style: activeTab === 'orders' ? { backgroundColor: "#42d7c7" } : {}, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(FileText, { className: "h-4 w-4" }), "Mis \u00D3rdenes"] }) }), _jsx("button", { onClick: () => setActiveTab('payments'), className: `flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${activeTab === 'payments'
                                    ? 'text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'}`, style: activeTab === 'payments' ? { backgroundColor: "#42d7c7" } : {}, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4" }), "Mis Pagos"] }) })] }) }), activeTab === 'orders' ? (
                /* Orders Section */
                _jsx("div", { className: "space-y-6", children: sortedOrders.length === 0 ? (_jsxs("div", { className: "text-center py-16", children: [_jsx("div", { className: "mb-4", children: _jsx(FileText, { className: "h-16 w-16 mx-auto text-gray-400" }) }), _jsx("h2", { className: "text-2xl font-bold mb-4", style: { color: "#0c154c" }, children: "No tienes \u00F3rdenes a\u00FAn" }), _jsx("p", { className: "text-gray-600", children: "Cuando realices tu primera compra, aparecer\u00E1 aqu\u00ED" }), _jsx(Link, { to: "/courses", className: "inline-flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors mt-4", style: { backgroundColor: "#1d4ed8" }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#1e40af", onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#1d4ed8", children: "Explorar Cursos" })] })) : (sortedOrders.map((order) => (_jsx("div", { className: "border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300", style: { borderColor: "#42d7c7", backgroundColor: "white" }, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold mb-2", style: { color: "#0c154c" }, children: ["Orden #", order.id] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), formatDate(order.createdAt)] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(ShoppingCart, { className: "h-4 w-4" }), order.courses.length, " ", order.courses.length === 1 ? "curso" : "cursos"] })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-3 mt-4 md:mt-0", children: [_jsx("div", { className: "text-2xl font-bold", style: { color: "#1d4ed8" }, children: formatCurrency(order.finalPrice) }), _jsxs("div", { className: "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium", style: getStatusColor(order.status), children: [_jsx("span", { className: "mr-2", children: getStatusIcon(order.status) }), getStatusText(order.status)] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "font-semibold mb-3", style: { color: "#0c154c" }, children: "Cursos incluidos:" }), _jsx("div", { className: "space-y-3", children: order.courses.map((courseItem, index) => (_jsxs("div", { className: "flex justify-between items-center p-4 rounded-lg", style: { backgroundColor: "#eff6ff" }, children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: courseItem.course.title }), _jsx("div", { className: "text-sm text-gray-600 mt-1", children: courseItem.course.description }), courseItem.course.discountApplied && (_jsxs("div", { className: "text-xs text-green-600 mt-1 flex items-center gap-1", children: [_jsx(Target, { className: "h-3 w-3" }), "Descuento: ", courseItem.course.discountApplied.percentage, "% (", courseItem.course.discountApplied.event, ")"] }))] }), _jsxs("div", { className: "flex flex-col items-end ml-4", children: [courseItem.course.discountApplied && (_jsx("div", { className: "text-sm text-gray-500 line-through", children: formatCurrency(courseItem.course.originalPrice) })), _jsx("div", { className: "font-bold text-lg", style: { color: "#1d4ed8" }, children: formatCurrency(courseItem.course.finalPrice) })] })] }, index))) })] }), order.summary.totalSavings > 0 && (_jsx("div", { className: "mb-6 p-4 rounded-lg", style: { backgroundColor: "#f0fdf4" }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Resumen del pedido" }), _jsxs("div", { className: "flex items-center gap-4 mt-1", children: [_jsxs("span", { className: "text-sm text-gray-500", children: ["Precio original: ", formatCurrency(order.summary.totalOriginal)] }), _jsxs("span", { className: "text-sm text-green-600 font-medium", children: ["Descuento: -", formatCurrency(order.summary.totalSavings)] })] })] }), _jsxs("div", { className: "text-lg font-bold text-green-600", children: ["\u00A1Ahorraste ", formatCurrency(order.summary.totalSavings), "!"] })] }) })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [order.status === "pending" && order.preference?.initPoint && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handlePayment(order.preference?.initPoint), className: "flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:opacity-90", style: { backgroundColor: "#42d7c7" }, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4" }), "Completar Pago"] }) }), _jsx("button", { onClick: () => handleCancelOrder(order.id), disabled: cancellingOrder === order.id, className: "px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed", style: { borderColor: "#ef4444", color: "#ef4444", backgroundColor: "white" }, children: _jsx("span", { className: "flex items-center justify-center gap-2", children: cancellingOrder === order.id ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" }), "Cancelando..."] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "h-4 w-4" }), "Cancelar Orden"] })) }) })] })), order.status === "paid" && order.preference?.payments && order.preference.payments.length > 0 && (_jsx("button", { onClick: () => showPaymentInfo(order.preference.payments[0]), className: "px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-300 hover:opacity-80", style: { borderColor: "#1d4ed8", color: "#1d4ed8", backgroundColor: "white" }, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(Info, { className: "h-4 w-4" }), "Ver Informaci\u00F3n del Pago"] }) }))] })] }) }, order.id)))) })) : (
                /* Payments Section */
                _jsx("div", { className: "space-y-4", children: payments.length === 0 ? (_jsxs("div", { className: "text-center py-16", children: [_jsx("div", { className: "mb-4", children: _jsx(CreditCard, { className: "h-16 w-16 mx-auto text-gray-400" }) }), _jsx("h2", { className: "text-2xl font-bold mb-4", style: { color: "#0c154c" }, children: "No tienes pagos registrados" }), _jsx("p", { className: "text-gray-600", children: "Cuando realices tu primera compra, aparecer\u00E1 aqu\u00ED" }), _jsx(Link, { to: "/courses", className: "inline-flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors mt-4", style: { backgroundColor: "#1d4ed8" }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#1e40af", onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#1d4ed8", children: "Explorar Cursos" })] })) : (payments.map((payment) => (_jsx("div", { className: "border-2 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md", style: { borderColor: "#42d7c7" }, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4 md:mb-0", children: [_jsx("div", { className: "p-2 rounded-full", style: { backgroundColor: "#e0f2fe" }, children: _jsx(CreditCard, { className: "h-5 w-5", style: { color: "#1d4ed8" } }) }), _jsxs("div", { children: [_jsxs("h3", { className: "font-semibold", style: { color: "#0c154c" }, children: ["Pago #", payment.id] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["ID: ", payment.id] })] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium", style: getStatusColor(payment.status), children: [_jsx("span", { className: "mr-1", children: getStatusIcon(payment.status) }), getStatusText(payment.status)] }) })] }), _jsx("hr", { className: "mb-4 border-gray-200" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Monto" }), _jsx("div", { className: "font-semibold text-lg", style: { color: "#1d4ed8" }, children: formatCurrency(payment.transactionAmount) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Fecha" }), _jsxs("div", { className: "flex items-center gap-2", style: { color: "#0c154c" }, children: [_jsx(Calendar, { className: "h-4 w-4" }), payment.dateApproved ? formatDateTime(payment.dateApproved) : 'N/A'] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "M\u00E9todo de Pago" }), _jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: getPaymentMethodName(payment.paymentMethodId || '', payment.paymentTypeId || '') })] })] }), payment.items && payment.items.length > 0 && (_jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200", children: [_jsx("div", { className: "text-sm text-gray-600 mb-2", children: "Items comprados:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: payment.items.map((item, index) => (_jsx("span", { className: "inline-block px-3 py-1 rounded-full text-xs", style: {
                                                    backgroundColor: "#e0f2fe",
                                                    color: "#1d4ed8",
                                                    border: "1px solid #bae6fd"
                                                }, children: item.title }, index))) })] }))] }) }, payment.id)))) })), selectedPayment && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsx("div", { className: "bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto", style: { border: `2px solid #42d7c7` }, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-bold", style: { color: "#0c154c" }, children: "Informaci\u00F3n del Pago" }), _jsx("button", { onClick: closePaymentInfo, className: "text-gray-500 hover:text-gray-700 text-2xl", children: "\u00D7" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "p-4 rounded-lg", style: { backgroundColor: "#eff6ff" }, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mb-2", children: _jsx(CheckCircle, { className: "h-10 w-10 mx-auto text-green-500" }) }), _jsx("div", { className: "font-bold text-lg", style: { color: "#42d7c7" }, children: "Pago Aprobado" })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "ID de Pago" }), _jsx("div", { className: "font-mono text-sm", style: { color: "#1d4ed8" }, children: selectedPayment.id })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "M\u00E9todo de Pago" }), _jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: getPaymentMethodName(selectedPayment.paymentMethodId, selectedPayment.paymentTypeId) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Fecha y Hora del Pago" }), _jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: formatDateTime(selectedPayment.dateApproved) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Monto" }), _jsx("div", { className: "font-bold text-lg", style: { color: "#1d4ed8" }, children: formatCurrency(selectedPayment.transactionAmount) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Estado" }), _jsx("div", { className: "font-medium", style: { color: "#42d7c7" }, children: selectedPayment.status === "approved" ? "Aprobado" : selectedPayment.status })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Comprador" }), _jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: selectedPayment.payer.first_name && selectedPayment.payer.last_name
                                                                ? `${selectedPayment.payer.first_name} ${selectedPayment.payer.last_name}`
                                                                : selectedPayment.payer.email }), _jsx("div", { className: "text-sm text-gray-500", children: selectedPayment.payer.email }), selectedPayment.payer.identification && (_jsxs("div", { className: "text-sm text-gray-500", children: [selectedPayment.payer.identification.type, ": ", selectedPayment.payer.identification.number] }))] })] }), _jsx("div", { className: "pt-4 border-t", style: { borderColor: "#e5e7eb" }, children: _jsx("button", { onClick: closePaymentInfo, className: "w-full px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:opacity-90", style: { backgroundColor: "#1d4ed8" }, children: "Cerrar" }) })] })] }) }) }))] }) }));
}
