import api from '../../api/axios';

// Definir la interfaz para un comentario
export interface Comment {
  id?: number;
  userId: number;
  resourceId: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  User?: {
    id: number;
    name: string;
    avatar?: string;  
  };
}

// Interfaz para el error de Axios
interface AxiosError {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
  message?: string;
}

// Crear un nuevo comentario
export const createComment = async (commentData: { resourceId: number; content: string }): Promise<Comment> => {
  try {
    const response = await api.post('/comment', commentData); // Prefijo /api/comment
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    
    if (err.response?.status === 403) {
      throw new Error('No tienes permisos para comentar en recursos');
    }
    
    throw new Error(err.response?.data?.error || 'Error al crear el comentario');
  }
};

// Obtener todos los comentarios de un recurso
export const getCommentsByResource = async (resourceId: number): Promise<Comment[]> => {
  try {
    const response = await api.get(`/comment/resource/${resourceId}`); // Prefijo /api/comment
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw new Error(err.response?.data?.error || 'Error al obtener los comentarios');
  }
};

// Actualizar un comentario existente
export const updateComment = async (id: number, commentData: Partial<Comment>): Promise<Comment> => {
  try {
    const response = await api.put(`/comment/${id}`, commentData); // Prefijo /api/comment
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    
    if (err.response?.status === 403) {
      throw new Error('No tienes permisos para editar comentarios');
    }
    
    throw new Error(err.response?.data?.error || 'Error al actualizar el comentario');
  }
};

// Eliminar un comentario
export const deleteComment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/comment/${id}`); // Prefijo /api/comment
  } catch (error: unknown) {
    const err = error as AxiosError;
    
    if (err.response?.status === 403) {
      throw new Error('No tienes permisos para eliminar comentarios');
    }
    
    throw new Error(err.response?.data?.error || 'Error al eliminar el comentario');
  }
};