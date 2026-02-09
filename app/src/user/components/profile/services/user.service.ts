// userService.ts
import api from '../../../../shared/api/axios';
import axios from 'axios';

// Interfaces para los tipos de usuarios
export interface PublicUser {
  id: number;
  name: string;
  username?: string;
  displayName?: string;
  avatar?: string; // Agregamos avatar
}

export interface FullUser extends PublicUser {
  email: string;
  phone?: string;
  roleId: number;
  role?: {
    id: number;
    name: string;
    description: string;
  };
  isActiveSession: boolean;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

export const UserService = {
  // Obtener datos públicos básicos de todos los usuarios (completamente público)
  async getPublicUsers(): Promise<{ data: PublicUser[] }> {
    try {
      // Usar una instancia de axios sin interceptores para rutas públicas
      const publicApi = axios.create({
        baseURL: import.meta.env.VITE_API_URL || (() => {
          throw new Error('VITE_API_URL no está definida. Por favor, configura esta variable de entorno.');
        })(),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const response = await publicApi.get('/users/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching public users:', error);
      throw error;
    }
  },

  // Obtener datos públicos básicos de un usuario por ID (completamente público)
  async getPublicUserById(id: number): Promise<{ data: PublicUser }> {
    try {
      // Usar una instancia de axios sin interceptores para rutas públicas
      const publicApi = axios.create({
        baseURL: import.meta.env.VITE_API_URL || (() => {
          throw new Error('VITE_API_URL no está definida. Por favor, configura esta variable de entorno.');
        })(),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const response = await publicApi.get(`/users/public/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public user by ID:', error);
      throw error;
    }
  },

  // Obtener todos los usuarios (requiere permisos administrativos)
  async getUsers(): Promise<{ data: FullUser[] }> {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID (requiere permisos administrativos)
  async getUserById(id: number): Promise<{ data: FullUser }> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Método con fallback automático: SIEMPRE intenta público primero
  async getUserByIdSafe(id: number): Promise<PublicUser | FullUser> {
    try {
      // CAMBIO: Usar público primero, luego intentar protegido si es necesario
      console.log(' Intentando obtener datos públicos del usuario:', id);
      const publicResponse = await this.getPublicUserById(id);
      console.log(' Datos públicos obtenidos correctamente');
      return publicResponse.data;
    } catch (publicError) {
      console.log(' Datos públicos fallaron, intentando con autenticación:', publicError);
      try {
        // Solo si realmente necesitamos datos completos Y tenemos autenticación
        const response = await this.getUserById(id);
        return response.data;
      } catch (authError) {
        console.error(' Ambos métodos fallaron:', authError);
        // Devolver datos básicos como último recurso
        return {
          id: id,
          name: `Usuario ${id}`,
          username: undefined,
          displayName: undefined
        };
      }
    }
  },

  // **NUEVO**: Método que garantiza usar solo endpoints públicos
  async getPublicUserByIdOnly(id: number): Promise<PublicUser> {
    try {
      console.log(' Obteniendo SOLO datos públicos del usuario:', id);
      const response = await this.getPublicUserById(id);
      console.log(' Datos públicos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error(' Error obteniendo datos públicos:', error);
      // Devolver datos básicos como fallback
      return {
        id: id,
        name: `Usuario ${id}`,
        username: undefined,
        displayName: undefined
      };
    }
  },

  // Obtener detalles de seguridad de un usuario (requiere autenticación y permisos)
  async getUserSecurityDetails(id: number) {
    try {
      const response = await api.get(`/users/${id}/security`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security details:', error);
      throw error;
    }
  },

  // Actualizar un usuario (requiere autenticación y permisos)
  async updateUser(id: number, data: {
    name?: string;
    email?: string;
    phone?: string | null;
    roleId?: number;
    username?: string | null;
    displayName?: string | null;
    password?: string;
    isActiveSession?: boolean;
  }): Promise<{ data: FullUser }> {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Eliminar un usuario (requiere autenticación y permisos)
  async deleteUser(id: number): Promise<void> {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Helper para obtener el nombre de usuario de forma segura
  getUserDisplayName(user: PublicUser | FullUser): string {
    return user.displayName || user.name || user.username || 'Usuario desconocido';
  },

  // Helper para verificar si es un usuario completo (con email)
  isFullUser(user: PublicUser | FullUser): user is FullUser {
    return 'email' in user;
  }
};