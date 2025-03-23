import api from '../../api/axios'; 
/**
 * @enum {string} FlairType
 * @description Tipos de distintivos disponibles
 */
export enum FlairType {
  ROLE_BASED = 'role_based',
  ACHIEVEMENT = 'achievement',
  POST = 'post',
  CUSTOM = 'custom'
}

/**
 * @interface ForumFlair
 * @description Interfaz para el modelo de distintivo
 */
export interface ForumFlair {
  id: number;
  name: string;
  description: string;
  icon?: string;
  type: FlairType;
  color: string;
  isActive: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * @interface UserFlair
 * @description Interfaz para la relación entre usuarios y flairs
 */
export interface UserFlair {
  id: number;
  userId: number;
  flairId: number;
  isActive: boolean;
  assignedAt: string;
  assignedBy?: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  flair?: ForumFlair;
}

/**
 * @interface PostFlair
 * @description Interfaz para la relación entre posts y flairs
 */
export interface PostFlair {
  id: number;
  postId: number;
  flairId: number;
  isActive: boolean;
  assignedAt: string;
  assignedBy?: number;
  createdAt: string;
  updatedAt: string;
  flair?: ForumFlair;
}

/**
 * @interface UserWithFlair
 * @description Representación de un usuario con su flair asignado
 */
export interface UserWithFlair {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: string;
  userFlair: UserFlair;
}

/**
 * @interface PostWithFlair
 * @description Representación de un post con su flair asignado
 */
export interface PostWithFlair {
  id: number;
  title: string;
  content: string;
  userId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    username: string;
    profileImageUrl?: string;
  };
  postFlair: PostFlair;
}

/**
 * @interface CreateFlairDto
 * @description DTO para crear un nuevo distintivo
 */
export interface CreateFlairDto {
  name: string;
  description: string;
  icon?: string;
  type: FlairType;
  color: string;
  isActive?: boolean;
  createdBy?: number;
}

/**
 * @interface UpdateFlairDto
 * @description DTO para actualizar un distintivo existente
 */
export interface UpdateFlairDto {
  name?: string;
  description?: string;
  icon?: string;
  type?: FlairType;
  color?: string;
  isActive?: boolean;
}

/**
 * @interface AssignFlairOptions
 * @description Opciones para asignar un flair
 */
export interface AssignFlairOptions {
  expiresAt?: string;
  assignedBy?: number;
}

/**
 * @class ForumFlairService
 * @description Servicio para gestionar los distintivos del foro en el frontend
 */
class ForumFlairService {
  /**
   * @function getAllFlairs
   * @description Obtiene todos los distintivos activos
   * @returns {Promise<ForumFlair[]>} Lista de distintivos
   */
  async getAllFlairs(): Promise<ForumFlair[]> {
    try {
      const response = await api.get(`forum/flairs`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener todos los distintivos:', error);
      throw new Error('Error al obtener distintivos');
    }
  }

  /**
   * @function getFlairsByType
   * @description Obtiene distintivos por tipo
   * @param {FlairType} type - Tipo de distintivo a buscar
   * @returns {Promise<ForumFlair[]>} Lista de distintivos por tipo
   */
  async getFlairsByType(type: FlairType): Promise<ForumFlair[]> {
    try {
      const response = await api.get(`forum/flairs/type/${type}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener distintivos de tipo ${type}`, error);
      throw new Error('Error al obtener distintivos de tipo');
    }
  }

  /**
   * @function getFlairById
   * @description Obtiene un distintivo por su ID
   * @param {number} id - ID del distintivo
   * @returns {Promise<ForumFlair>} Distintivo encontrado
   */
  async getFlairById(id: number): Promise<ForumFlair> {
    try {
      const response = await api.get(`forum/flairs/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener el distintivo', error);
      throw new Error('Error al obtener el distintivo');
    }
  }

  /**
   * @function getUserFlairs
   * @description Obtiene todos los distintivos de un usuario
   * @param {number} userId - ID del usuario
   * @param {boolean} onlyActive - Si solo se deben obtener los flairs activos
   * @returns {Promise<UserFlair[]>} Lista de flairs asignados al usuario
   */
  async getUserFlairs(userId: number, onlyActive: boolean = true): Promise<UserFlair[]> {
    try {
      const response = await api.get(`forum/users/${userId}/flairs`, {
        params: { onlyActive }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener distintivos del usuario', error);
      throw new Error('Error al obtener distintivos del usuario');
    }
  }

  /**
   * @function getPostFlairs
   * @description Obtiene todos los distintivos de un post
   * @param {number} postId - ID del post
   * @param {boolean} onlyActive - Si solo se deben obtener los flairs activos
   * @returns {Promise<PostFlair[]>} Lista de flairs asignados al post
   */
  async getPostFlairs(postId: number): Promise<PostFlair[]> {
    try {
      const response = await api.get(`/forum/posts/${postId}/flairs`);
      return response.data.data;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("No se pudieron obtener los flairs");
    }
  }

  /**
   * @function getPostsByFlair
   * @description Obtiene todos los posts que tienen asignado un determinado flair
   * @param {number} flairId - ID del flair
   * @param {boolean} onlyActive - Si solo se deben obtener los posts con flairs activos
   * @returns {Promise<PostWithFlair[]>} Lista de posts con el flair especificado
   */
  async getPostsByFlair(flairId: number, onlyActive: boolean = true): Promise<PostWithFlair[]> {
    try {
      const response = await api.get(`forum/flairs/${flairId}/posts`, {
        params: { onlyActive }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener posts por flair', error);
      throw new Error('Error al obtener posts por flair');
    }
  }

  /**
   * @function getUsersByFlair
   * @description Obtiene todos los usuarios que tienen asignado un determinado flair
   * @param {number} flairId - ID del flair
   * @param {boolean} onlyActive - Si solo se deben obtener los usuarios con flairs activos
   * @returns {Promise<UserWithFlair[]>} Lista de usuarios con el flair especificado
   */
  async getUsersByFlair(flairId: number, onlyActive: boolean = true): Promise<UserWithFlair[]> {
    try {
      const response = await api.get(`forum/flairs/${flairId}/users`, {
        params: { onlyActive }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener usuarios por flair', error);
      throw new Error('Error al obtener usuarios por flair');
    }
  }

  /**
   * @function createFlair
   * @description Crea un nuevo distintivo (requiere autenticación)
   * @param {CreateFlairDto} flairData - Datos del distintivo a crear
   * @returns {Promise<ForumFlair>} Distintivo creado
   */
  async createFlair(flairData: CreateFlairDto): Promise<ForumFlair> {
    try {
      const response = await api.post(`forum/flairs`, flairData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear el distintivo', error);
      throw new Error('Error al crear el distintivo');
    }
  }

  /**
   * @function updateFlair
   * @description Actualiza un distintivo existente (requiere autenticación)
   * @param {number} id - ID del distintivo a actualizar
   * @param {UpdateFlairDto} flairData - Datos actualizados del distintivo
   * @returns {Promise<ForumFlair>} Distintivo actualizado
   */
  async updateFlair(id: number, flairData: UpdateFlairDto): Promise<ForumFlair> {
    try {
      const response = await api.put(`forum/flairs/${id}`, flairData);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar el distintivo', error);
      throw new Error('Error al actualizar el distintivo');
    }
  }

  /**
   * @function deleteFlair
   * @description Elimina un distintivo (requiere autenticación)
   * @param {number} id - ID del distintivo a eliminar
   * @returns {Promise<{ success: boolean, message: string }>} Resultado de la operación
   */
  async deleteFlair(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`forum/flairs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el distintivo', error);
      throw new Error('Error al eliminar el distintivo');
    }
  }

  /**
   * @function assignFlairToUser
   * @description Asigna un distintivo a un usuario (requiere autenticación)
   * @param {number} userId - ID del usuario
   * @param {number} flairId - ID del distintivo
   * @param {AssignFlairOptions} options - Opciones adicionales como expiresAt
   * @returns {Promise<{ success: boolean, message: string }>} Resultado de la operación
   */
  async assignFlairToUser(
    userId: number,
    flairId: number,
    options?: AssignFlairOptions
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`forum/users/${userId}/flairs/${flairId}`, options || {});
      return response.data;
    } catch (error) {
      console.error('Error al asignar el distintivo al usuario', error);
      throw new Error('Error al asignar el distintivo al usuario');
    }
  }

  /**
   * @function removeFlairFromUser
   * @description Elimina un distintivo de un usuario (requiere autenticación)
   * @param {number} userId - ID del usuario
   * @param {number} flairId - ID del distintivo
   * @returns {Promise<{ success: boolean, message: string }>} Resultado de la operación
   */
  async removeFlairFromUser(
    userId: number,
    flairId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`forum/users/${userId}/flairs/${flairId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el distintivo del usuario', error);
      throw new Error('Error al eliminar el distintivo del usuario');
    }
  }

  /**
   * @function assignFlairToPost
   * @description Asigna un distintivo como etiqueta a un post (requiere autenticación)
   * @param {number} postId - ID del post
   * @param {number} flairId - ID del distintivo
   * @param {AssignFlairOptions} options - Opciones adicionales como assignedBy
   * @returns {Promise<{ success: boolean, message: string }>} Resultado de la operación
   */
  async assignFlairToPost(
    postId: number,
    flairId: number,
    options?: AssignFlairOptions
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`forum/posts/${postId}/flairs/${flairId}`, options || {});
      return response.data;
    } catch (error) {
      console.error('Error al asignar la etiqueta al post', error);
      throw new Error('Error al asignar la etiqueta al post');
    }
  }

  /**
   * @function removeFlairFromPost
   * @description Elimina un distintivo de un post (requiere autenticación)
   * @param {number} postId - ID del post
   * @param {number} flairId - ID del distintivo
   * @returns {Promise<{ success: boolean, message: string }>} Resultado de la operación
   */
  async removeFlairFromPost(
    postId: number,
    flairId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`forum/posts/${postId}/flairs/${flairId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la etiqueta del post', error);
      throw new Error('Error al eliminar la etiqueta del post');
    }
  }
}

export default new ForumFlairService;
