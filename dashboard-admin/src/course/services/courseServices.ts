import api from '../../shared/api/axios';

// Interfaces para cursos en el dashboard admin
export interface Category {
  id: string;
  name: string;
  image?: string;
  description: string;
  isActive: boolean;
}

export interface CareerType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Course {
  id: number;
  title: string;
  image: string;
  summary: string;
  categories: Category[];
  about: string;
  careerType: CareerType;
  prerequisites: string[];
  learningOutcomes: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: number;
  createdAt: string;
  updatedAt?: string;
  // Propiedades adicionales para el dashboard
  studentsCount?: number;
  sectionsCount?: number;
  status?: 'active' | 'draft' | 'inactive';
}

export interface CourseInput {
  title: string;
  image: string;
  summary: string;
  categoryIds: string[];
  about: string;
  careerTypeId?: string;
  learningOutcomes: string[];
  prerequisites: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: string;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  careerType?: string;
  status?: 'all' | 'active' | 'draft' | 'inactive';
  isActive?: boolean;
  isInDevelopment?: boolean;
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  draftCourses: number;
  inactiveCourses: number;
}

const COURSES_ENDPOINT = '/courses';

// Obtener todos los cursos para el dashboard (incluye activos e inactivos)
export const getAllCourses = async (filters?: CourseFilters): Promise<Course[]> => {
  try {
    // Primero intentamos obtener todos los cursos (endpoint para admin)
    let endpoint = COURSES_ENDPOINT;
    
    // Si hay filtros específicos, los aplicamos en la URL
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) {
      params.append('isActive', filters.isActive.toString());
    }
    if (filters?.isInDevelopment !== undefined) {
      params.append('isInDevelopment', filters.isInDevelopment.toString());
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const response = await api.get(endpoint);
    let allCourses = response.data.data || response.data;

    // Si no hay datos o el endpoint no existe, intentamos con el endpoint de activos
    if (!allCourses || allCourses.length === 0) {
      const activeResponse = await api.get(COURSES_ENDPOINT + "/actives");
      allCourses = activeResponse.data.data || activeResponse.data;
    }

    // Aplicar filtros del lado del cliente
    if (filters && allCourses) {
      return allCourses.filter((course: Course) => {
        // Filtro de búsqueda
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const matchesTitle = course.title?.toLowerCase().includes(searchTerm);
          const matchesSummary = course.summary?.toLowerCase().includes(searchTerm);
          const matchesAbout = course.about?.toLowerCase().includes(searchTerm);
          
          if (!matchesTitle && !matchesSummary && !matchesAbout) {
            return false;
          }
        }

        // Filtro por categoría
        if (filters.category && filters.category !== 'all') {
          const hasCategory = course.categories?.some(cat => 
            cat.id === filters.category || cat.name.toLowerCase() === filters.category?.toLowerCase()
          );
          if (!hasCategory) return false;
        }

        // Filtro por tipo de carrera
        if (filters.careerType && filters.careerType !== 'all') {
          if (course.careerType?.id !== filters.careerType && 
              course.careerType?.name.toLowerCase() !== filters.careerType?.toLowerCase()) {
            return false;
          }
        }

        // Filtro por estado
        if (filters.status && filters.status !== 'all') {
          if (filters.status === 'active' && (!course.isActive || course.isInDevelopment)) return false;
          if (filters.status === 'draft' && !course.isInDevelopment) return false;
          if (filters.status === 'inactive' && course.isActive) return false;
        }

        return true;
      });
    }

    return allCourses || [];
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    throw error;
  }
};

// Obtener solo cursos activos (para mostrar públicamente)
export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get(COURSES_ENDPOINT + "/actives");
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener los cursos activos:', error);
    throw error;
  }
};

// Obtener curso por ID
export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const response = await api.get(`${COURSES_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al obtener el curso con id ${id}:`, error);
    throw error;
  }
};

// Crear nuevo curso
export const createCourse = async (courseData: CourseInput): Promise<Course> => {
  try {
    const response = await api.post(COURSES_ENDPOINT, courseData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al crear el curso:', error);
    throw error;
  }
};

// Actualizar curso
export const updateCourse = async (id: string, courseData: Partial<CourseInput>): Promise<Course> => {
  try {
    const response = await api.put(`${COURSES_ENDPOINT}/${id}`, courseData);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al actualizar el curso con id ${id}:`, error);
    throw error;
  }
};

// Eliminar curso
export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`${COURSES_ENDPOINT}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar el curso con id ${id}:`, error);
    throw error;
  }
};

// Activar/Desactivar curso
export const toggleCourseStatus = async (id: string, isActive: boolean): Promise<Course> => {
  try {
    const response = await api.patch(`${COURSES_ENDPOINT}/${id}/status`, { isActive });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al cambiar el estado del curso con id ${id}:`, error);
    throw error;
  }
};

// Cambiar estado de desarrollo
export const toggleDevelopmentStatus = async (id: string, isInDevelopment: boolean): Promise<Course> => {
  try {
    const response = await api.patch(`${COURSES_ENDPOINT}/${id}/development`, { isInDevelopment });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al cambiar el estado de desarrollo del curso con id ${id}:`, error);
    throw error;
  }
};

// Obtener navegación de un curso
export const getCourseNavigation = async (id: string) => {
  try {
    const response = await api.get(`${COURSES_ENDPOINT}/${id}/navigate`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al obtener la navegación del curso con id ${id}:`, error);
    throw error;
  }
};

// Obtener estadísticas de cursos
export const getCourseStats = async (): Promise<CourseStats> => {
  try {
    const response = await api.get(`${COURSES_ENDPOINT}/stats`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener las estadísticas de cursos:', error);
    // Si el endpoint no existe, calculamos desde todos los cursos
    const courses = await getAllCourses();
    
    return {
      totalCourses: courses.length,
      activeCourses: courses.filter(course => course.isActive && !course.isInDevelopment).length,
      draftCourses: courses.filter(course => course.isInDevelopment).length,
      inactiveCourses: courses.filter(course => !course.isActive).length
    };
  }
};

// Obtener categorías disponibles
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categories');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    // Categorías por defecto si no existe el endpoint
    return [
      { id: '1', name: 'Programación', description: 'Cursos de desarrollo de software', isActive: true },
      { id: '2', name: 'Diseño', description: 'Cursos de diseño gráfico y UX/UI', isActive: true },
      { id: '3', name: 'Marketing', description: 'Cursos de marketing digital', isActive: true }
    ];
  }
};

// Obtener tipos de carrera disponibles
export const getCareerTypes = async (): Promise<CareerType[]> => {
  try {
    const response = await api.get('/career-types');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener los tipos de carrera:', error);
    // Tipos de carrera por defecto si no existe el endpoint
    return [
      { id: '1', name: 'Frontend', description: 'Desarrollo frontend', isActive: true },
      { id: '2', name: 'Backend', description: 'Desarrollo backend', isActive: true },
      { id: '3', name: 'Fullstack', description: 'Desarrollo fullstack', isActive: true }
    ];
  }
};
