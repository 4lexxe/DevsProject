import api from '@/shared/api/axios';
const PROGRESS_ENDPOINT = '/courses';
/**
 * Registra el acceso a un contenido específico
 */
export const accessContent = async (courseId, contentId, timeSpent) => {
    try {
        const response = await api.post(`${PROGRESS_ENDPOINT}/${courseId}/content/${contentId}/access`, {
            timeSpent
        });
        return response.data;
    }
    catch (error) {
        console.error('Error al registrar acceso al contenido:', error);
        throw error;
    }
};
/**
 * Marca un contenido como completado
 */
export const markContentCompleted = async (courseId, contentId, timeSpent) => {
    try {
        const response = await api.post(`${PROGRESS_ENDPOINT}/${courseId}/content/${contentId}/complete`, {
            timeSpent
        });
        return response.data;
    }
    catch (error) {
        console.error('Error al marcar contenido como completado:', error);
        throw error;
    }
};
/**
 * Obtiene el progreso completo de un usuario en un curso
 */
export const getCourseProgress = async (courseId) => {
    try {
        const response = await api.get(`${PROGRESS_ENDPOINT}/${courseId}/progress`);
        return response.data.data;
    }
    catch (error) {
        console.error('Error al obtener progreso del curso:', error);
        throw error;
    }
};
/**
 * Obtiene el progreso de todos los cursos de un usuario
 */
export const getUserProgress = async () => {
    try {
        const response = await api.get(`${PROGRESS_ENDPOINT}/progress`);
        return response.data.data;
    }
    catch (error) {
        console.error('Error al obtener progreso del usuario:', error);
        throw error;
    }
};
/**
 * Reinicia el progreso de un curso
 */
export const resetCourseProgress = async (courseId, targetUserId) => {
    try {
        const response = await api.delete(`${PROGRESS_ENDPOINT}/${courseId}/progress/${targetUserId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error al reiniciar progreso del curso:', error);
        throw error;
    }
};
/**
 * Hook personalizado para manejar el progreso de contenido
 */
export const useContentProgress = () => {
    const handleContentAccess = async (courseId, contentId, timeSpent) => {
        try {
            await accessContent(courseId, contentId, timeSpent);
        }
        catch (error) {
            console.error('Error al registrar acceso:', error);
        }
    };
    const handleContentComplete = async (courseId, contentId, timeSpent) => {
        try {
            const result = await markContentCompleted(courseId, contentId, timeSpent);
            return result;
        }
        catch (error) {
            console.error('Error al completar contenido:', error);
            throw error;
        }
    };
    return {
        handleContentAccess,
        handleContentComplete
    };
};
export default {
    accessContent,
    markContentCompleted,
    getCourseProgress,
    getUserProgress,
    resetCourseProgress,
    useContentProgress
};
