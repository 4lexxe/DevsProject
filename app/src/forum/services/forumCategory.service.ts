// src/services/forumCategoryService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para una categoría del foro
export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon?: string;
  banner?: string;
  memberCount: number;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

// Servicio para manejar las operaciones relacionadas con las categorías del foro
const ForumCategoryService = {
  // Obtener todas las categorías
  async getAllCategories(): Promise<ForumCategory[]> {
    try {
      const response = await api.get('/forum/categories');
      // Extraer el array de categorías de la propiedad data del objeto response.data
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw new Error('Error al obtener las categorías.');
    }
  },

  // Obtener una categoría por ID
  async getCategoryById(id: number): Promise<ForumCategory> {
    try {
      const response = await api.get(`/forum/categories/${id}`);
      // Extraer el objeto categoría de la propiedad data del objeto response.data
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener la categoría con id ${id}:`, error);
      throw new Error('Error al obtener la categoría.');
    }
  },

  // Crear una nueva categoría
  async createCategory(categoryData: Omit<ForumCategory, 'id' | 'slug' | 'memberCount'>): Promise<ForumCategory> {
    try {
      const response = await api.post('/forum/categories', categoryData);
      // Extraer el objeto categoría creado de la propiedad data del objeto response.data
      return response.data.data;
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      throw new Error('Error al crear la categoría.');
    }
  },

  // Actualizar una categoría existente
  async updateCategory(id: number, categoryData: Partial<ForumCategory>): Promise<ForumCategory> {
    try {
      const response = await api.put(`/forum/categories/${id}`, categoryData);
      // Extraer el objeto categoría actualizado de la propiedad data del objeto response.data
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar la categoría con id ${id}:`, error);
      throw new Error('Error al actualizar la categoría.');
    }
  },

  // Eliminar una categoría
  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/forum/categories/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la categoría con id ${id}:`, error);
      throw new Error('Error al eliminar la categoría.');
    }
  }
};

export default ForumCategoryService;