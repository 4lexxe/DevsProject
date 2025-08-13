import axiosInstance from '@/shared/api/axios';
class CourseService {
    baseUrl = '/courses';
    /**
     * Obtiene los cursos a los que el usuario tiene acceso
     */
    async getMyCourses() {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/my-courses`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo mis cursos:', error);
            throw error;
        }
    }
    /**
     * Obtiene los cursos del usuario con progreso y detalles de acceso
     */
    async getUserCourses(userId) {
        try {
            const response = await axiosInstance.get(`/course-access/${userId}/courses`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo cursos del usuario:', error);
            throw error;
        }
    }
    /**
     * Obtiene los accesos de curso del usuario
     */
    async getCourseAccesses() {
        try {
            const response = await axiosInstance.get(`/course-access`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo accesos a cursos:', error);
            throw error;
        }
    }
    /**
     * Obtiene un curso específico con detalles completos
     */
    async getCourseById(courseId) {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/${courseId}`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo curso:', error);
            throw error;
        }
    }
    /**
     * Obtiene las secciones de un curso específico
     */
    async getSectionsByCourse(courseId) {
        try {
            const response = await axiosInstance.get(`/sections/course/${courseId}`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error al obtener las secciones del curso:', error);
            throw error;
        }
    }
    /**
     * Verifica si el usuario tiene acceso a un curso
     */
    async hasAccessToCourse(courseId) {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/${courseId}/access`);
            return response.data.data.hasAccess;
        }
        catch (error) {
            console.error('Error verificando acceso al curso:', error);
            return false;
        }
    }
    /**
     * Obtiene todos los cursos disponibles
     */
    async getAllCourses() {
        try {
            const response = await axiosInstance.get(this.baseUrl);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo cursos:', error);
            throw error;
        }
    }
}
export const courseService = new CourseService();
