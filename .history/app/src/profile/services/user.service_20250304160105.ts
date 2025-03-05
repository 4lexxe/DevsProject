// userService.ts
import api from '../../api/axios'; // Importa la instancia de axios configurada

// Interfaces para los datos de permisos
interface PermissionRequest {
  userId: number;
  permissionName: string;
  description?: string;
}

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

  // Asignar un permiso personalizado a un usuario
  async assignCustomPermission(data: PermissionRequest) {
    try {
      const response = await api.post('/users/assign-permission', data);
      return response.data;
    } catch (error) {
      console.error('Error assigning custom permission:', error);
      throw error;
    }
  },

  // Bloquear un permiso para un usuario
  async blockPermission(data: PermissionRequest) {
    try {
      const response = await api.post('/users/block-permission', data);
      return response.data;
    } catch (error) {
      console.error('Error blocking permission:', error);
      throw error;
    }
  },

  // Desbloquear un permiso para un usuario
  async unblockPermission(data: PermissionRequest) {
    try {
      const response = await api.delete('/users/unblock-permission', { 
        data: data 
      });
      return response.data;
    } catch (error) {
      console.error('Error unblocking permission:', error);
      throw error;
    }
  },

  // Obtener todos los permisos disponibles
  async getAvailablePermissions() {
    try {
      const response = await api.get('/permissions');
      return response.data;
    } catch (error) {
      console.error('Error fetching available permissions:', error);
      throw error;
    }
  },

  // Obtener permisos de un usuario específico
  async getUserPermissions(userId: number) {
    try {
      const response = await api.get(`/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }
};