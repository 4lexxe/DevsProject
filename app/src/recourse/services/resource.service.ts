// resource.service.ts
import api from '../../shared/api/axios';
import axios from 'axios';

export interface ResourceUser {
  id: number;
  name: string;
  avatar?: string;
}

export interface Resource {
  id: number;
  title: string;
  description?: string;
  url: string;
  type: 'video' | 'document' | 'image' | 'link';
  isVisible: boolean;
  coverImage?: string;
  userId: number;
  user: ResourceUser;
  createdAt: string;
  updatedAt: string;
}

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

  // Obtener todos los recursos visibles (completamente público)
  async getResources() {
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

      const response = await publicApi.get('/resources');
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Obtener un recurso por ID (completamente público)
  async getResourceById(id: number) {
    try {
      console.log(' Obteniendo recurso por ID:', id);
      
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

      const response = await publicApi.get(`/resources/${id}`);
      console.log(' Respuesta del API:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(' Error fetching resource by ID:', error);
      throw error;
    }
  },

  // Actualizar un recurso existente (requiere autenticación)
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

  // Eliminar un recurso (requiere autenticación)
  async deleteResource(id: number) {
    try {
      const response = await api.delete(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  // Helper para obtener el nombre de usuario que subió el recurso
  getResourceAuthor(resource: Resource): string {
    return resource.user?.name || 'Usuario desconocido';
  },

  // Helper para verificar si el usuario actual es el propietario del recurso
  isResourceOwner(resource: Resource, currentUserId: number): boolean {
    return resource.userId === currentUserId;
  }
};