import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Home, BookOpen, User, Menu, Settings, MessageCircle, LogIn, UserPlus, CreditCard, X, LogOut, Crown, } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/user/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function BottomNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
    const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
    const authDropdownRef = useRef(null);
    const profileButtonRef = useRef(null);
    const navItems = [
        { icon: Home, label: "Inicio", path: "/" },
        { icon: BookOpen, label: "Cursos", path: "/cursos" },
        {
            icon: undefined,
            label: user ? "Perfil" : "Ingresar",
            path: user ? "/profile" : "#",
            isProfile: true,
        },
        { icon: Crown, label: "Planes", path: "/plans" },
    ];
    const menuItems = [
        { icon: Home, label: "Inicio", path: "/" },
        { icon: BookOpen, label: "Cursos", path: "/cursos" },
        { icon: Settings, label: "Ajustes", path: "/ajustes" },
        { icon: MessageCircle, label: "Foro", path: "/foro" },
        { icon: CreditCard, label: "Planes", path: "/plans" },
        { icon: User, label: "Perfil", path: "/profile" },
    ];
    const handleLogout = async () => {
        try {
            await logout();
            setIsGridMenuOpen(false);
            navigate('/');
        }
        catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    const isActive = (path) => location.pathname === path;
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (authDropdownRef.current &&
                !authDropdownRef.current.contains(event.target) &&
                !profileButtonRef.current?.contains(event.target)) {
                setIsAuthDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        setIsGridMenuOpen(false);
        setIsAuthDropdownOpen(false);
    }, [location]);
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: "fixed bottom-0 left-0 right-0 bg-white shadow-md border-t h-20 z-50", children: _jsxs("div", { className: "relative grid grid-cols-5 h-full items-center justify-center px-4", children: [navItems.map(({ icon: Icon, label, path, isProfile }) => {
                            if (isProfile) {
                                return (_jsxs("div", { className: "col-span-1 flex items-center justify-center relative", children: [_jsx("button", { ref: profileButtonRef, onClick: (e) => {
                                                e.preventDefault();
                                                if (user) {
                                                    navigate(path);
                                                }
                                                else {
                                                    setIsAuthDropdownOpen(!isAuthDropdownOpen);
                                                }
                                            }, className: "w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-blue-600 hover:text-blue-600", children: user ? (_jsx("img", { src: user.avatar ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`, alt: user.name, className: "h-10 w-10 rounded-full object-cover" })) : (_jsx(User, { className: "h-10 w-10 text-gray-500" })) }), _jsx(AnimatePresence, { children: isAuthDropdownOpen && !user && (_jsxs(motion.div, { ref: authDropdownRef, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.2 }, className: "absolute bottom-full mb-4 transform -translate-x-1/2 flex gap-4 items-center z-50", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("button", { onClick: () => {
                                                                    navigate("/login");
                                                                    setIsAuthDropdownOpen(false);
                                                                }, className: "w-12 h-12 rounded-full bg-white border-2 border-gray-400 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-gray-600", children: _jsx(LogIn, { className: "h-6 w-6 text-gray-600" }) }), _jsx("span", { className: "text-xs font-medium text-gray-600 mt-1 bg-white px-2 rounded", children: "Ingresar" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("button", { onClick: () => {
                                                                    navigate("/register");
                                                                    setIsAuthDropdownOpen(false);
                                                                }, className: "w-12 h-12 rounded-full bg-white border-2 border-gray-400 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-gray-600", children: _jsx(UserPlus, { className: "h-6 w-6 text-gray-600" }) }), _jsx("span", { className: "text-xs font-medium text-gray-600 mt-1 bg-white px-2 rounded", children: "Registrar" })] })] })) })] }, path));
                            }
                            return (_jsxs("button", { onClick: () => navigate(path), className: `flex flex-col items-center justify-center transition-all duration-300 ease-in-out p-2 rounded-md hover:bg-gray-100 ${isActive(path) ? "text-blue-600" : "text-gray-500"}`, children: [Icon && _jsx(Icon, { className: "h-6 w-6" }), _jsx("span", { className: "text-xs font-medium mt-1", children: label })] }, path));
                        }), _jsx("div", { className: "col-span-1 flex items-center justify-center relative", children: _jsxs("button", { onClick: () => setIsGridMenuOpen(true), className: `flex flex-col items-center justify-center transition-all duration-300 ease-in-out p-2 rounded-md hover:bg-gray-100 text-gray-500`, children: [_jsx(Menu, { className: "h-6 w-6" }), _jsx("span", { className: "text-xs font-medium mt-1", children: "Men\u00FA" })] }) })] }) }), _jsx(AnimatePresence, { children: isGridMenuOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "fixed inset-0 bg-black/50 z-50", onClick: () => setIsGridMenuOpen(false) }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { type: "spring", damping: 25, stiffness: 200 }, className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Men\u00FA" }), _jsx("button", { onClick: () => setIsGridMenuOpen(false), className: "p-2 rounded-full hover:bg-gray-100 transition-colors", children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), user && (_jsx("div", { className: "p-4 border-b border-gray-200 bg-gray-50", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("img", { src: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`, alt: user.name, className: "h-10 w-10 rounded-full object-cover" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: user.name }), _jsx("p", { className: "text-sm text-gray-500", children: "En l\u00EDnea" })] })] }) })), _jsx("div", { className: "p-4", children: _jsx("div", { className: "grid grid-cols-2 gap-3", children: menuItems.map(({ icon: Icon, label, path }, index) => (_jsxs(motion.button, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, onClick: () => {
                                                    navigate(path);
                                                    setIsGridMenuOpen(false);
                                                }, className: "flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200", children: [_jsx(Icon, { className: "w-6 h-6 text-gray-600 mb-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700 text-center", children: label })] }, path))) }) }), _jsx("div", { className: "p-4 border-t border-gray-200", children: user ? (_jsxs("button", { onClick: handleLogout, className: "w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: [_jsx(LogOut, { className: "h-4 w-4 mr-2" }), "Cerrar sesi\u00F3n"] })) : (_jsxs("div", { className: "space-y-2", children: [_jsxs("button", { onClick: () => {
                                                        navigate("/login");
                                                        setIsGridMenuOpen(false);
                                                    }, className: "w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(LogIn, { className: "h-4 w-4 mr-2" }), "Iniciar Sesi\u00F3n"] }), _jsxs("button", { onClick: () => {
                                                        navigate("/register");
                                                        setIsGridMenuOpen(false);
                                                    }, className: "w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx(UserPlus, { className: "h-4 w-4 mr-2" }), "Registrarse"] })] })) })] }) })] })) })] }));
}
