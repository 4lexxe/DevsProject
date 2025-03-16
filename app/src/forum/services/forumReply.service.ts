// src/services/forumReplyService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para una respuesta del foro
export interface ForumReply {
  id: number;
  content: string;
  authorId: number;
  postId: number;
  parentReplyId?: number;
  depth: number;
  isNSFW: boolean;
  isSpoiler: boolean;
  voteScore: number;
  upvoteCount: number;
  downvoteCount: number;
  status: string; // 'active', 'deleted', etc.
  lastEditedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
  childReplies?: ForumReply[];
  childrenCount?: number;
}

// Interfaz para la respuesta paginada
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Interfaz específica para respuestas anidadas
interface NestedRepliesResponse {
  success: boolean;
  data: ForumReply[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  postDetails?: {
    id: number;
    title: string;
    authorId: number;
    authorName: string;
  };
}

// Servicio para manejar las operaciones relacionadas con las respuestas del foro
const ForumReplyService = {
  // Obtener todas las respuestas raíz de una publicación, paginadas
  async getRootReplies(postId: number, page = 1, limit = 25): Promise<NestedRepliesResponse> {
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
  
  // Obtener todas las respuestas de una publicación, paginadas y anidadas
  async getPaginatedNestedReplies(postId: number, page = 1, limit = 25): Promise<NestedRepliesResponse> {
    try {
      const response = await api.get(`/forum/posts/${postId}/replies/nested`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener las respuestas anidadas del post con id ${postId}:`, error);
      throw new Error('Error al obtener las respuestas anidadas.');
    }
  },
  
  // Obtener más hijos de una respuesta
  async getChildReplies(parentReplyId: number, page = 1, limit = 5): Promise<PaginatedResponse<ForumReply>> {
    try {
      const response = await api.get(`/forum/replies/${parentReplyId}/children`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener hijos de la respuesta con id ${parentReplyId}:`, error);
      throw new Error('Error al obtener respuestas hijas.');
    }
  },

  // Obtener una respuesta por ID con detalles completos
  async getReplyDetail(id: number): Promise<ForumReply> {
    try {
      const response = await api.get(`/forum/replies/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener el detalle de la respuesta con id ${id}:`, error);
      throw new Error('Error al obtener el detalle de la respuesta.');
    }
  },

  // Crear una nueva respuesta
  async createReply(postId: number, replyData: {
    content: string;
    parentReplyId?: number;
    isNSFW?: boolean;
    isSpoiler?: boolean;
  }): Promise<ForumReply> {
    try {
      const response = await api.post(`/forum/posts/${postId}/replies`, {
        ...replyData,
        postId: replyData.parentReplyId ? undefined : postId // Solo enviar postId si es respuesta raíz
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear la respuesta:', error);
      throw new Error('Error al crear la respuesta.');
    }
  },

  // Actualizar una respuesta existente
  async updateReply(id: number, replyData: {
    content?: string;
    isNSFW?: boolean;
    isSpoiler?: boolean;
  }): Promise<ForumReply> {
    try {
      const response = await api.put(`/forum/replies/${id}`, replyData);
      return response.data.data;
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

  // Marcar/desmarcar una respuesta como NSFW
  async toggleNSFW(id: number): Promise<ForumReply> {
    try {
      const response = await api.put(`/forum/replies/${id}/toggle-nsfw`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al cambiar estado NSFW de la respuesta ${id}:`, error);
      throw new Error('Error al cambiar estado NSFW.');
    }
  },

  // Marcar/desmarcar una respuesta como Spoiler
  async toggleSpoiler(id: number): Promise<ForumReply> {
    try {
      const response = await api.put(`/forum/replies/${id}/toggle-spoiler`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al cambiar estado Spoiler de la respuesta ${id}:`, error);
      throw new Error('Error al cambiar estado Spoiler.');
    }
  },

  // Obtener respuestas populares
  async getPopularReplies(criteria = 'voteScore', limit = 10): Promise<ForumReply[]> {
    try {
      const response = await api.get('/forum/replies/popular', {
        params: { criteria, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener las respuestas populares:', error);
      throw new Error('Error al obtener las respuestas populares.');
    }
  },

  // Reportar una respuesta
  async reportReply(id: number, reason: string): Promise<void> {
    try {
      await api.post(`/forum/replies/${id}/report`, { reason });
    } catch (error) {
      console.error(`Error al reportar la respuesta ${id}:`, error);
      throw new Error('Error al reportar la respuesta.');
    }
  }
};

export default ForumReplyService;