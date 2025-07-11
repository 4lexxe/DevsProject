import { useState, useEffect } from 'react';
import AuthService from '../../user/services/auth.service';

export const usePermissions = () => {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    const checkUser = () => {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    };

    // Verificar cambios en el usuario cada segundo
    const interval = setInterval(checkUser, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Función de debug para verificar permisos
  const debugPermissions = () => {
    console.log('🔍 Debug Permisos:', {
      user: user,
      isAuthenticated: !!user,
      role: user?.role?.name,
      permissions: user?.role?.permissions || [],
      hasCommentPermission: AuthService.hasPermission('comment:resources'),
      hasRatePermission: AuthService.hasPermission('rate:resources'),
      canManageOwnComments: AuthService.canManageOwnComments(),
      canManageOwnRatings: AuthService.canManageOwnRatings()
    });
  };

  // Ejecutar debug en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      debugPermissions();
    }
  }, [user]);

  return {
    user,
    debugPermissions,
    hasPermission: (permission: string) => {
      const hasPermission = AuthService.hasPermission(permission);
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Verificando permiso '${permission}':`, hasPermission);
      }
      return hasPermission;
    },
    hasAnyPermission: (permissions: string[]) => AuthService.hasAnyPermission(permissions),
    canManageOwnResources: () => AuthService.canManageOwnResources(),
    canModerateAllResources: () => AuthService.canModerateAllResources(),
    canManageOwnComments: () => AuthService.canManageOwnComments(),
    canModerateAllComments: () => AuthService.canModerateAllComments(),
    canManageOwnRatings: () => AuthService.canManageOwnRatings(),
    canModerateAllRatings: () => AuthService.canModerateAllRatings(),
    isOwner: (itemUserId: number) => user?.id === itemUserId,
    canModifyResource: (resourceUserId: number) => {
      return AuthService.canModerateAllResources() || 
             (AuthService.canManageOwnResources() && user?.id === resourceUserId);
    },
    canModifyComment: (commentUserId: number) => {
      return AuthService.canModerateAllComments() || 
             (AuthService.canManageOwnComments() && user?.id === commentUserId);
    },
    canModifyRating: (ratingUserId: number) => {
      return AuthService.canModerateAllRatings() || 
             (AuthService.canManageOwnRatings() && user?.id === ratingUserId);
    }
  };
};
