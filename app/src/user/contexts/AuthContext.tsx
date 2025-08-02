import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '../services/auth.service';
import useSocket from '../../shared/hooks/useSocket';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
  showWelcomeMessage: boolean;
  setShowWelcomeMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const { socket } = useSocket();

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await authService.verify();
        if (response.authenticated && response.user) {
          setUser(response.user);
          
          // Verificar si ya se mostró el mensaje en esta sesión
          const hasShownWelcome = sessionStorage.getItem('hasShownWelcome');
          if (!hasShownWelcome) {
            setShowWelcomeMessage(true);
            sessionStorage.setItem('hasShownWelcome', 'true');
          }
        } else {
          // Si la respuesta indica que no está autenticado, limpiar el estado
          setUser(null);
          setShowWelcomeMessage(false);
          sessionStorage.removeItem('hasShownWelcome');
        }
      } catch (err) {
        console.error("Error verifying auth:", err);
        // Si hay un error en la verificación, limpiar el estado del usuario
        setUser(null);
        setShowWelcomeMessage(false);
        sessionStorage.removeItem('hasShownWelcome');
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
      
      // Mostrar notificación solo en login exitoso
      sessionStorage.setItem('hasShownWelcome', 'true');
      setShowWelcomeMessage(true);
      
    } catch (err: Error | unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    }
  };

  const register = async (data: { email: string; password: string; name: string; username: string }) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      
      // Mostrar notificación en registro exitoso
      sessionStorage.setItem('hasShownWelcome', 'true');
      setShowWelcomeMessage(true);
      
    } catch (err: Error | unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al registrarse');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setShowWelcomeMessage(false);
      
      // Limpiar estado de notificación al hacer logout
      sessionStorage.removeItem('hasShownWelcome');
      
      socket?.emit('logout', { userId: user?.id });
    } catch (err: Error | unknown) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || !initialCheckDone,
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};