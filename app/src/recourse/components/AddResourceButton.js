import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../user/contexts/AuthContext';
const AddResourceButton = () => {
    const { user } = useAuth(); // Obtiene el estado del usuario desde el contexto
    // Si el usuario no está autenticado, no se muestra el botón
    if (!user) {
        return null;
    }
    return (_jsxs(Link, { to: "/resources/create", className: "inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-900 to-sky-900 hover:from-sky-800 hover:to-sky-950 text-white rounded-md transition-all duration-200 shadow-sm hover:shadow group responsive-button", children: [_jsx(Plus, { className: "w-6 h-6 plus-icon group-hover:scale-110 transition-transform" }), _jsx("span", { className: "hidden md:inline-block ml-2", children: "Agregar Recurso" })] }));
};
export default AddResourceButton;
