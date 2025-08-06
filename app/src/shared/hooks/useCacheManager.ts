import { useCallback } from 'react';
import { cacheService } from '../services/cacheService';

/**
 * Hook personalizado para gestionar operaciones de caché
 */
export const useCacheManager = () => {
  
  // Limpiar caché de un curso específico
  const clearCourseCache = useCallback((courseId: string) => {
    try {
      cacheService.clearCourseCache(courseId);
      console.log(`Caché del curso ${courseId} limpiado`);
    } catch (error) {
      console.error('Error limpiando caché del curso:', error);
    }
  }, []);

  // Limpiar todo el caché de cursos
  const clearCoursesCache = useCallback(() => {
    try {
      cacheService.clearCoursesCache();
      console.log('Caché de cursos limpiado');
    } catch (error) {
      console.error('Error limpiando caché de cursos:', error);
    }
  }, []);

  // Limpiar todo el caché
  const clearAllCache = useCallback(() => {
    try {
      cacheService.clearAllCache();
      console.log('Todo el caché ha sido limpiado');
    } catch (error) {
      console.error('Error limpiando todo el caché:', error);
    }
  }, []);

  // Obtener estadísticas del caché
  const getCacheStats = useCallback(() => {
    try {
      return cacheService.getCacheStats();
    } catch (error) {
      console.error('Error obteniendo estadísticas del caché:', error);
      return {
        localStorage: { used: 0, total: 0 },
        sessionStorage: { used: 0, total: 0 },
        cacheItems: 0
      };
    }
  }, []);

  // Verificar si hay datos en caché para un curso
  const hasCourseInCache = useCallback((courseId: string) => {
    try {
      const courseDetail = cacheService.getCourseDetail(courseId);
      const sections = cacheService.getSections(courseId);
      return {
        hasDetail: !!courseDetail,
        hasSections: !!sections,
        hasAny: !!courseDetail || !!sections
      };
    } catch (error) {
      console.error('Error verificando caché del curso:', error);
      return {
        hasDetail: false,
        hasSections: false,
        hasAny: false
      };
    }
  }, []);

  // Verificar si hay lista de cursos en caché
  const hasCoursesInCache = useCallback(() => {
    try {
      const courses = cacheService.getCourses();
      return !!courses && courses.length > 0;
    } catch (error) {
      console.error('Error verificando caché de cursos:', error);
      return false;
    }
  }, []);

  // Precargar datos en caché (útil para optimización)
  const preloadCourseData = useCallback(async (courseId: string, fetchFunctions: {
    fetchCourse?: () => Promise<any>;
    fetchSections?: () => Promise<any>;
  }) => {
    try {
      const { fetchCourse, fetchSections } = fetchFunctions;
      
      // Verificar qué datos faltan en caché
      const cacheStatus = hasCourseInCache(courseId);
      
      const promises: Promise<any>[] = [];
      
      // Precargar curso si no está en caché
      if (!cacheStatus.hasDetail && fetchCourse) {
        promises.push(
          fetchCourse().then(course => {
            cacheService.setCourseDetail(courseId, course);
            return course;
          })
        );
      }
      
      // Precargar secciones si no están en caché
      if (!cacheStatus.hasSections && fetchSections) {
        promises.push(
          fetchSections().then(sections => {
            cacheService.setSections(courseId, sections);
            return sections;
          })
        );
      }
      
      if (promises.length > 0) {
        await Promise.all(promises);
        console.log(`Datos del curso ${courseId} precargados en caché`);
      }
    } catch (error) {
      console.error('Error precargando datos en caché:', error);
    }
  }, [hasCourseInCache]);

  // Invalidar caché cuando hay cambios
  const invalidateCache = useCallback((type: 'course' | 'courses' | 'all', courseId?: string) => {
    try {
      switch (type) {
        case 'course':
          if (courseId) {
            clearCourseCache(courseId);
          }
          break;
        case 'courses':
          clearCoursesCache();
          break;
        case 'all':
          clearAllCache();
          break;
      }
    } catch (error) {
      console.error('Error invalidando caché:', error);
    }
  }, [clearCourseCache, clearCoursesCache, clearAllCache]);

  return {
    // Operaciones de limpieza
    clearCourseCache,
    clearCoursesCache,
    clearAllCache,
    
    // Información del caché
    getCacheStats,
    hasCourseInCache,
    hasCoursesInCache,
    
    // Optimización
    preloadCourseData,
    invalidateCache
  };
};

export default useCacheManager;