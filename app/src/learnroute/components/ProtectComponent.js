import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from '@/user/contexts/AuthContext';
const ProtectedComponent = ({ children }) => {
    const { user } = useAuth();
    // Validación de rol: Se comprueba de forma estricta que el usuario tenga privilegios.
    // Nota: Esta validación es para la experiencia de usuario, la seguridad crítica se implementa en el backend.
    const hasPrivileges = user && (user.role?.name === 'superadmin' ||
        (user.role?.permissions && user.role.permissions.includes('privileged')));
    if (!hasPrivileges) {
        // Si el usuario no tiene privilegios, no se renderiza el componente.
        return null;
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedComponent;
