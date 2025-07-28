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
  Role?: {  
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
  isSuperAdmin?: boolean; // Para el super admin
  admin?: {
    id: number;
    name: string;
    isSuperAdmin: boolean;
    permissions: string[];
    admin_since: string;
    admin_notes?: string;
  };
}

// Clase AuthService para manejar la autenticación del super admin
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

  // Iniciar sesión de super admin
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/root-login`, credentials);
      const { token } = response.data;
      this.setToken(token);
      return response.data;
    } catch (error: unknown) {
      this.clearToken();
      throw error;
    }
  }

  // Registrar un nuevo usuario (mantenido por compatibilidad)
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      const { token } = response.data;
      this.setToken(token);
      return response.data;
    } catch (error: unknown) {
      this.clearToken();
      throw error;
    }
  }

  // Verificar la autenticación del usuario
  async verify(): Promise<{ authenticated: boolean; user?: User; session?: AuthResponse['session'] }> {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await axios.delete(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
    } finally {
      this.clearToken();
    }
  }

  // Guardar el token en localStorage y configurar el encabezado de autorización
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    this.setAuthHeader(token);
  }

  // Limpiar el token de localStorage y eliminar el encabezado de autorización
  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.setAuthHeader(null);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obtener el token actual
  getToken(): string | null {
    return this.token;
  }

  // Métodos adicionales para compatibilidad con el código existente
  async getCurrentUser(): Promise<User | null> {
    try {
      const verifyResponse = await this.verify();
      return verifyResponse.user || null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  // Verificar si es super admin
  async isSuperAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.isSuperAdmin === true || user?.Role?.name === 'superadmin';
    } catch (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
  }
}

// Exportar la instancia única de AuthService
export default AuthService.getInstance();
