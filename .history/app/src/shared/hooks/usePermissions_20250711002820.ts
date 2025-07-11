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

  return {
    user,
    hasPermission: (permission: string) => AuthService.hasPermission(permission),
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
