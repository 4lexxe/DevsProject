// userService.ts
import api from '../../api/axios'; // Importa la instancia de axios configurada
import { apiService } from '../../common/services/api.service';
import { User } from '../../common/types/user.types';

// Interfaces para los datos de permisos
interface PermissionRequest {
  userId: number;
  permissionId: number; // Cambiado de permissionName a permissionId para que coincida con la API
}

interface AssignCustomPermissionRequest {
  userId: number;
  permissionIds: number[];
}

interface ManagePermissionRequest {
  userId: number;
  permissionId: number;
}

// Interfaces para las respuestas de permisos
interface Permission {
  id: number;
  name: string;
  description: string;
}

interface UserPermission extends Permission {
  source?: 'role' | 'custom';
}

interface UserPermissionsResponse {
  userId: number;
  username: string;
  roleName: string;
  availablePermissions: UserPermission[];
  blockedPermissions: Permission[];
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

  /**
   * Asigna permisos personalizados a un usuario
   */
  assignCustomPermissions: async (data: AssignCustomPermissionRequest) => {
    try {
      const response = await apiService.post(`/users/${data.userId}/custom-permissions`, {
        permissionIds: data.permissionIds
      });
      return response.data;
    } catch (error) {
      console.error('Error al asignar permisos personalizados:', error);
      throw error;
    }
  },

  /**
   * Elimina un permiso personalizado de un usuario
   */
  removeCustomPermission: async (data: ManagePermissionRequest) => {
    try {
      const response = await apiService.delete(`/users/${data.userId}/custom-permissions/${data.permissionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar permiso personalizado:', error);
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
  async getUserPermissions(userId: number): Promise<UserPermissionsResponse> {
    try {
      const response = await api.get(`/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  },

  // Métodos de utilidad para trabajar con permisos
  
  // Obtener permisos agrupados por su origen (rol o personalizado)
  async getUserPermissionsBySource(userId: number): Promise<{
    rolePermissions: UserPermission[];
    customPermissions: UserPermission[];
    blockedPermissions: Permission[];
    allAvailablePermissions: UserPermission[];
  }> {
    try {
      const response = await this.getUserPermissions(userId);
      
      const rolePermissions = response.availablePermissions.filter(p => p.source === 'role');
      const customPermissions = response.availablePermissions.filter(p => p.source === 'custom');
      
      return {
        rolePermissions,
        customPermissions,
        blockedPermissions: response.blockedPermissions,
        allAvailablePermissions: response.availablePermissions
      };
    } catch (error) {
      console.error('Error processing user permissions by source:', error);
      throw error;
    }
  },
  
  // Verificar si un usuario tiene un permiso específico
  async hasPermission(userId: number, permissionName: string): Promise<boolean> {
    try {
      const response = await this.getUserPermissions(userId);
      return response.availablePermissions.some(p => p.name === permissionName);
    } catch (error) {
      console.error(`Error checking if user has permission ${permissionName}:`, error);
      return false;
    }
  }
};