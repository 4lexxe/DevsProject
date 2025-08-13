import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ShoppingCart, Check, AlertCircle, BookOpen, Zap, Gift } from 'lucide-react';
import { addCourseToCart } from '@/course/services/cartService';
import { checkIfCourseFree, checkCourseAccess, grantFreeCourseAccess, directPurchaseCourse } from '@/course/services/directPurchaseService';
import PendingOrderModal from './PendingOrderModal';
const PurchaseButtons = ({ courseId, pricing, className = "" }) => {
    console.log('🎯 PurchaseButtons recibió props - courseId:', courseId, 'tipo:', typeof courseId, 'pricing:', pricing);
    const [loading, setLoading] = useState(false);
    const [directPurchaseLoading, setDirectPurchaseLoading] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [isFree, setIsFree] = useState(pricing?.isFree || false);
    const [checkingAccess, setCheckingAccess] = useState(true);
    // Estados para el modal de orden pendiente
    const [showPendingOrderModal, setShowPendingOrderModal] = useState(false);
    const [pendingOrderData, setPendingOrderData] = useState(null);
    // Log para debugging del estado del modal
    console.log('🔍 Estado modal - showPendingOrderModal:', showPendingOrderModal);
    console.log('🔍 Estado modal - pendingOrderData:', pendingOrderData);
    // Verificar acceso al curso al cargar el componente
    useEffect(() => {
        const checkAccess = async () => {
            try {
                const accessResponse = await checkCourseAccess(courseId);
                setHasAccess(accessResponse.hasAccess);
                // Si no tiene acceso y no sabemos si es gratis, verificar
                if (!accessResponse.hasAccess && pricing?.isFree === undefined) {
                    const freeResponse = await checkIfCourseFree(courseId);
                    setIsFree(freeResponse.isFree);
                }
            }
            catch (error) {
                console.error('Error checking course access:', error);
            }
            finally {
                setCheckingAccess(false);
            }
        };
        checkAccess();
    }, [courseId, pricing?.isFree]);
    // Comentario: Se eliminó el auto-grant de cursos gratuitos
    // Ahora el usuario debe hacer clic en "Obtener curso GRATIS" para obtener acceso
    const handleAddToCart = async () => {
        console.log('🛒 handleAddToCart - courseId:', courseId, 'tipo:', typeof courseId);
        try {
            setLoading(true);
            setError(null);
            if (!courseId || courseId === 'undefined') {
                console.error('❌ courseId inválido en handleAddToCart:', courseId);
                setError('ID del curso no válido');
                return;
            }
            console.log('📞 Llamando addCourseToCart con ID:', courseId);
            await addCourseToCart(parseInt(courseId));
            console.log('✅ Curso agregado al carrito exitosamente');
            setAddedToCart(true);
            setTimeout(() => {
                setAddedToCart(false);
            }, 3000);
        }
        catch (error) {
            console.error('❌ Error adding course to cart:', error);
            if (error.response?.status === 422) {
                const errorMessage = error.response?.data?.message;
                const errorData = error.response?.data?.errors; // Cambiar de 'data' a 'errors'
                console.log('🔍 Error 422 carrito - errorMessage:', errorMessage);
                console.log('🔍 Error 422 carrito - errorData (errors):', errorData);
                console.log('🔍 Error 422 carrito - errorData.errorType:', errorData?.errorType);
                if (errorMessage?.includes('ya está en el carrito')) {
                    setError('Ya está en tu carrito');
                }
                else if (errorMessage?.includes('Ya tienes acceso a este curso')) {
                    setHasAccess(true);
                    setError(null);
                }
                else if (errorData?.errorType === 'PENDING_ORDER') {
                    // Detectar error de orden pendiente usando el campo específico también en carrito
                    console.log('🔍 Error de orden pendiente en carrito detectado por errorType');
                    if (errorData?.orderId || errorData?.orderDetails?.length > 0) {
                        // Para carrito puede haber múltiples órdenes, tomar la primera
                        const firstOrder = errorData?.orderDetails?.[0] || errorData;
                        console.log('🔍 Configurando modal carrito con firstOrder:', firstOrder);
                        setPendingOrderData({
                            orderId: firstOrder.orderId || errorData.orderId,
                            orderType: firstOrder.type || errorData.orderType || 'unknown',
                            expirationDate: firstOrder.expirationDate || errorData.expirationDate,
                            courseName: errorData.coursesWithPendingOrders?.[0]?.title || errorData.courseName
                        });
                        setShowPendingOrderModal(true);
                        setError(null); // Asegurar que no hay error de texto
                    }
                    else {
                        setError(errorMessage || 'Error de validación');
                    }
                }
                else {
                    setError(errorMessage || 'Error de validación');
                }
            }
            else if (error.response?.status === 401) {
                setError('Inicia sesión para continuar');
            }
            else {
                const errorMessage = error.response?.data?.message;
                setError(errorMessage || 'Error al agregar al carrito');
            }
            setTimeout(() => {
                setError(null);
            }, 6000);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDirectPurchase = async () => {
        console.log('🔍 handleDirectPurchase - courseId:', courseId, 'tipo:', typeof courseId);
        try {
            setDirectPurchaseLoading(true);
            setError(null);
            if (!courseId || courseId === 'undefined') {
                console.error('❌ courseId inválido en handleDirectPurchase:', courseId);
                setError('ID del curso no válido');
                return;
            }
            if (isFree) {
                console.log('📞 Llamando grantFreeCourseAccess con ID:', courseId);
                await grantFreeCourseAccess(courseId);
                setHasAccess(true);
            }
            else {
                console.log('📞 Llamando directPurchaseCourse con ID:', courseId);
                const response = await directPurchaseCourse(courseId);
                console.log('✅ Respuesta completa de directPurchaseCourse:', response);
                console.log('🔍 initPoint recibido:', response.initPoint, 'tipo:', typeof response.initPoint);
                // Validar initPoint antes de redirigir
                if (!response.initPoint || response.initPoint === 'undefined' || response.initPoint.includes('undefined')) {
                    console.error('❌ initPoint inválido recibido:', response.initPoint);
                    setError('Error: URL de pago inválida');
                    return;
                }
                console.log('🚀 Redirigiendo a:', response.initPoint);
                // Redirigir a MercadoPago igual que el carrito
                window.location.href = response.initPoint;
            }
        }
        catch (error) {
            console.error('❌ Error in direct purchase:', error);
            if (error.response?.status === 401) {
                setError('Inicia sesión para continuar');
            }
            else if (error.response?.status === 422) {
                const errorMessage = error.response?.data?.message;
                const errorData = error.response?.data?.errors; // Cambiar de 'data' a 'errors'
                console.log('🔍 Error 422 - errorMessage:', errorMessage);
                console.log('🔍 Error 422 - errorData (errors):', errorData);
                console.log('🔍 Error 422 - errorData.errorType:', errorData?.errorType);
                if (errorMessage?.includes('Ya tienes acceso')) {
                    setHasAccess(true);
                    setError(null);
                }
                else if (errorData?.errorType === 'PENDING_ORDER') {
                    // Detectar error de orden pendiente usando el campo específico
                    console.log('🔍 Error de orden pendiente detectado por errorType');
                    if (errorData?.orderId) {
                        console.log('🔍 Configurando modal con orderId:', errorData.orderId);
                        setPendingOrderData({
                            orderId: errorData.orderId,
                            orderType: errorData.orderType || 'unknown',
                            expirationDate: errorData.expirationDate,
                            courseName: errorData.courseName
                        });
                        setShowPendingOrderModal(true);
                        setError(null); // Asegurar que no hay error de texto
                    }
                    else {
                        // Solo mostrar error si no tenemos datos para el modal
                        console.log('🔍 No hay orderId, mostrando error normal');
                        setError(errorMessage);
                    }
                }
                else {
                    setError(errorMessage || 'Error de validación');
                }
            }
            else {
                const errorMessage = error.response?.data?.message;
                setError(errorMessage || 'Error en la compra');
            }
            setTimeout(() => {
                setError(null);
            }, 8000); // Aumentar tiempo para errores más largos
        }
        finally {
            setDirectPurchaseLoading(false);
        }
    };
    const handleOrderCancelled = async () => {
        // Resetear estados cuando la orden es cancelada
        setShowPendingOrderModal(false);
        setPendingOrderData(null);
        setError(null);
        // Después de cancelar la orden, proceder automáticamente con la compra
        console.log('Orden cancelada exitosamente, procediendo con la compra...');
        // Pequeña pausa para que el usuario vea que se canceló
        await new Promise(resolve => setTimeout(resolve, 500));
        // Proceder con la compra directa
        await handleDirectPurchase();
    };
    // Componente del modal que siempre está presente
    const ModalWrapper = ({ children }) => {
        return (_jsxs(_Fragment, { children: [_jsx(PendingOrderModal, { isOpen: showPendingOrderModal, onClose: () => setShowPendingOrderModal(false), orderData: pendingOrderData || {
                        orderId: '',
                        orderType: '',
                        expirationDate: '',
                        courseName: ''
                    }, errorMessage: pendingOrderData ? 'Ya tienes una orden de compra pendiente para este curso' : '', onOrderCancelled: handleOrderCancelled }), children] }));
    };
    // Si está verificando acceso, mostrar loading
    if (checkingAccess) {
        return (_jsx(ModalWrapper, { children: _jsx("div", { className: `space-y-3 ${className}`, children: _jsxs("div", { className: "flex items-center justify-center py-3", children: [_jsx("div", { className: "w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Verificando acceso..." })] }) }) }));
    }
    // Si ya tiene acceso al curso
    if (hasAccess) {
        return (_jsx(ModalWrapper, { children: _jsx("div", { className: `space-y-3 ${className}`, children: _jsxs("button", { disabled: true, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-green-500 text-white", children: [_jsx(BookOpen, { className: "w-5 h-5" }), "Ya tienes acceso a este curso"] }) }) }));
    }
    // Si el curso es gratuito
    if (isFree) {
        return (_jsx(ModalWrapper, { children: _jsx("div", { className: `space-y-3 ${className}`, children: _jsx("button", { onClick: handleDirectPurchase, disabled: directPurchaseLoading, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white hover:scale-105", children: directPurchaseLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Agregando a tus cursos..."] })) : (_jsxs(_Fragment, { children: [_jsx(Gift, { className: "w-5 h-5" }), "Obtener curso GRATIS"] })) }) }) }));
    }
    // Botones para cursos de pago
    return (_jsx(ModalWrapper, { children: _jsxs("div", { className: `space-y-3 ${className}`, children: [error && !showPendingOrderModal && (_jsx("div", { className: "w-full p-4 rounded-lg bg-red-50 border border-red-200", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "flex-1", children: _jsx("p", { className: "text-sm text-red-800 leading-relaxed", children: error }) }), _jsx("button", { onClick: () => setError(null), className: "text-red-400 hover:text-red-600 transition-colors p-1", "aria-label": "Cerrar mensaje", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) })), _jsx("button", { onClick: handleDirectPurchase, disabled: directPurchaseLoading, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white hover:scale-105", children: directPurchaseLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Procesando compra..."] })) : (_jsxs(_Fragment, { children: [_jsx(Zap, { className: "w-5 h-5" }), pricing?.isFree ? 'Obtener Gratis' : `Comprar ahora ${pricing?.priceDisplay || '$0.00'}`] })) }), addedToCart ? (_jsxs("button", { disabled: true, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-blue-500 text-white", children: [_jsx(Check, { className: "w-5 h-5" }), "Agregado al carrito"] })) : (_jsx("button", { onClick: handleAddToCart, disabled: loading, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Agregando..."] })) : (_jsxs(_Fragment, { children: [_jsx(ShoppingCart, { className: "w-5 h-5" }), "Agregar al carrito"] })) }))] }) }));
};
export default PurchaseButtons;
