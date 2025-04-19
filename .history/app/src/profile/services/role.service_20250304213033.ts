import api from '../../api/axios';

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: number[]; // Array de IDs de permisos
  Permissions?: Permission[]; // Array de objetos Permission
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleCreateRequest {
  name: string;
  description: string;
  permissionIds?: number[];
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  permissionIds?: number[];
}

export const RoleService = {
  // Obtener todos los roles
  async getRoles() {
    try {
      const response = await api.get('/roles');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Obtener un rol por ID
  async getRoleById(id: number) {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching role with id ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo rol
  async createRole(roleData: RoleCreateRequest) {
    try {
      const response = await api.post('/roles', roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Actualizar un rol
  async updateRole(id: number, roleData: RoleUpdateRequest) {
    try {
      const response = await api.put(`/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating role with id ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un rol
  async deleteRole(id: number) {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting role with id ${id}:`, error);
      throw error;
    }
  },

  // Asignar rol a un usuario
  async assignRoleToUser(userId: number, roleId: number) {
    try {
      const response = await api.put(`/users/${userId}`, { roleId });
      return response.data;
    } catch (error) {
      console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
      throw error;
    }
  },

  // Obtener todos los roles con sus permisos
  async getRolesWithPermissions() {
    try {
      const response = await api.get('/roles');
      // La API ya devuelve los permisos incluidos en cada rol
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching roles with permissions:', error);
      throw error;
    }
  },
};
