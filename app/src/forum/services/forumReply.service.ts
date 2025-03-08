// src/services/forumReplyService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para una respuesta del foro
export interface ForumReply {
  id: number;
  content: string;
  authorId: number;
  postId: number;
  parentReplyId?: number;
  depth?: number;
  isNSFW?: boolean;
  isSpoiler?: boolean;
  voteScore?: number;
  upvoteCount?: number;
  downvoteCount?: number;
  createdAt?: string;
  updatedAt?: string;
  // Puedes agregar más campos según sea necesario
}

// Servicio para manejar las operaciones relacionadas con las respuestas del foro
const ForumReplyService = {
  // Obtener todas las respuestas de una publicación, paginadas y anidadas
  async getPaginatedNestedReplies(postId: number, page: number = 1, limit: number = 25): Promise<{ data: ForumReply[], total: number, page: number }> {
    try {
      const response = await api.get(`/forum/posts/${postId}/replies`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener las respuestas del post con id ${postId}:`, error);
      throw new Error('Error al obtener las respuestas.');
    }
  },
  // Obtener más hijos de una respuesta
  async getMoreChildren(parentReplyId: number, page: number = 1, limit: number = 5): Promise<{ data: ForumReply[], total: number, page: number }> {
    try {
      const response = await api.get(`/forum/replies/${parentReplyId}/children`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener hijos adicionales de la respuesta con id ${parentReplyId}:`, error);
      throw new Error('Error al obtener respuestas.');
    }
  },

  // Obtener una respuesta por ID
  async getReplyById(id: number): Promise<ForumReply> {
    try {
      const response = await api.get(`/forum/replies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la respuesta con id ${id}:`, error);
      throw new Error('Error al obtener la respuesta.');
    }
  },

  // Crear una nueva respuesta
  async createReply(postId: number, replyData: Omit<ForumReply, 'id' | 'postId'>): Promise<ForumReply> {
    try {
      const response = await api.post(`/forum/posts/${postId}/replies`, replyData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la respuesta:', error);
      throw new Error('Error al crear la respuesta.');
    }
  },

  // Actualizar una respuesta existente
  async updateReply(id: number, replyData: Partial<ForumReply>): Promise<ForumReply> {
    try {
      const response = await api.put(`/forum/replies/${id}`, replyData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la respuesta con id ${id}:`, error);
      throw new Error('Error al actualizar la respuesta.');
    }
  },

  // Eliminar una respuesta
  async deleteReply(id: number): Promise<void> {
    try {
      await api.delete(`/forum/replies/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la respuesta con id ${id}:`, error);
      throw new Error('Error al eliminar la respuesta.');
    }
  },

  // Obtener respuestas populares
  async getPopularReplies(criteria: string = 'voteScore', limit: number = 10): Promise<ForumReply[]> {
    try {
      const response = await api.get('/forum/replies/popular', {
        params: { criteria, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener las respuestas populares:', error);
      throw new Error('Error al obtener las respuestas populares.');
    }
  }
};

export default ForumReplyService;