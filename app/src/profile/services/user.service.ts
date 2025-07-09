// userService.ts
import api from '../../shared/api/axios'; // Importa la instancia de axios configurada

export const UserService = {
  // Obtener todos los usuarios (público)
  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID (público)
  async getUserById(id: number) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
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
    isActiveSession?: boolean; // Nuevo campo para actualizar sesión activa
  }) {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Eliminar un usuario (requiere autenticación y permisos)
  async deleteUser(id: number) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};