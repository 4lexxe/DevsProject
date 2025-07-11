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
    permissions?: string[]; // Lista de permisos específicos
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
      const { token, user } = response.data;

      // Guardar tanto el token como los datos del usuario
      this.setToken(token);
      this.setUser(user);

      console.log('🔐 Usuario autenticado:', {
        id: user.id,
        name: user.name,
        role: user.role?.name,
        permissions: user.role?.permissions
      });

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
      const { token, user } = response.data;

      // Guardar tanto el token como los datos del usuario
      this.setToken(token);
      this.setUser(user);

      console.log('🔐 Usuario registrado:', {
        id: user.id,
        name: user.name,
        role: user.role?.name,
        permissions: user.role?.permissions
      });

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

      // Si la verificación es exitosa, guardar los datos del usuario
      if (response.data.authenticated && response.data.user) {
        this.setUser(response.data.user);
      }

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
    localStorage.removeItem('user'); // También limpiar datos del usuario
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

  // Verificar si el usuario tiene un permiso específico
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.role) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Sin permiso '${permission}': usuario no autenticado o sin rol`);
      }
      return false;
    }

    // Superadmin tiene todos los permisos
    if (user.role.name === 'superadmin') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Permiso '${permission}': concedido (superadmin)`);
      }
      return true;
    }

    // Verificar si el usuario tiene el permiso específico
    const hasPermission = user.role.permissions?.includes(permission) || false;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Permiso '${permission}':`, hasPermission ? 'concedido' : 'denegado', {
        userRole: user.role.name,
        userPermissions: user.role.permissions
      });
    }

    return hasPermission;
  }

  // Verificar si el usuario tiene alguno de los permisos de la lista
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  // Verificar si el usuario puede gestionar sus propios recursos
  canManageOwnResources(): boolean {
    return this.hasPermission('manage:own_resources');
  }

  // Verificar si el usuario puede moderar todos los recursos
  canModerateAllResources(): boolean {
    return this.hasPermission('moderate:all_resources');
  }

  // Verificar si el usuario puede gestionar sus propios comentarios
  canManageOwnComments(): boolean {
    return this.hasPermission('manage:own_comments');
  }

  // Verificar si el usuario puede moderar todos los comentarios
  canModerateAllComments(): boolean {
    return this.hasPermission('moderate:all_comments');
  }

  // Verificar si el usuario puede gestionar sus propias calificaciones
  canManageOwnRatings(): boolean {
    return this.hasPermission('manage:own_ratings');
  }

  // Verificar si el usuario puede moderar todas las calificaciones
  canModerateAllRatings(): boolean {
    return this.hasPermission('moderate:all_ratings');
  }

  // Obtener el usuario actual desde localStorage
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Guardar datos del usuario en localStorage
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));

    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Usuario guardado en localStorage:', {
        id: user.id,
        name: user.name,
        role: user.role?.name,
        permissions: user.role?.permissions
      });
    }
  }
}

// Exportar la instancia única de AuthService
export default AuthService.getInstance();