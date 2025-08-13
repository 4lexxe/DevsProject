"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { cartService } from "../services/cartService";
import { paymentService } from "../services";
import { useAuth } from "@/user/contexts/AuthContext";
import axiosInstance from "@/shared/api/axios";
import { OrderCard, PaymentCard, PaymentInfoModal, TabNavigation, EmptyState } from "../components/MyOrders";
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
    const handleCancelOrder = async (orderId) => {
        try {
            setCancellingOrder(orderId);
            await axiosInstance.put(`/orders/${orderId}/cancel`);
            await loadOrders();
        }
        catch (error) {
            console.error('Error cancelando orden:', error);
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
    return (_jsx("div", { className: "min-h-screen", style: { backgroundColor: "#eff6ff" }, children: _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", style: { color: "#0c154c" }, children: "Mis Compras" }), _jsx("p", { className: "text-gray-600", children: "Historial completo de tus \u00F3rdenes y pagos" })] }), _jsx(TabNavigation, { activeTab: activeTab, onTabChange: setActiveTab }), activeTab === 'orders' ? (
                /* Orders Section */
                _jsx("div", { className: "space-y-6", children: sortedOrders.length === 0 ? (_jsx(EmptyState, { type: "orders" })) : (sortedOrders.map((order) => (_jsx(OrderCard, { order: order, onPayment: handlePayment, onCancel: handleCancelOrder, cancellingOrder: cancellingOrder }, order.id)))) })) : (
                /* Payments Section */
                _jsx("div", { className: "space-y-4", children: payments.length === 0 ? (_jsx(EmptyState, { type: "payments" })) : (payments.map((payment) => (_jsx(PaymentCard, { payment: payment }, payment.id)))) })), _jsx(PaymentInfoModal, { payment: selectedPayment, isOpen: !!selectedPayment, onClose: closePaymentInfo })] }) }));
}
