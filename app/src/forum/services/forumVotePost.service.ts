// src/services/forumVotePostService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para un voto a una publicación del foro
export interface ForumVotePost {
  id: number;
  postId: number;
  userId: number;
  type: 'upvote' | 'downvote'; // Tipo de voto
  createdAt?: string;
  updatedAt?: string;
}

// Servicio para manejar las operaciones relacionadas con los votos a publicaciones del foro
const ForumVotePostService = {
  // Obtener el estado de los votos de una publicación
  async getVoteStatusByPost(postId: number): Promise<ForumVotePost[]> {
    try {
      const response = await api.get(`/forum/posts/${postId}/votes`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el estado de los votos de la publicación con id ${postId}:`, error);
      throw new Error('Error al obtener el estado de los votos.');
    }
  },

  // Agregar un nuevo voto a una publicación
  async addVoteToPost(postId: number, voteData: Omit<ForumVotePost, 'id' | 'postId'>): Promise<ForumVotePost> {
    try {
      const response = await api.post(`/forum/posts/${postId}/votes`, voteData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar el voto a la publicación:', error);
      throw new Error('Error al agregar el voto.');
    }
  },

  // Eliminar o cambiar un voto de una publicación
  async removeVoteFromPost(postId: number, voteId: number): Promise<void> {
    try {
      await api.delete(`/forum/posts/${postId}/votes/${voteId}`);
    } catch (error) {
      console.error(`Error al eliminar el voto con id ${voteId} de la publicación con id ${postId}:`, error);
      throw new Error('Error al eliminar el voto.');
    }
  },
};

export default ForumVotePostService;