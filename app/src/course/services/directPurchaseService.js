import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Configurar axios con interceptores para incluir el token de autenticación
const api = axios.create({
    baseURL: API_BASE_URL,
});
// Interceptor para agregar el token de autorización
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
/**
 * Verificar si un curso es gratuito
 */
export const checkIfCourseFree = async (courseId) => {
    try {
        const response = await api.get(`/direct/course/${courseId}/check-free`);
        // El backend envía la respuesta con estructura BaseController: { data: FreeCourseResponse }
        return response.data.data;
    }
    catch (error) {
        console.error('Error checking if course is free:', error);
        throw error;
    }
};
/**
 * Verificar si el usuario ya tiene acceso a un curso
 */
export const checkCourseAccess = async (courseId) => {
    try {
        const response = await api.get(`/direct/course/${courseId}/check-access`);
        // El backend envía la respuesta con estructura BaseController: { data: CourseAccessResponse }
        return response.data.data;
    }
    catch (error) {
        console.error('Error checking course access:', error);
        throw error;
    }
};
/**
 * Otorgar acceso gratuito a un curso
 */
export const grantFreeCourseAccess = async (courseId) => {
    try {
        const response = await api.post(`/direct/course/${courseId}/grant-free-access`);
        // El backend envía la respuesta con estructura BaseController: { data: { initPoint, course } }
        return response.data.data;
    }
    catch (error) {
        console.error('Error granting free course access:', error);
        throw error;
    }
};
/**
 * Realizar compra directa de un curso
 */
export const directPurchaseCourse = async (courseId) => {
    try {
        console.log('🔍 Enviando request a:', `/direct/course/${courseId}/direct-purchase`);
        const response = await api.post(`/direct/course/${courseId}/direct-purchase`);
        console.log('🔍 Response completo del backend:', response);
        console.log('🔍 Response.data:', response.data);
        console.log('🔍 Response.data.data:', response.data.data);
        console.log('🔍 Response.data.data.initPoint:', response.data.data?.initPoint);
        // El backend envía la respuesta con estructura BaseController: { data: { initPoint, course } }
        // Necesitamos acceder a response.data.data para obtener los datos reales
        return response.data.data;
    }
    catch (error) {
        console.error('Error with direct purchase:', error);
        throw error;
    }
};
/**
 * Cancelar una orden pendiente específica
 */
export const cancelPendingOrder = async (orderId) => {
    try {
        const response = await api.delete(`/direct/order/${orderId}/cancel`);
        return response.data.data;
    }
    catch (error) {
        console.error('Error cancelling pending order:', error);
        throw error;
    }
};
