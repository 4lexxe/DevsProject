import axiosInstance from '@/shared/api/axios';
import { MyCourseDetail } from '@/payment/interfaces/ViewnerCourse';

export interface UserCourse {
  id: number;
  title: string;
  description?: string;
  progress: number;
  accessToken: string;
  grantedAt: string;
  expiresAt?: string;
  certificateUrl?: string;
  isActive: boolean;
  imageUrl?: string;
  instructor?: string;
  duration?: string;
  level?: string;
}

export interface CourseAccess {
  id: number;
  courseId: number;
  userId: number;
  accessToken: string;
  grantedAt: string;
  revokedAt?: string;
  revokeReason?: string;
  course: {
    id: number;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    instructor?: string;
    duration?: string;
    level?: string;
    tags?: string[];
  };
}

export interface MyCourse {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  instructor?: string;
  duration?: string;
  level?: string;
  progress?: number;
  accessGrantedAt: string;
  status: 'active' | 'revoked';
  tags?: string[];
}

class CourseService {
  private baseUrl = '/courses';

  /**
   * Obtiene los cursos a los que el usuario tiene acceso
   */
  async getMyCourses(): Promise<MyCourse[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/my-courses`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo mis cursos:', error);
      throw error;
    }
  }

  /**
   * Obtiene los cursos del usuario con progreso y detalles de acceso
   */
  async getUserCourses(userId: string): Promise<UserCourse[]> {
    try {
      const response = await axiosInstance.get(`/course-access/${userId}/courses`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo cursos del usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene los accesos de curso del usuario
   */
  async getCourseAccesses(): Promise<CourseAccess[]> {
    try {
      const response = await axiosInstance.get(`/course-access`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo accesos a cursos:', error);
      throw error;
    }
  }

  /**
   * Obtiene un curso específico con detalles completos
   */
  async getCourseById(courseId: string): Promise<MyCourseDetail> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo curso:', error);
      throw error;
    }
  }

  /**
   * Obtiene las secciones de un curso específico
   */
  async getSectionsByCourse(courseId: string): Promise<any> {
    try {
      const response = await axiosInstance.get(`/sections/course/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener las secciones del curso:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario tiene acceso a un curso
   */
  async hasAccessToCourse(courseId: number): Promise<boolean> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${courseId}/access`);
      return response.data.data.hasAccess;
    } catch (error) {
      console.error('Error verificando acceso al curso:', error);
      return false;
    }
  }

  /**
   * Obtiene todos los cursos disponibles
   */
  async getAllCourses(): Promise<any[]> {
    try {
      const response = await axiosInstance.get(this.baseUrl);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo cursos:', error);
      throw error;
    }
  }
}

export const courseService = new CourseService();
