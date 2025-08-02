import api from '@/shared/api/axios';

interface DiscountEvent {
  id: number;
  courseId: number;
  event: string;
  description: string;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DiscountEventFormData {
  courseId: string;
  event: string;
  description: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  url: string;
  method: string;
  timestamp: string;
  requestId: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Obtiene todos los eventos de descuento con paginación
 */
export const getAllDiscountEvents = async (params?: {
  page?: number;
  limit?: number;
  courseId?: number;
  isActive?: boolean;
}): Promise<PaginatedResponse<DiscountEvent>> => {
  try {
    const config = {
      params: {
        page: params?.page,
        limit: params?.limit,
        courseId: params?.courseId,
        isActive: params?.isActive,
      }
    };

    const response = await api.get<PaginatedResponse<DiscountEvent>>('/course/discount-events', config);
    return response.data;
  } catch (error) {
    console.error('Error fetching discount events:', error);
    throw error;
  }
};

/**
 * Obtiene un evento de descuento por ID
 */
export const getDiscountEventById = async (id: number): Promise<DiscountEvent> => {
  try {
    const response = await api.get<ApiResponse<DiscountEvent>>(`/course/discount-events/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching discount event:', error);
    throw error;
  }
};

/**
 * Crea un nuevo evento de descuento
 */
export const createDiscountEvent = async (eventData: DiscountEventFormData): Promise<DiscountEvent> => {
  try {
    const payload = {
      ...eventData,
      courseId: parseInt(eventData.courseId),
      startDate: eventData.startDate.toISOString(),
      endDate: eventData.endDate.toISOString(),
    };

    const response = await api.post<ApiResponse<DiscountEvent>>('/course/discount-events', payload);
    return response.data.data;
  } catch (error) {
    console.error('Error creating discount event:', error);
    throw error;
  }
};

/**
 * Actualiza un evento de descuento
 */
export const updateDiscountEvent = async (id: number, eventData: DiscountEventFormData): Promise<DiscountEvent> => {
  try {
    const payload = {
      ...eventData,
      courseId: parseInt(eventData.courseId),
      startDate: eventData.startDate.toISOString(),
      endDate: eventData.endDate.toISOString(),
    };

    const response = await api.put<ApiResponse<DiscountEvent>>(`/course/discount-events/${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error('Error updating discount event:', error);
    throw error;
  }
};

/**
 * Elimina un evento de descuento
 */
export const deleteDiscountEvent = async (id: number): Promise<void> => {
  try {
    await api.delete(`/course/discount-events/${id}`);
  } catch (error) {
    console.error('Error deleting discount event:', error);
    throw error;
  }
};

/**
 * Activa un evento de descuento
 */
export const activateDiscountEvent = async (id: number): Promise<DiscountEvent> => {
  try {
    const response = await api.patch<ApiResponse<DiscountEvent>>(`/course/discount-events/${id}/activate`);
    return response.data.data;
  } catch (error) {
    console.error('Error activating discount event:', error);
    throw error;
  }
};

/**
 * Desactiva un evento de descuento
 */
export const deactivateDiscountEvent = async (id: number): Promise<DiscountEvent> => {
  try {
    const response = await api.patch<ApiResponse<DiscountEvent>>(`/course/discount-events/${id}/deactivate`);
    return response.data.data;
  } catch (error) {
    console.error('Error deactivating discount event:', error);
    throw error;
  }
};

/**
 * Obtiene descuentos activos para un curso específico
 */
export const getActiveDiscountsForCourse = async (courseId: number): Promise<DiscountEvent[]> => {
  try {
    const response = await api.get<ApiResponse<DiscountEvent[]>>(`/course/discount-events/course/${courseId}/active`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching active discounts for course:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de eventos de descuento
 */
export const getDiscountStatistics = async (): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<any>>('/course/discount-events/statistics');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching discount statistics:', error);
    throw error;
  }
};

// Exportar un objeto con todas las funciones para compatibilidad
export const discountEventService = {
  getAllDiscountEvents,
  getDiscountEventById,
  createDiscountEvent,
  updateDiscountEvent,
  deleteDiscountEvent,
  activateDiscountEvent,
  deactivateDiscountEvent,
  getActiveDiscountsForCourse,
  getDiscountStatistics,
};

// Exportar tipos para usar en otros componentes
export type {
  DiscountEvent,
  DiscountEventFormData,
  ApiResponse,
  PaginatedResponse
};
