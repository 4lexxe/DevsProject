import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ShoppingCart, Check, AlertCircle, BookOpen, Zap, Gift } from 'lucide-react';
import { addCourseToCart } from '@/course/services/cartService';
import { checkIfCourseFree, checkCourseAccess, grantFreeCourseAccess, directPurchaseCourse } from '@/course/services/directPurchaseService';
const PurchaseButtons = ({ courseId, pricing, className = "" }) => {
    console.log('🎯 PurchaseButtons recibió props - courseId:', courseId, 'tipo:', typeof courseId, 'pricing:', pricing);
    const [loading, setLoading] = useState(false);
    const [directPurchaseLoading, setDirectPurchaseLoading] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [isFree, setIsFree] = useState(pricing?.isFree || false);
    const [checkingAccess, setCheckingAccess] = useState(true);
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
                if (errorMessage?.includes('ya está en el carrito')) {
                    setError('Ya está en tu carrito');
                }
                else if (errorMessage?.includes('Ya tienes acceso a este curso')) {
                    setHasAccess(true);
                    setError(null);
                }
                else {
                    setError('Error de validación');
                }
            }
            else if (error.response?.status === 401) {
                setError('Inicia sesión para continuar');
            }
            else {
                setError('Error al agregar al carrito');
            }
            setTimeout(() => {
                setError(null);
            }, 4000);
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
                if (errorMessage?.includes('Ya tienes acceso')) {
                    setHasAccess(true);
                    setError(null);
                }
                else {
                    setError('Error de validación');
                }
            }
            else {
                setError('Error en la compra');
            }
            setTimeout(() => {
                setError(null);
            }, 4000);
        }
        finally {
            setDirectPurchaseLoading(false);
        }
    };
    // Si está verificando acceso, mostrar loading
    if (checkingAccess) {
        return (_jsx("div", { className: `space-y-3 ${className}`, children: _jsxs("div", { className: "flex items-center justify-center py-3", children: [_jsx("div", { className: "w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Verificando acceso..." })] }) }));
    }
    // Si ya tiene acceso al curso
    if (hasAccess) {
        return (_jsx("div", { className: `space-y-3 ${className}`, children: _jsxs("button", { disabled: true, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-green-500 text-white", children: [_jsx(BookOpen, { className: "w-5 h-5" }), "Ya tienes acceso a este curso"] }) }));
    }
    // Si hay error
    if (error) {
        return (_jsx("div", { className: `space-y-3 ${className}`, children: _jsxs("button", { onClick: () => setError(null), className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), error] }) }));
    }
    // Si el curso es gratuito
    if (isFree) {
        return (_jsx("div", { className: `space-y-3 ${className}`, children: _jsx("button", { onClick: handleDirectPurchase, disabled: directPurchaseLoading, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white hover:scale-105", children: directPurchaseLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Agregando a tus cursos..."] })) : (_jsxs(_Fragment, { children: [_jsx(Gift, { className: "w-5 h-5" }), "Obtener curso GRATIS"] })) }) }));
    }
    // Botones para cursos de pago
    return (_jsxs("div", { className: `space-y-3 ${className}`, children: [_jsx("button", { onClick: handleDirectPurchase, disabled: directPurchaseLoading, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white hover:scale-105", children: directPurchaseLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Procesando compra..."] })) : (_jsxs(_Fragment, { children: [_jsx(Zap, { className: "w-5 h-5" }), pricing?.finalPrice === 0 ? 'Obtener Gratis' : `Comprar ahora $${pricing?.finalPrice?.toFixed(2) || '0.00'}`] })) }), addedToCart ? (_jsxs("button", { disabled: true, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-blue-500 text-white", children: [_jsx(Check, { className: "w-5 h-5" }), "Agregado al carrito"] })) : (_jsx("button", { onClick: handleAddToCart, disabled: loading, className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Agregando..."] })) : (_jsxs(_Fragment, { children: [_jsx(ShoppingCart, { className: "w-5 h-5" }), "Agregar al carrito"] })) }))] }));
};
export default PurchaseButtons;
