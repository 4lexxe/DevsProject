import { useState, useEffect, useCallback } from 'react';
import { 
  getCourseProgress, 
  getUserProgress, 
  accessContent, 
  markContentCompleted,
  type CourseProgressDetails,
  type UserCourseProgress 
} from '../services/progressService';

/**
 * Hook para manejar el progreso de un curso específico
 */
export const useCourseProgress = (courseId: number) => {
  const [courseProgress, setCourseProgress] = useState<CourseProgressDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      setError(null);
      const progressData = await getCourseProgress(courseId);
      setCourseProgress(progressData);
    } catch (err) {
      setError('Error al cargar el progreso del curso');
      console.error('Error fetching course progress:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleContentAccess = useCallback(async (contentId: number, timeSpent?: number) => {
    try {
      await accessContent(courseId, contentId, timeSpent);
      // Opcionalmente refrescar el progreso
      // await fetchProgress();
    } catch (error) {
      console.error('Error al registrar acceso al contenido:', error);
    }
  }, [courseId]);

  const handleContentComplete = useCallback(async (contentId: number, timeSpent?: number) => {
    try {
      await markContentCompleted(courseId, contentId, timeSpent);
      // Refrescar el progreso después de completar
      await fetchProgress();
      return true;
    } catch (error) {
      console.error('Error al marcar contenido como completado:', error);
      return false;
    }
  }, [courseId, fetchProgress]);

  const refreshProgress = useCallback(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    courseProgress,
    loading,
    error,
    handleContentAccess,
    handleContentComplete,
    refreshProgress
  };
};

/**
 * Hook para manejar el progreso de todos los cursos del usuario
 */
export const useUserProgress = () => {
  const [userProgress, setUserProgress] = useState<UserCourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const progressData = await getUserProgress();
      setUserProgress(progressData);
    } catch (err) {
      setError('Error al cargar el progreso del usuario');
      console.error('Error fetching user progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  const refreshUserProgress = useCallback(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  return {
    userProgress,
    loading,
    error,
    refreshUserProgress
  };
};

/**
 * Hook para estadísticas de progreso
 */
export const useProgressStats = (courseProgress: CourseProgressDetails | null) => {
  const stats = {
    totalSections: courseProgress?.sections.length || 0,
    completedSections: courseProgress?.sections.filter(s => s.progress === 100).length || 0,
    totalContent: courseProgress?.progress.totalContent || 0,
    completedContent: courseProgress?.progress.completedContent || 0,
    overallProgress: courseProgress?.progress.percentage || 0,
    totalTimeSpent: courseProgress?.progress.totalTimeSpent || 0,
    averageTimePerContent: courseProgress?.progress.totalContent 
      ? Math.round((courseProgress.progress.totalTimeSpent / courseProgress.progress.totalContent) * 10) / 10
      : 0,
    estimatedTimeRemaining: courseProgress?.sections.reduce((total, section) => {
      const remainingContent = section.contents.filter(c => !c.isCompleted);
      return total + remainingContent.reduce((sectionTotal, content) => sectionTotal + content.duration, 0);
    }, 0) || 0
  };

  return stats;
};

export default {
  useCourseProgress,
  useUserProgress,
  useProgressStats
};