// src/services/forumPostService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Enum para el estado de los posts
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

// Enum para el tipo de contenido
export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  LINK = 'link',
}

// Define la interfaz para una publicación del foro
export interface ForumPost {
  id: number;
  title: string;
  content: string;
  contentType: ContentType; // Tipo de contenido: texto, imagen o enlace
  linkUrl?: string; // URL para posts de tipo LINK
  categoryId: number;
  authorId: number;
  status: PostStatus;
  isPinned: boolean;
  isLocked: boolean;
  isAnnouncement: boolean;
  isNSFW: boolean;
  isSpoiler: boolean;
  viewCount: number;
  replyCount: number;
  voteScore: number;
  upvoteCount: number;
  downvoteCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
  category?: {
    id: number;
    name: string;
    description: string;
    icon?: string;
  };
  flairs?: Array<{
    id: number;
    name: string;
    icon?: string;
    color: string;
  }>;
}

// Interfaz para las opciones de filtrado
export interface FilterOptions {
  // Paginación
  page?: number;
  limit?: number;
  
  // Filtros básicos
  search?: string;
  categoryId?: number | number[];
  authorId?: number | number[];
  status?: string;
  
  // Filtros de estado
  isPinned?: boolean;
  isLocked?: boolean;
  isAnnouncement?: boolean;
  isNSFW?: boolean;
  isSpoiler?: boolean;
  
  // Filtros de actividad
  minViewCount?: number;
  maxViewCount?: number;
  minReplyCount?: number;
  maxReplyCount?: number;
  minVoteScore?: number;
  maxVoteScore?: number;
  
  // Filtros temporales
  createdBefore?: string;
  createdAfter?: string;
  updatedBefore?: string;
  updatedAfter?: string;
  activeAfter?: string;
  activeBefore?: string;
  
  // Filtros de relaciones
  flairIds?: number[];
  
  // Ordenamiento
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
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

// Servicio para manejar las operaciones relacionadas con las publicaciones del foro
const ForumPostService = {
  // Obtener posts con paginación básica
  async getPosts(page = 1, limit = 10, categoryId?: number, search?: string, sortBy = 'lastActivityAt'): Promise<PaginatedResponse<ForumPost>> {
    try {
      let url = `/forum/posts?page=${page}&limit=${limit}`;
      if (categoryId) url += `&categoryId=${categoryId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
      throw new Error('Error al obtener las publicaciones.');
    }
  },
  
  // Obtener posts con filtros avanzados
  async getFilteredPosts(filterOptions: FilterOptions): Promise<PaginatedResponse<ForumPost>> {
    try {
      // Construir los parámetros de la consulta
      const params = new URLSearchParams();
      
      // Agregar cada opción de filtro que esté definida
      Object.entries(filterOptions).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            // Si es un array, convertirlo a una cadena separada por comas
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
      
      const response = await api.get(`/forum/posts/filter?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las publicaciones filtradas:', error);
      throw new Error('Error al obtener las publicaciones con filtros.');
    }
  },

  // Obtener una publicación por ID con todos sus detalles
  async getPostDetail(id: number): Promise<ForumPost> {
    try {
      const response = await api.get(`/forum/posts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener el detalle del post con id ${id}:`, error);
      throw new Error('Error al obtener el detalle de la publicación.');
    }
  },

  // Obtener posts populares
  async getPopularPosts(): Promise<ForumPost[]> {
    try {
      const response = await api.get('/forum/posts/popular');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los posts populares:', error);
      throw new Error('Error al obtener los posts populares.');
    }
  },

  // Crear una nueva publicación con soporte para diferentes tipos de contenido
  async createPost(postData: Partial<ForumPost>, contentType?: ContentType): Promise<ForumPost> {
    try {
      // Asegurarse de que el contentType del postData tenga prioridad sobre el parámetro contentType
      if (!postData.contentType && contentType) {
        postData.contentType = contentType;
      }
      
      // Validar datos según el tipo de contenido
      if (postData.contentType === ContentType.LINK && !postData.linkUrl) {
        throw new Error('Se requiere una URL para publicaciones de tipo enlace');
      }
      
      // Usar siempre la ruta base para posts
      const endpoint = '/forum/posts';
      
      const response = await api.post(endpoint, postData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      throw new Error('Error al crear la publicación.');
    }
  },

  // Actualizar una publicación existente
  async updatePost(id: number, postData: Partial<ForumPost>): Promise<ForumPost> {
    try {
      // Si estamos cambiando a tipo LINK, verificar que tengamos una URL
      if (postData.contentType === ContentType.LINK && !postData.linkUrl) {
        throw new Error('Se requiere una URL para publicaciones de tipo enlace');
      }

      const response = await api.put(`/forum/posts/${id}`, postData);
      return response.data.data;
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
  
  // Incrementar contador de vistas
  async incrementViewCount(id: number): Promise<void> {
    try {
      await api.post(`/forum/posts/${id}/view`);
    } catch (error) {
      console.error(`Error al incrementar las vistas del post ${id}:`, error);
      // No lanzamos error para no interrumpir la experiencia del usuario
    }
  },
};

export default ForumPostService;