import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '@/user/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, Settings, Mail, Key, Calendar, Shield, LogOut } from 'lucide-react';
const Profile = () => {
    const { user, logout, loading } = useAuth();
    if (user) {
        console.log(user.email);
        console.log(user.displayName);
        console.log('el id del usuario es', user.id);
    }
    if (loading) {
        return _jsx("div", { children: "Cargando..." }); // Mostrar un mensaje de carga mientras se verifica la autenticación
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    const handleLogout = async () => {
        try {
            await logout();
        }
        catch (error) {
            console.error('Error durante el cierre de sesión:', error);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("div", { className: "px-6 py-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-center", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`, alt: user.name, className: "w-32 h-32 rounded-full border-4 border-white bg-white object-cover" }), user.isActiveSession && (_jsx("span", { className: "absolute bottom-2 right-2 h-4 w-4 bg-green-400 rounded-full border-2 border-white" }))] }), _jsxs("div", { className: "mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left flex-grow", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: user.name }), _jsxs("p", { className: "text-gray-500", children: ["@", user.username] }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-2 justify-center sm:justify-start", children: [_jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800", children: user.role?.name || 'Usuario' }), _jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800", children: user.authProvider })] })] }), _jsxs("button", { onClick: handleLogout, className: "mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500", children: [_jsx(LogOut, { className: "h-4 w-4 mr-2" }), "Cerrar sesi\u00F3n"] })] }), _jsxs("div", { className: "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2", children: [_jsxs("div", { className: "flex items-center p-4 bg-gray-50 rounded-lg", children: [_jsx(Mail, { className: "h-6 w-6 text-gray-400" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Correo electr\u00F3nico" }), _jsx("p", { className: "text-sm text-gray-900", children: user.email })] })] }), _jsxs("div", { className: "flex items-center p-4 bg-gray-50 rounded-lg", children: [_jsx(User, { className: "h-6 w-6 text-gray-400" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Nombre para mostrar" }), _jsx("p", { className: "text-sm text-gray-900", children: user.displayName || user.name })] })] }), _jsxs("div", { className: "flex items-center p-4 bg-gray-50 rounded-lg", children: [_jsx(Calendar, { className: "h-6 w-6 text-gray-400" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\u00DAltima actividad" }), _jsx("p", { className: "text-sm text-gray-900", children: user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'N/A' })] })] }), _jsxs("div", { className: "flex items-center p-4 bg-gray-50 rounded-lg", children: [_jsx(Shield, { className: "h-6 w-6 text-gray-400" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Autenticaci\u00F3n" }), _jsx("p", { className: "text-sm text-gray-900 capitalize", children: user.authProvider })] })] })] }), _jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Configuraci\u00F3n de la cuenta" }), _jsxs("div", { className: "mt-4 space-y-4", children: [_jsx("button", { className: "w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Settings, { className: "h-6 w-6 text-gray-400" }), _jsx("span", { className: "ml-4 text-sm font-medium text-gray-900", children: "Editar perfil" })] }) }), _jsx("button", { className: "w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Key, { className: "h-6 w-6 text-gray-400" }), _jsx("span", { className: "ml-4 text-sm font-medium text-gray-900", children: "Cambiar contrase\u00F1a" })] }) })] })] })] }) }) }) }));
};
export default Profile;
