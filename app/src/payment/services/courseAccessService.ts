import api from '@/shared/api/axios';
import { cacheService } from '@/shared/services/cacheService';

export interface CourseAccessResponse {
  hasAccess: boolean;
  accessToken?: string;
  grantedAt?: string;
  courseId?: number;
}

export const courseAccessService = {
  /**
   * Verifica si el usuario actual tiene acceso a un curso específico
   * @param courseId - ID del curso (puede ser encriptado)
   * @returns Promise con la información de acceso
   */
  async checkCourseAccess(userId: number, courseId: string): Promise<CourseAccessResponse> {
    try {
      // Intentar obtener del caché primero
      const cachedAccess = cacheService.getCourseAccess(userId, courseId);
      if (cachedAccess) {
        console.log(`Acceso al curso ${courseId} para usuario ${userId} obtenido del caché`);
        return {
          hasAccess: cachedAccess.hasAccess,
          courseId: parseInt(courseId) || undefined
        };
      }

      // Si no hay caché, hacer la petición a la API
      const response = await api.get(`/course-access/${userId}/courses/${courseId}/check`);
      const accessData = response.data.data;
      
      // Guardar en caché
      cacheService.setCourseAccess(userId, courseId, accessData.hasAccess);
      console.log(`Acceso al curso ${courseId} para usuario ${userId} guardado en caché`);
      
      return accessData;
    } catch (error) {
      console.error('Error verificando acceso al curso:', error);
      // Si hay error, asumimos que no tiene acceso
      return { hasAccess: false };
    }
  },

  /**
   * Obtiene los detalles de un curso al que el usuario tiene acceso
   * @param userId - ID del usuario
   * @param courseId - ID del curso
   * @returns Promise con los detalles del curso
   */
  async getCourseDetails(userId: number, courseId: string) {
    try {
      const response = await api.get(`/course-access/${userId}/courses/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo detalles del curso:', error);
      throw error;
    }
  }
};

export default courseAccessService;