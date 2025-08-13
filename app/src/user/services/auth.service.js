import axios from 'axios';
// Obtener la URL base del backend desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL;
// Configurar los valores predeterminados de Axios
axios.defaults.withCredentials = true; // Importante para manejar cookies
axios.defaults.headers.common['Accept'] = 'application/json';
// Clase AuthService para manejar la autenticación
class AuthService {
    static instance;
    token = null;
    // Constructor privado para implementar el patrón Singleton
    constructor() {
        // Ya no obtenemos el token del localStorage, se maneja automáticamente por cookies HttpOnly
        // El token se enviará automáticamente en las cookies con cada request
    }
    // Método estático para obtener la instancia única de AuthService
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    // Ya no necesitamos configurar manualmente el header Authorization
    // Las cookies HttpOnly se envían automáticamente con cada request
    setAuthHeader(token) {
        // Método mantenido por compatibilidad pero ya no es necesario
        // Las cookies HttpOnly manejan la autenticación automáticamente
    }
    // Iniciar sesión
    async login(credentials) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            const { token, user } = response.data;
            // Solo guardamos los datos del usuario, el token se maneja automáticamente por cookies HttpOnly
            this.setUser(user);
            console.log('🔐 Usuario autenticado:', {
                id: user.id,
                name: user.name,
                role: user.role?.name,
                permissions: user.role?.permissions
            });
            return response.data;
        }
        catch (error) {
            this.clearToken();
            throw error;
        }
    }
    // Registrar un nuevo usuario
    async register(data) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, data);
            const { token, user } = response.data;
            // Solo guardamos los datos del usuario, el token se maneja automáticamente por cookies HttpOnly
            this.setUser(user);
            console.log('🔐 Usuario registrado:', {
                id: user.id,
                name: user.name,
                role: user.role?.name,
                permissions: user.role?.permissions
            });
            return response.data;
        }
        catch (error) {
            this.clearToken();
            throw error;
        }
    }
    // Verificar la autenticación del usuario
    async verify() {
        try {
            const response = await axios.get(`${API_URL}/auth/verify`, {
                withCredentials: true,
            });
            // Si la verificación es exitosa, guardar los datos del usuario
            if (response.data.authenticated && response.data.user) {
                this.setUser(response.data.user);
            }
            return response.data;
        }
        catch (error) {
            this.clearToken();
            throw error;
        }
    }
    // Cerrar sesión
    async logout() {
        try {
            await axios.delete(`${API_URL}/auth/logout`, {
                withCredentials: true,
            });
        }
        finally {
            this.clearToken();
        }
    }
    // Método mantenido por compatibilidad, pero el token ahora se maneja por cookies HttpOnly
    setToken(token) {
        this.token = token;
        // Ya no guardamos en localStorage, las cookies HttpOnly se manejan automáticamente por el servidor
        this.setAuthHeader(token);
    }
    // Limpiar el token y datos del usuario
    clearToken() {
        this.token = null;
        // Ya no necesitamos limpiar localStorage para el token (se maneja por cookies HttpOnly)
        // Solo limpiamos los datos del usuario que aún se almacenan localmente
        localStorage.removeItem('user');
        this.setAuthHeader(null);
    }
    // Obtener la URL de autenticación de GitHub
    getGithubAuthUrl() {
        return `${API_URL}/auth/github/login`;
    }
    // Obtener la URL de autenticación de Discord
    getDiscordAuthUrl() {
        return `${API_URL}/auth/discord/login`;
    }
    // Verificar si el usuario tiene un permiso específico
    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user || !user.role) {
            return false;
        }
        // Superadmin tiene todos los permisos
        if (user.role.name === 'superadmin') {
            return true;
        }
        // Verificar si el usuario tiene el permiso específico
        return user.role.permissions?.includes(permission) || false;
    }
    // Verificar si el usuario tiene alguno de los permisos de la lista
    hasAnyPermission(permissions) {
        return permissions.some(permission => this.hasPermission(permission));
    }
    // Verificar si el usuario puede gestionar sus propios recursos
    canManageOwnResources() {
        return this.hasPermission('manage:own_resources');
    }
    // Verificar si el usuario puede moderar todos los recursos
    canModerateAllResources() {
        return this.hasPermission('moderate:all_resources');
    }
    // Verificar si el usuario puede gestionar sus propios comentarios
    canManageOwnComments() {
        return this.hasPermission('manage:own_comments');
    }
    // Verificar si el usuario puede moderar todos los comentarios
    canModerateAllComments() {
        return this.hasPermission('moderate:all_comments');
    }
    // Verificar si el usuario puede gestionar sus propias calificaciones
    canManageOwnRatings() {
        return this.hasPermission('manage:own_ratings');
    }
    // Verificar si el usuario puede moderar todas las calificaciones
    canModerateAllRatings() {
        return this.hasPermission('moderate:all_ratings');
    }
    // Obtener el usuario actual desde localStorage
    getCurrentUser() {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        }
        catch {
            return null;
        }
    }
    // Guardar datos del usuario en localStorage
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}
// Exportar la instancia única de AuthService
export default AuthService.getInstance();
