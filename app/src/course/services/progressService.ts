import api from '@/shared/api/axios';

const PROGRESS_ENDPOINT = '/courses';

export interface ContentProgress {
  id: number;
  title: string;
  duration: number;
  position: number;
  isCompleted: boolean;
  completedAt: string | null;
  timeSpent: number;
  lastAccessedAt: string | null;
}

export interface SectionProgress {
  id: number;
  title: string;
  description: string;
  moduleType: string;
  progress: number;
  completedContent: number;
  totalContent: number;
  contents: ContentProgress[];
}

export interface CourseProgressSummary {
  percentage: number;
  completedContent: number;
  totalContent: number;
  totalTimeSpent: number;
}

export interface CourseProgressDetails {
  course: {
    id: number;
    title: string;
    image: string;
    summary: string;
  };
  progress: CourseProgressSummary;
  sections: SectionProgress[];
}

export interface UserCourseProgress {
  course: {
    id: number;
    title: string;
    image: string;
    summary: string;
  };
  progress: CourseProgressSummary;
  grantedAt: string;
}

/**
 * Registra el acceso a un contenido específico
 */
export const accessContent = async (courseId: string, contentId: string, timeSpent?: number) => {
  try {
    const response = await api.post(`${PROGRESS_ENDPOINT}/${courseId}/content/${contentId}/access`, {
      timeSpent
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar acceso al contenido:', error);
    throw error;
  }
};

/**
 * Marca un contenido como completado
 */
export const markContentCompleted = async (courseId: string, contentId: string, timeSpent?: number) => {
  try {
    const response = await api.post(`${PROGRESS_ENDPOINT}/${courseId}/content/${contentId}/complete`, {
      timeSpent
    });
    return response.data;
  } catch (error) {
    console.error('Error al marcar contenido como completado:', error);
    throw error;
  }
};

/**
 * Obtiene el progreso completo de un usuario en un curso
 */
export const getCourseProgress = async (courseId: string): Promise<CourseProgressDetails> => {
  try {
    const response = await api.get(`${PROGRESS_ENDPOINT}/${courseId}/progress`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener progreso del curso:', error);
    throw error;
  }
};

/**
 * Obtiene el progreso de todos los cursos de un usuario
 */
export const getUserProgress = async (): Promise<UserCourseProgress[]> => {
  try {
    const response = await api.get(`${PROGRESS_ENDPOINT}/progress`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener progreso del usuario:', error);
    throw error;
  }
};

/**
 * Reinicia el progreso de un curso
 */
export const resetCourseProgress = async (courseId: number, targetUserId: number) => {
  try {
    const response = await api.delete(`${PROGRESS_ENDPOINT}/${courseId}/progress/${targetUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error al reiniciar progreso del curso:', error);
    throw error;
  }
};

/**
 * Hook personalizado para manejar el progreso de contenido
 */
export const useContentProgress = () => {
  const handleContentAccess = async (courseId: number, contentId: number, timeSpent?: number) => {
    try {
      await accessContent(courseId, contentId, timeSpent);
    } catch (error) {
      console.error('Error al registrar acceso:', error);
    }
  };

  const handleContentComplete = async (courseId: number, contentId: number, timeSpent?: number) => {
    try {
      const result = await markContentCompleted(courseId, contentId, timeSpent);
      return result;
    } catch (error) {
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