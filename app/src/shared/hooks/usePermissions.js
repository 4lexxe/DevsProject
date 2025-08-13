import { useState, useEffect } from 'react';
import AuthService from '../../user/services/auth.service';
export const usePermissions = () => {
    const [user, setUser] = useState(AuthService.getCurrentUser());
    useEffect(() => {
        const checkUser = () => setUser(AuthService.getCurrentUser());
        const interval = setInterval(checkUser, 1000);
        return () => clearInterval(interval);
    }, []);
    // Función principal de verificación de permisos
    const checkPermission = (permission, ownerId) => {
        if (!user)
            return false;
        const userRole = user.role?.name;
        const permissions = user.role?.permissions || [];
        // Superadmin tiene acceso total
        if (userRole === 'superadmin')
            return true;
        // Admin tiene acceso total excepto algunos permisos específicos de superadmin
        if (userRole === 'admin')
            return true;
        // Verificar si es propietario
        const isOwner = ownerId !== undefined && user.id === ownerId;
        // Si es array de permisos, verificar si tiene alguno
        if (Array.isArray(permission)) {
            return permission.some(p => permissions.includes(p) || (isOwner && p.includes('own')));
        }
        // Verificar permiso específico
        return permissions.includes(permission) || (isOwner && permission.includes('own'));
    };
    return {
        user,
        // Métodos básicos de AuthService
        hasPermission: (permission) => checkPermission(permission),
        hasAnyPermission: (permissions) => checkPermission(permissions),
        // Métodos específicos simplificados
        canManageOwnResources: () => checkPermission('manage:own_resources'),
        canModerateAllResources: () => checkPermission('moderate:all_resources'),
        canManageOwnComments: () => checkPermission('manage:own_comments'),
        canModerateAllComments: () => checkPermission('moderate:all_comments'),
        canManageOwnRatings: () => checkPermission('manage:own_ratings'),
        canModerateAllRatings: () => checkPermission('moderate:all_ratings'),
        // Verificadores de propiedad
        isOwner: (itemUserId) => user?.id === itemUserId,
        // Funciones principales consolidadas
        canModifyResource: (resourceUserId) => checkPermission(['manage:own_resources', 'moderate:all_resources'], resourceUserId),
        canModifyComment: (commentUserId) => checkPermission(['manage:own_comments', 'moderate:all_comments'], commentUserId),
        canModifyRating: (ratingUserId) => checkPermission(['manage:own_ratings', 'moderate:all_ratings'], ratingUserId),
        canDeleteAnyResource: () => checkPermission('moderate:all_resources') || user?.role?.name === 'admin'
    };
};
