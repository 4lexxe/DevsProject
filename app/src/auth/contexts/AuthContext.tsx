import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false); // Flag para verificar autenticación

  useEffect(() => {
    if (!hasCheckedAuth) {
      verifyAuth();
    }
  }, [hasCheckedAuth]);

  const verifyAuth = async () => {
    try {
      const response = await authService.verify();
      if (response.authenticated && response.user) {
        setUser(response.user);
      } else {
        console.warn("Usuario no autenticado.");
      }
    } catch (err) {
      console.error('Error al verificar autenticación:', err);
    } finally {
      setLoading(false);
      setHasCheckedAuth(true); // Marcar que ya se verificó la autenticación
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
      setHasCheckedAuth(false); // Resetear el flag para verificar la autenticación después del login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    }
  };

  const register = async (data: { email: string; password: string; name: string; username: string }) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      setHasCheckedAuth(false); // Resetear el flag para verificar la autenticación después del registro
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setHasCheckedAuth(false); // Resetear el flag para verificar la autenticación después del logout
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};