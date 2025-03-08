// src/services/forumVoteReplyService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para un voto a una respuesta del foro
export interface ForumVoteReply {
  id: number;
  replyId: number;
  userId: number;
  type: 'upvote' | 'downvote'; // Tipo de voto
  createdAt?: string;
  updatedAt?: string;
}

// Servicio para manejar las operaciones relacionadas con los votos a respuestas del foro
const ForumVoteReplyService = {
  // Obtener el estado de los votos de una respuesta
  async getVoteStatusByReply(replyId: number): Promise<ForumVoteReply[]> {
    try {
      const response = await api.get(`/forum/replies/${replyId}/votes`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el estado de los votos de la respuesta con id ${replyId}:`, error);
      throw new Error('Error al obtener el estado de los votos.');
    }
  },

  // Agregar un nuevo voto a una respuesta
  async addVoteToReply(replyId: number, voteData: Omit<ForumVoteReply, 'id' | 'replyId'>): Promise<ForumVoteReply> {
    try {
      const response = await api.post(`/forum/replies/${replyId}/votes`, voteData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar el voto a la respuesta:', error);
      throw new Error('Error al agregar el voto.');
    }
  },

  // Eliminar o cambiar un voto de una respuesta
  async removeVoteFromReply(replyId: number, voteId: number): Promise<void> {
    try {
      await api.delete(`/forum/replies/${replyId}/votes/${voteId}`);
    } catch (error) {
      console.error(`Error al eliminar el voto con id ${voteId} de la respuesta con id ${replyId}:`, error);
      throw new Error('Error al eliminar el voto.');
    }
  },
};

export default ForumVoteReplyService;