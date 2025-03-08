// src/services/forumPostService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para una publicación del foro
export interface ForumPost {
  id: number;
  content: string;
  authorId: number;
  threadId: number;
  createdAt?: string;
  updatedAt?: string;
  // Puedes agregar más campos según sea necesario
}

// Servicio para manejar las operaciones relacionadas con las publicaciones del foro
const ForumPostService = {
  // Obtener todas las publicaciones de un hilo
  async getPostsByThread(threadId: number): Promise<ForumPost[]> {
    try {
      const response = await api.get(`/forum/threads/${threadId}/posts`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener las publicaciones del hilo con id ${threadId}:`, error);
      throw new Error('Error al obtener las publicaciones.');
    }
  },

  // Obtener una publicación por ID
  async getPostById(id: number): Promise<ForumPost> {
    try {
      const response = await api.get(`/forum/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la publicación con id ${id}:`, error);
      throw new Error('Error al obtener la publicación.');
    }
  },

  // Crear una nueva publicación
  async createPost(postData: Omit<ForumPost, 'id'>): Promise<ForumPost> {
    try {
      const response = await api.post('/forum/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      throw new Error('Error al crear la publicación.');
    }
  },

  // Actualizar una publicación existente
  async updatePost(id: number, postData: Partial<ForumPost>): Promise<ForumPost> {
    try {
      const response = await api.put(`/forum/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la publicación con id ${id}:`, error);
      throw new Error('Error al actualizar la publicación.');
    }
  },

  // Eliminar una publicación
  async deletePost(id: number): Promise<void> {
    try {
      await api.delete(`/forum/posts/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la publicación con id ${id}:`, error);
      throw new Error('Error al eliminar la publicación.');
    }
  },
};

export default ForumPostService;