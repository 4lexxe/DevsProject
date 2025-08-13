import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotFound from '@/shared/components/NotFound'; // Asegúrate de tener este componente
const ProtectedRouteAdmin = ({ allowedRoles }) => {
    const { user } = useAuth();
    // Si no hay usuario, redirige a login
    // Si se especifican roles permitidos y el usuario no cumple, se muestra un 404
    if (allowedRoles && (!user || !user.role || !allowedRoles.includes(user.role.name))) {
        return _jsx(NotFound, {});
    }
    // Si todo está en orden, renderiza el Outlet para las rutas hijas
    return _jsx(Outlet, {});
};
export default ProtectedRouteAdmin;
