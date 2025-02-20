  import api from '../../api/axios'; // Importa la instancia de axios configurada

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

    // Obtener recursos visibles con búsqueda, paginación y límite
    async getResources(queryParams: {
      q?: string; // Término de búsqueda
      limit?: number; // Límite de resultados
      lastCreatedAt?: string; // Para paginación basada en claves
    }) {
      try {
        const { q, limit, lastCreatedAt } = queryParams;

        // Construir los parámetros de la solicitud
        const params: Record<string, string | number> = {};
        if (q) params.q = q; // Término de búsqueda
        if (limit) params.limit = limit; // Límite de resultados
        if (lastCreatedAt) params.lastCreatedAt = lastCreatedAt; // Paginación basada en claves

        const response = await api.get('/resources', { params });
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

    // Búsqueda de recursos por título (usando Full-Text Search)
    async searchResources({ q, limit, lastCreatedAt }: { q: string; limit: number; lastCreatedAt: string | null }) {
      try {
        const response = await api.get('/resources', { params: { q, limit, lastCreatedAt } });
        return response.data;
      } catch (error) {
        console.error('Error searching resources:', error);
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