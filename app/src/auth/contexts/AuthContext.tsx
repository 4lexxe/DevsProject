import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '../services/auth.service';
import useSocket from '../../hooks/useSocket'; // Importar el hook useSocket

// Definir el tipo del contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
  showWelcomeMessage: boolean;
  setShowWelcomeMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false); // Estado para rastrear si se mostró el mensaje
  const { socket } = useSocket(); // Usar el hook useSocket

  // Verificar si el usuario ya vio el mensaje de bienvenida
  useEffect(() => {
    const wasLoggedBefore = localStorage.getItem("wasLoggedIn");
    if (wasLoggedBefore === "true" && !welcomeMessageShown) {
      setShowWelcomeMessage(true);
      setWelcomeMessageShown(true); // Marcar como mostrado
      localStorage.removeItem("wasLoggedIn"); // Limpiar el indicador
    }
  }, [welcomeMessageShown]);

  // Verificar autenticación inicial
  useEffect(() => {
    if (!hasCheckedAuth) {
      verifyAuth();
    }
  }, [hasCheckedAuth]);

  // Escuchar actualizaciones de sesión desde el backend
  useEffect(() => {
    if (socket) {
      socket.on('sessionUpdated', (updatedUser: User) => {
        setUser((prevUser) => {
          if (prevUser && prevUser.id === updatedUser.id) {
            return {
              ...prevUser,
              isActiveSession: updatedUser.isActiveSession,
              lastActiveAt: updatedUser.lastActiveAt,
            };
          }
          return prevUser;
        });
        // Mostrar notificación si la sesión está activa
        if (updatedUser.isActiveSession) {
          console.log(`La sesión del usuario ${updatedUser.email} está activa.`);
          alert(`Bienvenido de nuevo! Su sesión está activa.`);
        }
        // Mostrar notificación si hay una actualización en la última actividad
        if (updatedUser.lastActiveAt) {
          console.log(`Última actividad del usuario ${updatedUser.email}: ${updatedUser.lastActiveAt}`);
          alert(`Última actividad registrada: ${updatedUser.lastActiveAt}`);
        }
      });
      return () => {
        socket.off('sessionUpdated');
      };
    }
  }, [socket]);

  // Función para verificar la autenticación
  const verifyAuth = async () => {
    try {
      const response = await authService.verify();
      if (response.authenticated && response.user) {
        setUser(response.user);
        // Solo muestra el mensaje si es una autenticación reciente
        if (!hasCheckedAuth && !welcomeMessageShown) {
          setShowWelcomeMessage(true);
          setWelcomeMessageShown(true); // Marcar como mostrado
        }
      } else {
        console.warn("Usuario no autenticado.");
      }
    } catch (err) {
      console.error("Error al verificar autenticación:", err);
    } finally {
      setLoading(false);
      setHasCheckedAuth(true);
    }
  };

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
      setShowWelcomeMessage(true);
      setWelcomeMessageShown(true); // Marcar como mostrado
      localStorage.setItem("wasLoggedIn", "true"); // Activar la bienvenida
      setHasCheckedAuth(false);
      // Emitir evento de inicio de sesión al backend
      socket?.emit('loginSuccess', { userId: response.user.id });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (data: { email: string; password: string; name: string; username: string }) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      setShowWelcomeMessage(true);
      setWelcomeMessageShown(true); // Marcar como mostrado
      localStorage.setItem("wasLoggedIn", "true"); // Activar la bienvenida
      setHasCheckedAuth(false);
      // Emitir evento de registro al backend
      socket?.emit('registerSuccess', { userId: response.user.id });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
      throw err;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setShowWelcomeMessage(false);
      setWelcomeMessageShown(false); // Reiniciar el estado
      setHasCheckedAuth(false);
      // Emitir evento de cierre de sesión al backend
      socket?.emit('logout', { userId: user?.id });
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Proporcionar el valor del contexto
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        showWelcomeMessage,
        setShowWelcomeMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};