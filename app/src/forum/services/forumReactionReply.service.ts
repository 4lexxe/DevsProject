// src/services/forumReactionReplyService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para una reacción a una respuesta del foro
export interface ForumReactionReply {
  id: number;
  replyId: number;
  userId: number;
  type: string; // Tipo de reacción, por ejemplo, 'like', 'dislike', etc.
  createdAt?: string;
  updatedAt?: string;
}

// Servicio para manejar las operaciones relacionadas con las reacciones a respuestas del foro
const ForumReactionReplyService = {
  // Obtener todas las reacciones de una respuesta
  async getReactionsByReply(replyId: number): Promise<ForumReactionReply[]> {
    try {
      const response = await api.get(`/forum/replies/${replyId}/reactions`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener las reacciones de la respuesta con id ${replyId}:`, error);
      throw new Error('Error al obtener las reacciones.');
    }
  },

  // Agregar una nueva reacción a una respuesta
  async addReactionToReply(replyId: number, reactionData: Omit<ForumReactionReply, 'id' | 'replyId'>): Promise<ForumReactionReply> {
    try {
      const response = await api.post(`/forum/replies/${replyId}/reactions`, reactionData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar la reacción a la respuesta:', error);
      throw new Error('Error al agregar la reacción.');
    }
  },

  // Eliminar una reacción de una respuesta
  async removeReactionFromReply(replyId: number, reactionId: number): Promise<void> {
    try {
      await api.delete(`/forum/replies/${replyId}/reactions/${reactionId}`);
    } catch (error) {
      console.error(`Error al eliminar la reacción con id ${reactionId} de la respuesta con id ${replyId}:`, error);
      throw new Error('Error al eliminar la reacción.');
    }
  },
};

export default ForumReactionReplyService;