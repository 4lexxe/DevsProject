import { api } from "@/api/axios";

export interface Permission {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Servicio para interactuar con la API de permisos
 */
export const PermissionService = {
  /**
   * Obtiene todos los permisos disponibles en el sistema
   */
  getAllPermissions: async (): Promise<Permission[]> => {
    try {
      const response = await apiService.get('/permissions');
      return response.data;
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un permiso por su ID
   */
  getPermissionById: async (id: number): Promise<Permission> => {
    try {
      const response = await apiService.get(`/permissions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener permiso con ID ${id}:`, error);
      throw error;
    }
  }
};
