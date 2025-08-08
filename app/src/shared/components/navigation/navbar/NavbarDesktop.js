import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, LogIn, UserPlus, CreditCard, Bell, BookOpen, ShoppingCart } from 'lucide-react';
import SearchInput from '../../search/SearchInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';
import NavLink from '../navbar/NavLink';
import AuthButton from '../../buttons/AuthButton';
import { cartService } from '@/payment/services/cartService';
export default function DesktopNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const profileMenuRef = useRef(null);
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
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);
    const handleLogout = async () => {
        try {
            await logout();
            setIsProfileOpen(false);
            navigate('/');
        }
        catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    return (_jsx("nav", { className: "bg-white border-b border-gray-200 sticky top-0 left-0 w-full z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("a", { href: "/", className: "flex items-center", children: _jsx("img", { src: "https://i.ibb.co/dQ09SsH/logoDev2.png", alt: "Dev's Project", className: "h-12 w-12 object-contain" }) }) }), _jsx("div", { className: "flex-1 max-w-md mx-8", children: _jsx(SearchInput, { placeholder: "Buscar cursos, recursos..." }) }), _jsxs("div", { className: "hidden md:flex items-center space-x-8", children: [_jsx(NavLink, { href: "/cursos", icon: _jsx(BookOpen, { className: "w-4 h-4" }), children: "Cursos" }), _jsx(NavLink, { href: "/plans", icon: _jsx(CreditCard, { className: "w-4 h-4" }), children: "Planes" }), _jsxs("div", { className: "relative", children: [_jsx(NavLink, { href: "/cart", icon: _jsx(ShoppingCart, { className: "w-4 h-4" }), children: "Carrito" }), user && cartItemsCount > 0 && (_jsx("span", { className: "absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium", style: { backgroundColor: "rgb(66, 215, 199)", color: "#0c154c" }, children: cartItemsCount }))] })] }), _jsx("div", { className: "flex items-center space-x-4", children: user ? (_jsxs(_Fragment, { children: [_jsxs("button", { className: "relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg", children: [_jsx(Bell, { className: "h-6 w-6" }), _jsx("span", { className: "absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" })] }), _jsx(UserMenu, { user: user, isProfileOpen: isProfileOpen, setIsProfileOpen: setIsProfileOpen, profileMenuRef: profileMenuRef, handleLogout: handleLogout })] })) : (_jsx(AuthButtons, {})) })] }) }) }));
}
function UserMenu({ user, isProfileOpen, setIsProfileOpen, profileMenuRef, handleLogout }) {
    return (_jsxs("div", { className: "relative", ref: profileMenuRef, children: [_jsx("button", { onClick: () => setIsProfileOpen(!isProfileOpen), className: "flex items-center space-x-2 p-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: _jsx("img", { src: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6b7280&color=fff`, alt: user.name, className: "h-8 w-8 rounded-full object-cover" }) }), isProfileOpen && (_jsxs("div", { className: "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5", children: [_jsx("div", { className: "px-4 py-2 border-b border-gray-100", children: _jsx("p", { className: "text-sm font-medium text-gray-900", children: user.name }) }), _jsx(MenuLink, { href: "/profile", icon: User, children: "Perfil" }), _jsx(MenuLink, { href: "/subscription", icon: CreditCard, children: "Suscripci\u00F3n" }), _jsx(MenuLink, { href: "/user/orders", icon: ShoppingCart, children: "Mis ordenes" }), _jsx(MenuLink, { href: "/my-courses", icon: BookOpen, children: "Mis cursos" }), _jsx(MenuLink, { href: "/settings", icon: Settings, children: "Configuraci\u00F3n" }), _jsxs("button", { onClick: handleLogout, className: "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [_jsx(LogOut, { className: "mr-3 h-4 w-4" }), "Cerrar sesi\u00F3n"] })] }))] }));
}
function MenuLink({ href, icon: Icon, children }) {
    return (_jsxs("a", { href: href, className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [_jsx(Icon, { className: "mr-3 h-4 w-4" }), children] }));
}
function AuthButtons() {
    return (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs(AuthButton, { variant: "secondary", href: "/login", className: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx(LogIn, { className: "h-4 w-4 mr-2" }), "Iniciar Sesi\u00F3n"] }), _jsxs(AuthButton, { variant: "primary", href: "/register", className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx(UserPlus, { className: "h-4 w-4 mr-2" }), "Registrarse"] })] }));
}
