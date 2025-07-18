import axios from 'axios';

// Obtener la URL base del backend desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

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

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  roleId: number;
  avatar?: string;
  role?: {
    id: number;
    name: string;
    description: string;
  } | null;
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

  // Obtener la instancia única de AuthService
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Configurar el encabezado de autorización en Axios
  private setAuthHeader(token: string | null) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }

  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token } = response.data;
      this.setToken(token);
      return response.data;
    } catch (error: unknown) {
      this.clearToken();
      throw error;
    }
  }

  // Registrar un nuevo usuario
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
    this.setAuthHeader(token);
  }

  // Limpiar el token de localStorage y eliminar el encabezado de autorización
  private clearToken(): void {
    this.token = null;
    this.setAuthHeader(null);
  }

  // Obtener la URL de autenticación de GitHub
  getGithubAuthUrl(): string {
    return `${API_URL}/auth/github/login`;
  }

  // Obtener la URL de autenticación de Discord
  getDiscordAuthUrl(): string {
    return `${API_URL}/auth/discord/login`;
  }
}

export default AuthService.getInstance();