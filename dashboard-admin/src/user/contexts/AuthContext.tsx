import React, { useState, useEffect } from 'react';
import authService, { type User } from '../services/auth.service';
import { type AuthContextType } from './types';
import { AuthContext } from './context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Error verifying auth:", err);
        authService.logout(); // Limpiar tokens inválidos
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; username: string }): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      
      // Verificar si el usuario es superadmin o admin
      if (response.user.role?.name !== 'superadmin' && response.user.role?.name !== 'admin') {
        await logout();
        throw new Error('Acceso denegado. Solo administradores pueden usar esta aplicación.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error de registro';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user && authService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
