import api from '../../shared/api/axios';

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

export interface Role {
  id?: number;
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

// Obtener todos los roles
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get('/roles/roles');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Obtener un rol por ID
export const getRoleById = async (id: number): Promise<Role> => {
  try {
    const response = await api.get(`/roles/roles/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching role with id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo rol
export const createRole = async (roleData: RoleCreateRequest): Promise<Role> => {
  try {
    const response = await api.post('/roles/roles', roleData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// Actualizar un rol
export const updateRole = async (id: number, roleData: RoleUpdateRequest): Promise<Role> => {
  try {
    const response = await api.put(`/roles/roles/${id}`, roleData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating role with id ${id}:`, error);
    throw error;
  }
};

// Eliminar un rol
export const deleteRole = async (id: number): Promise<void> => {
  try {
    await api.delete(`/roles/roles/${id}`);
  } catch (error) {
    console.error(`Error deleting role with id ${id}:`, error);
    throw error;
  }
};
