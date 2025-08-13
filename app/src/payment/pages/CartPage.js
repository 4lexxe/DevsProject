"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, AlertTriangle, X, BookOpen, Loader2, Star, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { cartService } from "../services";
import { cancelPendingOrder } from "@/course/services/directPurchaseService";
import PendingOrderModal from "@/course/components/CourseDetail/PendingOrderModal";
export default function CartPage() {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [cancelingPending, setCancelingPending] = useState(false);
    const [courseAccessError, setCourseAccessError] = useState(null);
    const [pendingOrderData, setPendingOrderData] = useState(null);
    const [showPendingOrderModal, setShowPendingOrderModal] = useState(false);
    useEffect(() => {
        loadCart();
    }, []);
    const loadCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCartSummary();
            setCartData(data);
        }
        catch (error) {
            console.error('Error loading cart:', error);
            setCartData(null);
        }
        finally {
            setLoading(false);
        }
    };
    const removeFromCart = async (courseId) => {
        try {
            setRemoving(courseId);
            await cartService.removeCourseFromCart(courseId);
            await loadCart(); // Recargar carrito
        }
        catch (error) {
            console.error('Error removing course:', error);
        }
        finally {
            setRemoving(null);
        }
    };
    const clearCart = async () => {
        try {
            await cartService.clearCart();
            await loadCart();
        }
        catch (error) {
            console.error('Error clearing cart:', error);
        }
    };
    const proceedToPayment = async () => {
        try {
            setProcessingPayment(true);
            setCourseAccessError(null); // Limpiar errores previos
            setPendingOrderData(null); // Limpiar errores previos
            setShowPendingOrderModal(false); // Cerrar modal previo
            const preference = await cartService.createPaymentPreference();
            // Redirigir a MercadoPago
            window.location.href = preference.initPoint;
        }
        catch (error) {
            console.error('Error creating payment preference:', error);
            // Verificar si es error de carrito pendiente
            if (error.response?.status === 422) {
                const errorMessage = error.response?.data?.message;
                const errorData = error.response?.data?.errors; // Usar errors en lugar de data
                console.log('🔍 Cart Error 422 - errorMessage:', errorMessage);
                console.log('🔍 Cart Error 422 - errorData (errors):', errorData);
                if (errorMessage?.includes('carrito pendiente') || errorMessage?.includes('Ya existe un carrito pendiente')) {
                    setShowPendingModal(true);
                    return;
                }
                // Verificar si es error de cursos con acceso previo
                if (errorMessage?.includes('Ya tienes acceso a los siguientes cursos') && errorData?.coursesWithAccess) {
                    setCourseAccessError({
                        message: errorMessage,
                        coursesWithAccess: errorData.coursesWithAccess
                    });
                    return;
                }
                // Verificar si es error de órdenes pendientes usando errorType
                if (errorData?.errorType === 'PENDING_ORDER') {
                    console.log('🔍 Detectado error de orden pendiente en carrito');
                    // Tomar la primera orden pendiente
                    const firstOrder = errorData.orderDetails?.[0];
                    const firstCourse = errorData.coursesWithPendingOrders?.[0];
                    if (firstOrder && firstCourse) {
                        setPendingOrderData({
                            orderId: firstOrder.orderId,
                            orderType: firstOrder.type,
                            expirationDate: firstOrder.expirationDate,
                            courseName: firstCourse.title
                        });
                        setShowPendingOrderModal(true);
                    }
                    return;
                }
            }
        }
        finally {
            setProcessingPayment(false);
        }
    };
    const handleCancelPendingAndContinue = async () => {
        try {
            setCancelingPending(true);
            // Cancelar el carrito pendiente
            await cartService.cancelPendingCart();
            // Cerrar modal
            setShowPendingModal(false);
            // Intentar proceder al pago nuevamente
            await proceedToPayment();
        }
        catch (error) {
            console.error('Error cancelando carrito pendiente:', error);
            setShowPendingModal(false);
        }
        finally {
            setCancelingPending(false);
        }
    };
    const handleCloseModal = () => {
        setShowPendingModal(false);
    };
    const handleRemoveCoursesWithAccess = async () => {
        if (!courseAccessError?.coursesWithAccess)
            return;
        try {
            // Eliminar cada curso del carrito
            for (const course of courseAccessError.coursesWithAccess) {
                await cartService.removeCourseFromCart(course.id);
            }
            // Recargar el carrito
            await loadCart();
            // Limpiar el error
            setCourseAccessError(null);
        }
        catch (error) {
            console.error('Error eliminando cursos del carrito:', error);
        }
    };
    const handleDismissCourseAccessError = () => {
        setCourseAccessError(null);
    };
    const handleRemoveCoursesWithPendingOrders = async () => {
        if (!pendingOrderData)
            return;
        try {
            // Eliminar cada curso del carrito que tiene órdenes pendientes
            // Para este caso, necesitamos el courseId que deberíamos almacenar en pendingOrderData
            // Por ahora, removemos todos los cursos del carrito
            await cartService.clearCart();
            // Recargar el carrito
            await loadCart();
            // Limpiar el modal
            setPendingOrderData(null);
            setShowPendingOrderModal(false);
        }
        catch (error) {
            console.error('Error eliminando cursos con órdenes pendientes del carrito:', error);
        }
    };
    const handleCancelPendingOrder = async () => {
        if (!pendingOrderData)
            return;
        try {
            // Cancelar la orden pendiente
            if (pendingOrderData.orderType === 'cart') {
                await cartService.cancelPendingCart();
            }
            else {
                await cancelPendingOrder(pendingOrderData.orderId);
            }
            // Limpiar el modal
            setPendingOrderData(null);
            setShowPendingOrderModal(false);
            // Reintentar la compra automáticamente
            proceedToPayment();
        }
        catch (error) {
            console.error('Error cancelando orden pendiente:', error);
            setPendingOrderData(null);
            setShowPendingOrderModal(false);
        }
    };
    const handleViewPendingOrders = () => {
        // Cerrar modal
        setPendingOrderData(null);
        setShowPendingOrderModal(false);
        // Navegar a la página de órdenes
        navigate('/user/orders');
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50", children: _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "flex flex-col justify-center items-center h-64", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }), _jsx(ShoppingBag, { className: "w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" })] }), _jsxs("div", { className: "mt-6 text-center", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Cargando tu carrito" }), _jsx("p", { className: "text-gray-600", children: "Preparando tus cursos seleccionados..." })] })] }) }) }));
    }
    if (!cartData || cartData.courses.length === 0) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50", children: _jsx("div", { className: "container mx-auto px-4 py-16", children: _jsxs("div", { className: "max-w-lg mx-auto text-center", children: [_jsx(Link, { to: "/cursos", children: _jsxs("button", { className: "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 bg-white h-12 px-6 py-2 mb-8 shadow-sm border-2 text-gray-800 hover:shadow-md", style: { borderColor: "rgb(66, 215, 199)" }, children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Explorar Cursos"] }) }), _jsxs("div", { className: "relative mb-8", children: [_jsx("div", { className: "w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg", children: _jsx(ShoppingBag, { className: "w-16 h-16 text-blue-600" }) }), _jsx("div", { className: "absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md", children: _jsx(Star, { className: "w-4 h-4 text-yellow-600" }) })] }), _jsx("h1", { className: "text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent", children: "Tu carrito est\u00E1 vac\u00EDo" }), _jsx("p", { className: "text-gray-600 mb-8 text-lg leading-relaxed", children: "\u00A1Descubre cursos incre\u00EDbles y comienza tu viaje de aprendizaje hoy mismo!" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Link, { to: "/cursos", children: _jsxs("button", { className: "w-full sm:w-auto inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 h-12 px-8 py-2 bg-white border-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-gray-800", style: { borderColor: "rgb(66, 215, 199)" }, children: [_jsx(BookOpen, { className: "w-5 h-5 mr-2" }), "Ver Todos los Cursos"] }) }), _jsx("div", { className: "flex items-center justify-center mt-6", children: _jsxs("div", { className: "flex items-center bg-white border-2 rounded-lg px-4 py-2 text-sm text-gray-600", style: { borderColor: "rgb(66, 215, 199)" }, children: [_jsx(Clock, { className: "w-4 h-4 mr-2" }), _jsx("span", { children: "Acceso de por vida" })] }) })] })] }) }) }));
    }
    // Ahora sabemos que cartData no es null
    const totalSavings = cartData.summary.totalSavings;
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50", children: _jsxs("div", { className: "container mx-auto px-4 py-6 sm:py-8", children: [_jsxs("div", { className: "mb-6 sm:mb-8", children: [_jsx(Link, { to: "/cursos", children: _jsxs("button", { className: "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 bg-white hover:bg-blue-50 h-10 sm:h-12 px-4 sm:px-6 py-2 mb-4 sm:mb-6 shadow-sm border border-blue-200 text-blue-600 hover:text-blue-700 hover:shadow-md", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), _jsx("span", { className: "hidden sm:inline", children: "Continuar comprando" }), _jsx("span", { className: "sm:hidden", children: "Volver" })] }) }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent", children: "Mi Carrito" }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(ShoppingBag, { className: "w-4 h-4" }), _jsxs("p", { className: "text-sm sm:text-base", children: [cartData.summary.courseCount, " ", cartData.summary.courseCount === 1 ? "curso" : "cursos", " seleccionado", cartData.summary.courseCount === 1 ? "" : "s"] })] })] }), totalSavings > 0 && (_jsxs("div", { className: "bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg px-4 py-2 text-center", children: [_jsx("p", { className: "text-sm font-medium text-green-800", children: "\u00A1Est\u00E1s ahorrando!" }), _jsxs("p", { className: "text-lg font-bold text-green-600", children: ["$", totalSavings] })] }))] })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6 lg:gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-4 sm:space-y-6", children: cartData.courses.map((item) => {
                                const hasActiveDiscount = item.course.discountApplied !== null;
                                return (_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300", children: _jsx("div", { className: "p-3 sm:p-4", children: _jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "relative flex-shrink-0", children: [_jsx("div", { className: "w-20 h-12 sm:w-24 sm:h-14 rounded-lg overflow-hidden", children: item.course.image ? (_jsx("img", { src: item.course.image, alt: item.course.title, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-600 to-cyan-600", children: item.course.title.substring(0, 2).toUpperCase() })) }), hasActiveDiscount && (_jsx("div", { className: "absolute -top-1 -right-1 rounded-full px-2 py-0.5 text-xs font-bold", style: { backgroundColor: "rgb(66, 215, 199)", color: "#0c154c" }, children: item.course.discountApplied?.percentage }))] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "text-sm sm:text-base font-semibold mb-1 text-gray-800 truncate", children: item.course.title }), _jsx("div", { className: "mb-2", children: _jsx("span", { className: "inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs", children: item.course.title || "Curso" }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-2", children: hasActiveDiscount ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-xs line-through text-gray-400", children: ["$", item.course.originalPrice] }), _jsxs("span", { className: "text-lg font-bold text-gray-800", children: ["$", item.course.finalPrice] })] })) : (_jsxs("span", { className: "text-lg font-bold text-gray-800", children: ["$", item.course.finalPrice] })) }), _jsx("button", { onClick: () => removeFromCart(item.course.id), disabled: removing === item.course.id, className: "p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50", children: removing === item.course.id ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Trash2, { className: "w-4 h-4" })) })] })] })] }) }) }, item.cartCourseId));
                            }) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg sticky top-6 border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "p-4 sm:p-6 bg-white border-b-2", style: { borderColor: "rgb(66, 215, 199)", color: "#0c154c" }, children: [_jsxs("h3", { className: "font-bold text-lg sm:text-xl flex items-center gap-2", children: [_jsx(ShoppingBag, { className: "w-5 h-5" }), "Resumen del Pedido"] }), _jsxs("p", { className: "text-sm mt-1", style: { color: "#0c154c", opacity: 0.8 }, children: [cartData.summary.courseCount, " ", cartData.summary.courseCount === 1 ? "artículo" : "artículos"] })] }), _jsxs("div", { className: "p-4 sm:p-6 space-y-4", children: [_jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: cartData.courses.map((item) => (_jsxs("div", { className: "flex justify-between items-start text-sm p-2 sm:p-3 rounded-lg border transition-all duration-300 bg-white", style: { borderColor: "rgb(66, 215, 199)" }, children: [_jsxs("div", { className: "flex-1 min-w-0 mr-3", children: [_jsx("div", { className: "font-semibold truncate mb-1 text-gray-800", children: item.course.title }), item.course.discountApplied && (_jsxs("div", { className: "text-xs text-green-600 font-medium", children: [item.course.discountApplied.percentage, "% descuento"] }))] }), _jsx("div", { className: "text-right", children: item.course.discountApplied ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "text-xs line-through text-gray-400", children: ["$", item.course.originalPrice] }), _jsxs("div", { className: "font-bold text-gray-800", children: ["$", item.course.finalPrice] })] })) : (_jsxs("div", { className: "font-bold text-gray-800", children: ["$", item.course.finalPrice] })) })] }, item.cartCourseId))) }), _jsxs("div", { className: "border-t border-gray-200 pt-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsxs("span", { children: ["Subtotal (", cartData.summary.courseCount, " cursos)"] }), _jsxs("span", { className: "font-medium", children: ["$", cartData.summary.totalOriginal] })] }), totalSavings > 0 && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-green-600 font-medium", children: "Valor descontado" }), _jsxs("span", { className: "text-green-600 font-bold", children: ["-$", totalSavings] })] })), _jsx("div", { className: "border-t border-gray-200 pt-3", children: _jsxs("div", { className: "flex justify-between text-lg font-bold", children: [_jsx("span", { className: "text-gray-800", children: "Total" }), _jsxs("span", { className: "text-2xl text-blue-600", children: ["$", cartData.summary.totalWithDiscounts] })] }) })] }), totalSavings > 0 && (_jsx("div", { className: "mt-4 text-center p-3 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Star, { className: "w-4 h-4 text-green-600" }), _jsxs("p", { className: "text-sm font-bold text-green-800", children: ["\u00A1Est\u00E1s ahorrando $", totalSavings, "!"] })] }) }))] })] }), _jsxs("div", { className: "p-4 sm:p-6 pt-0 space-y-3 bg-gray-50", children: [_jsxs("button", { onClick: proceedToPayment, disabled: processingPayment, className: "w-full inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 h-12 px-4 py-2 bg-white border-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none", style: { borderColor: "rgb(66, 215, 199)", color: "#0c154c" }, children: [processingPayment ? (_jsx(Loader2, { className: "w-5 h-5 mr-2 animate-spin" })) : (_jsx(CreditCard, { className: "w-5 h-5 mr-2" })), processingPayment ? "Procesando..." : "Proceder al Pago"] }), _jsxs("button", { onClick: clearCart, className: "w-full inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 h-10 px-4 py-2 text-gray-600 hover:text-gray-700", children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), "Vaciar Carrito"] })] })] }) })] }), courseAccessError && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 transform transition-all duration-300 scale-100", children: [_jsxs("div", { className: "flex items-start gap-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center flex-shrink-0", children: _jsx(AlertTriangle, { className: "w-6 h-6 text-orange-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-2", children: "Cursos ya adquiridos" }), _jsx("p", { className: "text-gray-600 text-sm leading-relaxed", children: "Ya tienes acceso a algunos cursos en tu carrito. No puedes comprar cursos que ya posees." })] })] }), _jsx("div", { className: "space-y-3 mb-6 max-h-48 overflow-y-auto", children: courseAccessError.coursesWithAccess.map((course) => (_jsxs("div", { className: "flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0", children: _jsx(BookOpen, { className: "w-4 h-4 text-blue-600" }) }), _jsx("span", { className: "font-medium text-gray-800 flex-1", children: course.title }), _jsx("div", { className: "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium", children: "Adquirido" })] }, course.id))) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("button", { onClick: handleRemoveCoursesWithAccess, className: "flex-1 inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 h-12 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5", children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), "Eliminar del carrito"] }), _jsxs("button", { onClick: handleDismissCourseAccessError, className: "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 h-12 px-4 py-2 text-gray-600 hover:text-gray-700", children: [_jsx(X, { className: "w-4 h-4 mr-2" }), _jsx("span", { className: "hidden sm:inline", children: "Cerrar" })] })] })] }) })), pendingOrderData && (_jsx(PendingOrderModal, { isOpen: showPendingOrderModal, onClose: () => setShowPendingOrderModal(false), orderData: pendingOrderData, errorMessage: "Tienes una orden pendiente de pago para este curso. Puedes completar el pago o cancelar la orden.", onOrderCancelled: () => {
                        setPendingOrderData(null);
                        setShowPendingOrderModal(false);
                        proceedToPayment(); // Reintentar automáticamente
                    } }))] }) }));
}
