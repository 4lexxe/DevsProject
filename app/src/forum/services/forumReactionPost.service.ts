// src/services/forumReactionPostService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para una reacción a una publicación del foro
export interface ForumReactionPost {
  id: number;
  postId: number;
  userId: number;
  type: string; // Tipo de reacción, por ejemplo, 'like', 'dislike', etc.
  createdAt?: string;
  updatedAt?: string;
}

// Servicio para manejar las operaciones relacionadas con las reacciones a publicaciones del foro
const ForumReactionPostService = {
  // Obtener todas las reacciones de una publicación
  async getReactionsByPost(postId: number): Promise<ForumReactionPost[]> {
    try {
      const response = await api.get(`/forum/posts/${postId}/reactions`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener las reacciones de la publicación con id ${postId}:`, error);
      throw new Error('Error al obtener las reacciones.');
    }
  },

  // Agregar una nueva reacción a una publicación
  async addReactionToPost(postId: number, reactionData: Omit<ForumReactionPost, 'id' | 'postId'>): Promise<ForumReactionPost> {
    try {
      const response = await api.post(`/forum/posts/${postId}/reactions`, reactionData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar la reacción a la publicación:', error);
      throw new Error('Error al agregar la reacción.');
    }
  },

  // Eliminar una reacción de una publicación
  async removeReactionFromPost(postId: number, reactionId: number): Promise<void> {
    try {
      await api.delete(`/forum/posts/${postId}/reactions/${reactionId}`);
    } catch (error) {
      console.error(`Error al eliminar la reacción con id ${reactionId} de la publicación con id ${postId}:`, error);
      throw new Error('Error al eliminar la reacción.');
    }
  },
};

export default ForumReactionPostService;