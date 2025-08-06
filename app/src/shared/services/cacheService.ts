import { Course } from '@/course/interfaces/ViewnerCourse';
import { Section } from '@/course/interfaces/ViewnerCourse';

// Configuración del caché
const CACHE_CONFIG = {
  // Tiempo de vida del caché en milisegundos
  TTL: {
    COURSES: 30 * 60 * 1000, // 30 minutos
    COURSE_DETAIL: 15 * 60 * 1000, // 15 minutos
    SECTIONS: 20 * 60 * 1000, // 20 minutos
    CATEGORIES: 60 * 60 * 1000, // 1 hora
    USER_CONFIG: 24 * 60 * 60 * 1000, // 24 horas
  },
  // Prefijos para las claves del caché
  KEYS: {
    COURSES: 'cache_courses',
    COURSE_DETAIL: 'cache_course_detail_',
    SECTIONS: 'cache_sections_',
    CATEGORIES: 'cache_categories',
    USER_CONFIG: 'cache_user_config',
    COURSE_ACCESS: 'cache_course_access_',
  }
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface UserConfig {
  theme?: 'light' | 'dark';
  language?: string;
  preferences?: {
    autoplay?: boolean;
    quality?: string;
    speed?: number;
  };
}

class CacheService {
  private static instance: CacheService;

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Guarda un elemento en el caché
   */
  private setItem<T>(key: string, data: T, ttl: number, useSessionStorage = false): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };
      
      const storage = useSessionStorage ? sessionStorage : localStorage;
      storage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Error guardando en caché:', error);
    }
  }

  /**
   * Obtiene un elemento del caché
   */
  private getItem<T>(key: string, useSessionStorage = false): T | null {
    try {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const item = storage.getItem(key);
      
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      // Verificar si el elemento ha expirado
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        storage.removeItem(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Error obteniendo del caché:', error);
      return null;
    }
  }

  /**
   * Elimina un elemento específico del caché
   */
  private removeItem(key: string, useSessionStorage = false): void {
    try {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      storage.removeItem(key);
    } catch (error) {
      console.warn('Error eliminando del caché:', error);
    }
  }

  // ==================== MÉTODOS PÚBLICOS PARA CURSOS ====================

  /**
   * Guarda la lista de cursos en caché
   */
  setCourses(courses: Course[]): void {
    this.setItem(CACHE_CONFIG.KEYS.COURSES, courses, CACHE_CONFIG.TTL.COURSES);
  }

  /**
   * Obtiene la lista de cursos del caché
   */
  getCourses(): Course[] | null {
    return this.getItem<Course[]>(CACHE_CONFIG.KEYS.COURSES);
  }

  /**
   * Guarda los detalles de un curso específico
   */
  setCourseDetail(courseId: string, course: Course): void {
    const key = CACHE_CONFIG.KEYS.COURSE_DETAIL + courseId;
    this.setItem(key, course, CACHE_CONFIG.TTL.COURSE_DETAIL);
  }

  /**
   * Obtiene los detalles de un curso específico
   */
  getCourseDetail(courseId: string): Course | null {
    const key = CACHE_CONFIG.KEYS.COURSE_DETAIL + courseId;
    return this.getItem<Course>(key);
  }

  /**
   * Guarda las secciones de un curso
   */
  setSections(courseId: string, sections: Section[]): void {
    const key = CACHE_CONFIG.KEYS.SECTIONS + courseId;
    this.setItem(key, sections, CACHE_CONFIG.TTL.SECTIONS, true); // Usar sessionStorage
  }

  /**
   * Obtiene las secciones de un curso
   */
  getSections(courseId: string): Section[] | null {
    const key = CACHE_CONFIG.KEYS.SECTIONS + courseId;
    return this.getItem<Section[]>(key, true); // Usar sessionStorage
  }

  /**
   * Guarda las categorías en caché
   */
  setCategories(categories: any[]): void {
    this.setItem(CACHE_CONFIG.KEYS.CATEGORIES, categories, CACHE_CONFIG.TTL.CATEGORIES);
  }

  /**
   * Obtiene las categorías del caché
   */
  getCategories(): any[] | null {
    return this.getItem<any[]>(CACHE_CONFIG.KEYS.CATEGORIES);
  }

  /**
   * Guarda el estado de acceso a un curso
   */
  setCourseAccess(userId: number, courseId: string, hasAccess: boolean): void {
    const key = CACHE_CONFIG.KEYS.COURSE_ACCESS + `${userId}_${courseId}`;
    this.setItem(key, { hasAccess, userId, courseId }, CACHE_CONFIG.TTL.COURSE_DETAIL, true);
  }

  /**
   * Obtiene el estado de acceso a un curso
   */
  getCourseAccess(userId: number, courseId: string): { hasAccess: boolean; userId: number; courseId: string } | null {
    const key = CACHE_CONFIG.KEYS.COURSE_ACCESS + `${userId}_${courseId}`;
    return this.getItem<{ hasAccess: boolean; userId: number; courseId: string }>(key, true);
  }

  // ==================== MÉTODOS PARA CONFIGURACIÓN DE USUARIO ====================

  /**
   * Guarda la configuración del usuario
   */
  setUserConfig(config: UserConfig): void {
    this.setItem(CACHE_CONFIG.KEYS.USER_CONFIG, config, CACHE_CONFIG.TTL.USER_CONFIG);
  }

  /**
   * Obtiene la configuración del usuario
   */
  getUserConfig(): UserConfig | null {
    return this.getItem<UserConfig>(CACHE_CONFIG.KEYS.USER_CONFIG);
  }

  /**
   * Actualiza parcialmente la configuración del usuario
   */
  updateUserConfig(partialConfig: Partial<UserConfig>): void {
    const currentConfig = this.getUserConfig() || {};
    const updatedConfig = { ...currentConfig, ...partialConfig };
    this.setUserConfig(updatedConfig);
  }

  // ==================== MÉTODOS DE LIMPIEZA ====================

  /**
   * Limpia todo el caché de cursos
   */
  clearCoursesCache(): void {
    this.removeItem(CACHE_CONFIG.KEYS.COURSES);
    
    // Limpiar detalles de cursos individuales
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_CONFIG.KEYS.COURSE_DETAIL)) {
        localStorage.removeItem(key);
      }
    });
    
    // Limpiar secciones
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(CACHE_CONFIG.KEYS.SECTIONS)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  /**
   * Limpia el caché de un curso específico
   */
  clearCourseCache(courseId: string): void {
    const detailKey = CACHE_CONFIG.KEYS.COURSE_DETAIL + courseId;
    const sectionsKey = CACHE_CONFIG.KEYS.SECTIONS + courseId;
    
    this.removeItem(detailKey);
    this.removeItem(sectionsKey, true);
    
    // Limpiar acceso de curso para todos los usuarios
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes(CACHE_CONFIG.KEYS.COURSE_ACCESS) && key.includes(courseId)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  /**
   * Limpia todo el caché
   */
  clearAllCache(): void {
    try {
      // Mantener solo la configuración del usuario
      const userConfig = this.getUserConfig();
      
      // Limpiar localStorage (excepto configuración de usuario)
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_') && key !== CACHE_CONFIG.KEYS.USER_CONFIG) {
          localStorage.removeItem(key);
        }
      });
      
      // Limpiar sessionStorage completamente
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Restaurar configuración de usuario si existía
      if (userConfig) {
        this.setUserConfig(userConfig);
      }
    } catch (error) {
      console.warn('Error limpiando caché:', error);
    }
  }

  /**
   * Obtiene estadísticas del caché
   */
  getCacheStats(): {
    localStorage: { used: number; total: number };
    sessionStorage: { used: number; total: number };
    cacheItems: number;
  } {
    try {
      const getStorageSize = (storage: Storage) => {
        let used = 0;
        for (let key in storage) {
          if (storage.hasOwnProperty(key)) {
            used += storage[key].length + key.length;
          }
        }
        return used;
      };

      const cacheItems = Object.keys(localStorage).filter(key => key.startsWith('cache_')).length +
                        Object.keys(sessionStorage).filter(key => key.startsWith('cache_')).length;

      return {
        localStorage: {
          used: getStorageSize(localStorage),
          total: 5 * 1024 * 1024 // 5MB aproximado
        },
        sessionStorage: {
          used: getStorageSize(sessionStorage),
          total: 5 * 1024 * 1024 // 5MB aproximado
        },
        cacheItems
      };
    } catch (error) {
      console.warn('Error obteniendo estadísticas del caché:', error);
      return {
        localStorage: { used: 0, total: 0 },
        sessionStorage: { used: 0, total: 0 },
        cacheItems: 0
      };
    }
  }
}

// Exportar instancia singleton
export const cacheService = CacheService.getInstance();
export default cacheService;
export type { UserConfig };