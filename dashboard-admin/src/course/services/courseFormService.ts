import { axios as api } from "@/shared/api";

const CATEGORY_ENDPOINT = "/categories/actives";
const CAREERTYPE_ENDPOINT = "/careerTypes/actives";
const COURSES_ENDPOINT = "/courses";
const SECTIONS_ENDPOINT = '/sections';

// Interfaces para formularios de curso
export interface CategoryOption {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CareerTypeOption {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CourseFormData {
  id?: string;
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

export interface SectionFormData {
  id?: string;
  courseId: string;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  colorGradient: [string, string];
  contents?: ContentFormData[];
}

export interface ContentFormData {
  id?: string;
  sectionId?: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'exercise';
  content: string;
  videoUrl?: string;
  duration?: number;
  order: number;
}

// Obtener todas las categorías activas para formularios
export const getActiveCategories = async (): Promise<CategoryOption[]> => {
  try {
    const response = await api.get(CATEGORY_ENDPOINT);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener las categorías activas:", error);
    throw error;
  }
};

// Obtener todos los tipos de carrera activos para formularios
export const getActiveCareerTypes = async (): Promise<CareerTypeOption[]> => {
  try {
    const response = await api.get(CAREERTYPE_ENDPOINT);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener los tipos de carrera activos:", error);
    throw error;
  }
};

// Crear curso completo con categorías y tipo de carrera
export const createFullCourse = async (courseData: CourseFormData) => {
  try {
    const response = await api.post(COURSES_ENDPOINT, courseData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el curso completo:', error);
    throw error;
  }
};

// Editar curso completo
export const editFullCourse = async (id: string, courseData: Partial<CourseFormData>) => {
  try {
    const response = await api.put(`${COURSES_ENDPOINT}/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error al editar el curso completo:', error);
    throw error;
  }
};

// Crear una nueva sección con contenidos
export const createSection = async (sectionData: SectionFormData) => {
  try {
    const response = await api.post(SECTIONS_ENDPOINT + "/contents", sectionData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la sección con contenidos:', error);
    throw error;
  }
};

// Actualizar una sección con contenidos
export const editSection = async (sectionData: Partial<SectionFormData>) => {
  try {
    const response = await api.put(SECTIONS_ENDPOINT + "/contents", sectionData);
    return response.data;
  } catch (error) {
    console.error('Error al editar la sección con contenidos:', error);
    throw error;
  }
};

// Eliminar sección
export const deleteSection = async (sectionId: string) => {
  try {
    const response = await api.delete(`${SECTIONS_ENDPOINT}/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la sección:', error);
    throw error;
  }
};

// Obtener secciones de un curso
export const getCourseSections = async (courseId: string) => {
  try {
    const response = await api.get(`${COURSES_ENDPOINT}/${courseId}/sections`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al obtener las secciones del curso ${courseId}:`, error);
    throw error;
  }
};

// Obtener sección por ID
export const getSectionById = async (sectionId: string) => {
  try {
    const response = await api.get(`${SECTIONS_ENDPOINT}/${sectionId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al obtener la sección ${sectionId}:`, error);
    throw error;
  }
};

// Validaciones para formularios
export const validateCourseForm = (data: Partial<CourseFormData>): string[] => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }

  if (!data.summary || data.summary.trim().length < 10) {
    errors.push('El resumen debe tener al menos 10 caracteres');
  }

  if (!data.about || data.about.trim().length < 20) {
    errors.push('La descripción debe tener al menos 20 caracteres');
  }

  if (!data.categoryIds || data.categoryIds.length === 0) {
    errors.push('Debe seleccionar al menos una categoría');
  }

  if (!data.image || !data.image.trim()) {
    errors.push('Debe proporcionar una imagen para el curso');
  }

  return errors;
};

export const validateSectionForm = (data: Partial<SectionFormData>): string[] => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('El título de la sección debe tener al menos 3 caracteres');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('La descripción de la sección debe tener al menos 10 caracteres');
  }

  if (!data.moduleType || data.moduleType.trim().length === 0) {
    errors.push('Debe especificar el tipo de módulo');
  }

  return errors;
};
