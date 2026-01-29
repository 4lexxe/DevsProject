import api from '../../shared/api/axios';

export interface Permission {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionCreateRequest {
  name: string;
  description: string;
}

export interface PermissionUpdateRequest {
  name?: string;
  description?: string;
}

// Obtener todos los permisos
export const getPermissions = async (): Promise<Permission[]> => {
  try {
    const response = await api.get('/roles/permissions');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

// Obtener un permiso por ID
export const getPermissionById = async (id: number): Promise<Permission> => {
  try {
    const response = await api.get(`/roles/permissions/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching permission with id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo permiso
export const createPermission = async (permissionData: PermissionCreateRequest): Promise<Permission> => {
  try {
    const response = await api.post('/roles/permissions', permissionData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

// Actualizar un permiso
export const updatePermission = async (id: number, permissionData: PermissionUpdateRequest): Promise<Permission> => {
  try {
    const response = await api.put(`/roles/permissions/${id}`, permissionData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating permission with id ${id}:`, error);
    throw error;
  }
};

// Eliminar un permiso
export const deletePermission = async (id: number): Promise<void> => {
  try {
    await api.delete(`/roles/permissions/${id}`);
  } catch (error) {
    console.error(`Error deleting permission with id ${id}:`, error);
    throw error;
  }
};
