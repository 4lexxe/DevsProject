// resource.service.ts
import api from '../../shared/api/axios'; // Importa la instancia de axios configurada

export const ResourceService = {
  // Crear un nuevo recurso
  async createResource(data: {
    title: string;
    description?: string;
    url: string;
    type: 'video' | 'document' | 'image' | 'link';
    isVisible?: boolean;
    coverImage?: string;
    userId: number;
  }) {
    try {
      const response = await api.post('/resources', data);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  // Obtener todos los recursos visibles
  async getResources() {
    try {
      const response = await api.get('/resources');
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Obtener un recurso por ID
  async getResourceById(id: number) {
    try {
      const response = await api.get(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource by ID:', error);
      throw error;
    }
  },

  // Actualizar un recurso existente
  async updateResource(id: number, data: {
    title?: string;
    description?: string;
    url?: string;
    type?: 'video' | 'document' | 'image' | 'link';
    isVisible?: boolean;
    coverImage?: string;
  }) {
    try {
      const response = await api.put(`/resources/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  // Eliminar un recurso
  async deleteResource(id: number) {
    try {
      const response = await api.delete(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },
};