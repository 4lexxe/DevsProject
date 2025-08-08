import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ResourceUserInfo = ({ user, createdAt }) => {
    // NO hacer llamadas al UserService aquí
    // Solo usar los datos que vienen en las props
    const getUserDisplayName = () => {
        return user?.displayName || user?.name || user?.username || 'Usuario desconocido';
    };
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        catch (error) {
            return 'Fecha desconocida';
        }
    };
    return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-2", children: [user?.avatar ? (_jsx("img", { src: user.avatar, alt: getUserDisplayName(), className: "w-5 h-5 rounded-full object-cover" })) : (_jsx("div", { className: "w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600", children: getUserDisplayName().charAt(0).toUpperCase() })), _jsx("span", { className: "font-medium", children: getUserDisplayName() })] }), _jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { children: formatDate(createdAt) })] }));
};
export default ResourceUserInfo;
