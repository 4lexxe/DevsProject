import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role.name))) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return _jsx(Outlet, {});
};
export default ProtectedRoute;
