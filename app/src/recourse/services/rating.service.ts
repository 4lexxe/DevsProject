import api from '../../api/axios';

// Crear o actualizar un rating
interface RatingResponse {
  totalLikes: number;
  totalDislikes: number;
}

export const createOrUpdateRating = async (ratingData: { resourceId: number; like: boolean }): Promise<RatingResponse> => {
  try {
    const response = await api.post('/api/rating', ratingData); // Envía los datos al backend
    return response.data; // Devuelve el total de likes/dislikes
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } } };
    throw new Error(err.response?.data?.error || 'Error al procesar el rating');
  }
};

// Eliminar un rating específico
export const deleteRating = async (id: number): Promise<RatingResponse> => {
  try {
    const response = await api.delete(`/api/rating/${id}`); // Envía la solicitud DELETE al backend
    return response.data; // Devuelve el total de likes/dislikes
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } } };
    throw new Error(err.response?.data?.error || 'Error al eliminar el rating');
  }
};

// Obtener todos los ratings de un recurso
interface Rating {
  id: number;
  resourceId: number;
  like: boolean;
}

export const getRatingsByResource = async (resourceId: number): Promise<Rating[]> => {
  try {
    const response = await api.get(`/api/rating/resource/${resourceId}`); // Envía la solicitud GET al backend
    return response.data; // Devuelve los ratings del recurso
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } } };
    throw new Error(err.response?.data?.error || 'Error al obtener los ratings');
  }
};