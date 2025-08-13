import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import useSocket from '../../shared/hooks/useSocket';
export const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const [error, setError] = useState(null);
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
                }
                else {
                    // Si la respuesta indica que no está autenticado, limpiar el estado
                    setUser(null);
                    setShowWelcomeMessage(false);
                    sessionStorage.removeItem('hasShownWelcome');
                }
            }
            catch (err) {
                console.error("Error verifying auth:", err);
                // Si hay un error en la verificación, limpiar el estado del usuario
                setUser(null);
                setShowWelcomeMessage(false);
                sessionStorage.removeItem('hasShownWelcome');
            }
            finally {
                setLoading(false);
                setInitialCheckDone(true);
            }
        };
        verifyAuth();
    }, []);
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authService.login({ email, password });
            setUser(response.user);
            // Mostrar notificación solo en login exitoso
            sessionStorage.setItem('hasShownWelcome', 'true');
            setShowWelcomeMessage(true);
        }
        catch (err) {
            const error = err;
            setError(error.response?.data?.message || 'Error al iniciar sesión');
            throw err;
        }
    };
    const register = async (data) => {
        try {
            setError(null);
            const response = await authService.register(data);
            setUser(response.user);
            // Mostrar notificación en registro exitoso
            sessionStorage.setItem('hasShownWelcome', 'true');
            setShowWelcomeMessage(true);
        }
        catch (err) {
            const error = err;
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
        }
        catch (err) {
            console.error('Logout error:', err);
        }
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            loading: loading || !initialCheckDone,
            error,
            login,
            register,
            logout,
            showWelcomeMessage,
            setShowWelcomeMessage,
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
