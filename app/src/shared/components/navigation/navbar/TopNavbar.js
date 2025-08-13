import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Bell, Search, ShoppingCart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';
import { useState, useEffect } from 'react';
import SearchInput from '../../search/SearchInput';
import MobileSearchOverlay from '../../search/MobileSearchOverlay';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { cartService } from '@/payment/services/cartService';
const getPageTitle = (pathname) => {
    switch (pathname) {
        case '/':
            return 'Inicio';
        case '/cursos':
            return 'Cursos';
        default:
            return 'Inicio';
    }
};
export default function TopNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth(); // Obtener el estado del usuario desde el contexto de autenticación
    const pageTitle = getPageTitle(location.pathname);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    // Obtener la cantidad de items en el carrito
    useEffect(() => {
        const fetchCartData = async () => {
            if (user) {
                try {
                    const cartData = await cartService.getActiveCart();
                    setCartItemsCount(cartData?.summary?.courseCount || 0);
                }
                catch (error) {
                    console.error('Error obteniendo datos del carrito:', error);
                    setCartItemsCount(0);
                }
            }
            else {
                setCartItemsCount(0);
            }
        };
        fetchCartData();
    }, [user]);
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: "fixed top-0 left-0 right-0 bg-white shadow-md h-20 z-50", children: _jsxs("div", { className: "flex items-center justify-between px-4 h-full", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("img", { src: "https://i.ibb.co/dQ09SsH/logoDev2.png", alt: "Dev's Project", className: "h-12 w-12 object-contain" }), _jsx("h1", { className: `font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`, children: pageTitle })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [isMobile ? (
                                /* Vista móvil: Solo ícono de búsqueda */
                                _jsx("button", { onClick: () => setIsMobileSearchOpen(true), className: "p-3 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(Search, { className: "h-6 w-6 text-gray-600" }) })) : (
                                /* Vista desktop: Barra de búsqueda completa */
                                _jsx("div", { className: "w-64", children: _jsx(SearchInput, { placeholder: "Buscar cursos..." }) })), user && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => navigate('/cart'), className: "p-3 hover:bg-gray-100 rounded-full relative transition-colors", children: [_jsx(ShoppingCart, { className: "h-6 w-6 text-gray-600" }), cartItemsCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium", style: { backgroundColor: "rgb(66, 215, 199)", color: "#0c154c" }, children: cartItemsCount }))] }), _jsxs("button", { className: "p-3 hover:bg-gray-100 rounded-full relative", children: [_jsx(Bell, { className: "h-6 w-6 text-gray-600" }), _jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium", children: "3" })] })] }))] })] }) }), _jsx(MobileSearchOverlay, { isOpen: isMobileSearchOpen, onClose: () => setIsMobileSearchOpen(false), placeholder: "Buscar cursos, recursos..." })] }));
}
