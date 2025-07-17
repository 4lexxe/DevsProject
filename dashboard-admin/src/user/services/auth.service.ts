import axios from 'axios';

// Obtener la URL base del backend desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configurar los valores predeterminados de Axios
axios.defaults.withCredentials = true; // Importante para manejar cookies
axios.defaults.headers.common['Accept'] = 'application/json';

// Interfaces para los tipos de datos
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  session?: {
    createdAt: string;
    lastUsed: string;
    expiresAt: string;
    userAgent: string;
  };
}

export interface ProviderMetadata {
  accessToken?: string;
  refreshToken?: string;
  profile?: {
    id: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  username: string;
  displayName?: string;
  roleId: number;
  role?: {
    id: number;
    name: string;
    description: string;
    permissions?: string[];
  };
  isActiveSession: boolean;
  lastActiveAt: string;
  authProvider: string;
  authProviderId?: string;
  providerMetadata?: ProviderMetadata;
}

// Clase AuthService para manejar la autenticación
class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  // Constructor privado para implementar el patrón Singleton
  private constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthHeader(this.token);
    }
  }

  // Método estático para obtener la instancia única de AuthService
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Configurar el encabezado de autorización en Axios
  private setAuthHeader(token: string | null) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, refreshToken } = response.data;

      this.token = token;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.setAuthHeader(token);

      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Registrar usuario
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, refreshToken } = response.data;

      this.token = token;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.setAuthHeader(token);

      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      this.setAuthHeader(null);
    }
  }

  // Obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.token) {
        return null;
      }

      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      this.logout(); // Limpiar tokens inválidos
      return null;
    }
  }

  // Refrescar token
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken
      });

      const { token: newToken } = response.data;
      this.token = newToken;
      localStorage.setItem('token', newToken);
      this.setAuthHeader(newToken);

      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout(); // Limpiar tokens inválidos
      return null;
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obtener el token actual
  getToken(): string | null {
    return this.token;
  }

  // Verificar autenticación actual
  async verify(): Promise<{ authenticated: boolean; user?: User }> {
    try {
      if (!this.token) {
        return { authenticated: false };
      }

      const user = await this.getCurrentUser();
      return { authenticated: !!user, user: user || undefined };
    } catch (error) {
      console.error('Error verifying authentication:', error);
      return { authenticated: false };
    }
  }
}

// Exportar la instancia única del servicio de autenticación
export default AuthService.getInstance();
