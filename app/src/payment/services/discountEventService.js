import api from '@/shared/api/axios';
/**
 * Obtiene todos los eventos de descuento con paginación
 */
export const getAllDiscountEvents = async (params) => {
    try {
        const config = {
            params: {
                page: params?.page,
                limit: params?.limit,
                courseId: params?.courseId,
                isActive: params?.isActive,
            }
        };
        const response = await api.get('/course/discount-events', config);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching discount events:', error);
        throw error;
    }
};
/**
 * Obtiene un evento de descuento por ID
 */
export const getDiscountEventById = async (id) => {
    try {
        const response = await api.get(`/course/discount-events/${id}`);
        return response.data.data;
    }
    catch (error) {
        console.error('Error fetching discount event:', error);
        throw error;
    }
};
/**
 * Crea un nuevo evento de descuento
 */
export const createDiscountEvent = async (eventData) => {
    try {
        const payload = {
            ...eventData,
            courseId: parseInt(eventData.courseId),
            startDate: eventData.startDate.toISOString(),
            endDate: eventData.endDate.toISOString(),
        };
        const response = await api.post('/course/discount-events', payload);
        return response.data.data;
    }
    catch (error) {
        console.error('Error creating discount event:', error);
        throw error;
    }
};
/**
 * Actualiza un evento de descuento
 */
export const updateDiscountEvent = async (id, eventData) => {
    try {
        const payload = {
            ...eventData,
            courseId: parseInt(eventData.courseId),
            startDate: eventData.startDate.toISOString(),
            endDate: eventData.endDate.toISOString(),
        };
        const response = await api.put(`/course/discount-events/${id}`, payload);
        return response.data.data;
    }
    catch (error) {
        console.error('Error updating discount event:', error);
        throw error;
    }
};
/**
 * Elimina un evento de descuento
 */
export const deleteDiscountEvent = async (id) => {
    try {
        await api.delete(`/course/discount-events/${id}`);
    }
    catch (error) {
        console.error('Error deleting discount event:', error);
        throw error;
    }
};
/**
 * Activa un evento de descuento
 */
export const activateDiscountEvent = async (id) => {
    try {
        const response = await api.patch(`/course/discount-events/${id}/activate`);
        return response.data.data;
    }
    catch (error) {
        console.error('Error activating discount event:', error);
        throw error;
    }
};
/**
 * Desactiva un evento de descuento
 */
export const deactivateDiscountEvent = async (id) => {
    try {
        const response = await api.patch(`/course/discount-events/${id}/deactivate`);
        return response.data.data;
    }
    catch (error) {
        console.error('Error deactivating discount event:', error);
        throw error;
    }
};
/**
 * Obtiene descuentos activos para un curso específico
 */
export const getActiveDiscountsForCourse = async (courseId) => {
    try {
        const response = await api.get(`/course/discount-events/course/${courseId}/active`);
        return response.data.data;
    }
    catch (error) {
        console.error('Error fetching active discounts for course:', error);
        throw error;
    }
};
/**
 * Obtiene estadísticas de eventos de descuento
 */
export const getDiscountStatistics = async () => {
    try {
        const response = await api.get('/course/discount-events/statistics');
        return response.data.data;
    }
    catch (error) {
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
