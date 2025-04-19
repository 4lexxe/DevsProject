import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/contexts/AuthContext';
import api from '@/api/axios';
import { AlertTriangle } from 'lucide-react';
import { AxiosError } from 'axios';
import NotFound from '@/shared/components/NotFound';

interface PermissionProtectedRouteProps {
  requiredPermissions: string[];
  children?: React.ReactNode;
}

interface Permission {
  id: number;
  name: string;
  description?: string;
  source?: string;
}

// Extendemos la interfaz User para manejar diferentes propiedades según el contexto
interface ExtendedUser {
  id?: number;
  role?: string;
  roleName?: string;
  [key: string]: string | number | boolean | undefined; // Tipos más específicos para propiedades dinámicas
}

const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({
  requiredPermissions,
  children
}) => {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  
  // Para desarrollo, NO permitir todos los accesos - trabajar con permisos reales
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Deshabilitar permisos de desarrollo - SOLO usar permisos reales
  //const useDevPermissions = false;
  
  // Estado para controlar si ya verificamos la autenticación
  const [checkedAuth, setCheckedAuth] = useState(false);

  // En desarrollo, consideramos autenticado si hay un objeto user
  const isAuthenticated = !!user;
  const extendedUser = user as unknown as ExtendedUser;

  // Efecto para dar tiempo a que el usuario se cargue antes de verificar la autenticación
  useEffect(() => {
    // Si ya hay un usuario, marcamos la autenticación como verificada inmediatamente
    if (user) {
      setCheckedAuth(true);
      return;
    }

    // En desarrollo, esperamos un poco más para dar tiempo a que se cargue el usuario
    if (isDevelopment) {
      const timer = setTimeout(() => {
        setCheckedAuth(true);
      }, 1500); // Aumentamos a 1.5 segundos para dar más tiempo
      
      return () => clearTimeout(timer);
    } else {
      // En producción verificamos inmediatamente
      setCheckedAuth(true);
    }
  }, [user, isDevelopment]);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Intentar obtener permisos del usuario
        const response = await api.get(`/users/${user.id}/permissions`);
        console.log('Respuesta de permisos desde API:', response.data);
        
        // Obtener todos los permisos disponibles para el usuario
        const availablePermissions = response.data.availablePermissions || [];
        const permissionNames = availablePermissions.map((p: Permission) => p.name);
        
        // Añadir superadmin:full_access si el usuario es superadmin
        const userRole = extendedUser.role || extendedUser.roleName || '';
        if (typeof userRole === 'string' && userRole.toLowerCase() === 'superadmin') {
          permissionNames.push('superadmin:full_access');
        }
        
        // Establecer los permisos del usuario (solo reales, sin permisos de desarrollo)
        setUserPermissions(permissionNames);
        
      } catch (error) {
        console.error('Error obteniendo permisos del usuario:', error);
        const axiosError = error as AxiosError;
        
        if (axiosError.response) {
          console.error('Respuesta del servidor:', axiosError.response.status, axiosError.response.data);
        }
        
        setError('No se pudieron verificar tus permisos. Por favor, intenta nuevamente.');
        setUserPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user, extendedUser]);

  // Efecto para evaluar y mostrar si el usuario tiene los permisos necesarios
  useEffect(() => {
    if (!isAuthenticated || !user || userPermissions.length === 0) {
      return; // No evaluar si no hay datos suficientes
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const matchingPermissions = requiredPermissions.filter(permission => 
      userPermissions.includes(permission)
    );
    
    const hasRequiredPermissions = requiredPermissions.length === 0 || matchingPermissions.length > 0;
    const isSuperAdmin = userPermissions.includes('superadmin:full_access');
    const accessGranted = hasRequiredPermissions || isSuperAdmin;
    
    // Enviar la información de la evaluación al backend para registro
    const sendPermissionLogToServer = async () => {
      try {
        // Obtener roles del usuario
        let userRoles: string[] = [];
        const userRole = extendedUser.role || extendedUser.roleName || '';
        
        if (typeof userRole === 'string' && userRole.trim() !== '') {
          userRoles = [userRole];
        }
        
        // Datos para el log
        const logData = {
          username: user.username || user.email || user.name,
          userId: user.id,
          route: location.pathname,
          requiredPermissions,
          userPermissions,
          matchingPermissions,
          isSuperAdmin,
          accessGranted,
          userRoles
        };
        
        // Enviar al backend - silenciar cualquier error para no afectar la UX
        await api.post('/auth/permissions-log', logData)
          .catch(() => {
            // Ignorar errores de registro - es solo para propósitos de auditoría
          });
      } catch {
        // No hacer nada, es solo un log
      }
    };
    
    // Enviar el log al servidor
    sendPermissionLogToServer();
    
  }, [user, userPermissions, requiredPermissions, isAuthenticated, location.pathname]);

  // Si aún no hemos verificado la autenticación y no hay usuario, mostrar pantalla de carga
  if (!checkedAuth && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
        <p className="ml-3 text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  // Si ya verificamos la autenticación y no hay usuario, redirigir a login
  if (checkedAuth && !isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay usuario pero estamos cargando permisos, mostrar pantalla de carga
  if (loading && user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
        <p className="ml-3 text-gray-600">Cargando permisos...</p>
      </div>
    );
  }

  if (error) {
    // Mostrar un mensaje de error si no se pudieron verificar los permisos
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
        <p className="text-red-600 text-lg font-medium text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Verificar si el usuario tiene al menos uno de los permisos requeridos
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => userPermissions.includes(permission));

  // Si el usuario es superadmin, siempre permitir acceso
  const isSuperAdmin = userPermissions.includes('superadmin:full_access');

  // Si no tiene los permisos necesarios, mostrar página 404
  if (!hasRequiredPermissions && !isSuperAdmin) {
    // No mostrar mensajes en la consola del navegador
    return <NotFound />;
  }

  // Si tiene los permisos necesarios, renderizar los hijos o el Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PermissionProtectedRoute; 