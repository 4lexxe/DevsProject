import api from '../../shared/api/axios';

const CONTENT_ENDPOINT = "/contents";
const SECTIONS_ENDPOINT = "/sections";

// Interfaces para contenidos
export interface Content {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'exercise';
  content: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  sectionId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  colorGradient: [string, string];
  courseId: string;
  order: number;
  contents?: Content[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Quiz {
  id: string;
  contentId: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export interface ContentNavigation {
  current: Content;
  previous?: Content;
  next?: Content;
  section: Section;
  course: {
    id: string;
    title: string;
  };
}

// Obtener contenido por sección
export const getContentBySection = async (sectionId: string): Promise<Content[]> => {
  try {
    console.log(`Obteniendo contenido para la sección ID: ${sectionId}`);
    const response = await api.get(`${CONTENT_ENDPOINT}/section/${sectionId}`);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error(
      `Error al obtener el contenido de la sección (ID: ${sectionId}):`,
      error instanceof Error ? error.message : 'Error desconocido'
    );
    throw error;
  }
};

// Obtener contenido específico con navegación
export const getContentById = async (contentId: string): Promise<ContentNavigation> => {
  try {
    console.log(`Obteniendo contenido con ID: ${contentId}`);
    const response = await api.get(`${CONTENT_ENDPOINT}/navigate/${contentId}`);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error(
      `Error al obtener el contenido (ID: ${contentId}):`,
      error instanceof Error ? error.message : 'Error desconocido'
    );
    throw error;
  }
};

// Obtener contenido simple por ID
export const getSimpleContentById = async (contentId: string): Promise<Content> => {
  try {
    const response = await api.get(`${CONTENT_ENDPOINT}/${contentId}`);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error(`Error al obtener el contenido (ID: ${contentId}):`, error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Obtener quiz por ID de contenido
export const getQuizById = async (contentId: string): Promise<Quiz> => {
  try {
    console.log(`Obteniendo quiz para contenido ID: ${contentId}`);
    const response = await api.get(`${CONTENT_ENDPOINT}/${contentId}/quiz`);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error(
      `Error al obtener el quiz (ID: ${contentId}):`,
      error instanceof Error ? error.message : 'Error desconocido'
    );
    throw error;
  }
};

// Crear nuevo contenido
export const createContent = async (contentData: Partial<Content>): Promise<Content> => {
  try {
    const response = await api.post(CONTENT_ENDPOINT, contentData);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error('Error al crear el contenido:', error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Actualizar contenido
export const updateContent = async (contentId: string, contentData: Partial<Content>): Promise<Content> => {
  try {
    const response = await api.put(`${CONTENT_ENDPOINT}/${contentId}`, contentData);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error(`Error al actualizar el contenido (ID: ${contentId}):`, error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Eliminar contenido
export const deleteContent = async (contentId: string): Promise<boolean> => {
  try {
    await api.delete(`${CONTENT_ENDPOINT}/${contentId}`);
    return true;
  } catch (error: unknown) {
    console.error(`Error al eliminar el contenido (ID: ${contentId}):`, error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Reordenar contenidos en una sección
export const reorderContents = async (sectionId: string, contentIds: string[]): Promise<boolean> => {
  try {
    await api.patch(`${SECTIONS_ENDPOINT}/${sectionId}/reorder-contents`, { contentIds });
    return true;
  } catch (error: unknown) {
    console.error(`Error al reordenar contenidos de la sección (ID: ${sectionId}):`, error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Crear quiz para un contenido
export const createQuiz = async (contentId: string, quizData: Partial<Quiz>): Promise<Quiz> => {
  try {
    const response = await api.post(`${CONTENT_ENDPOINT}/${contentId}/quiz`, quizData);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error(`Error al crear quiz para contenido (ID: ${contentId}):`, error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Actualizar quiz
export const updateQuiz = async (contentId: string, quizData: Partial<Quiz>): Promise<Quiz> => {
  try {
    const response = await api.put(`${CONTENT_ENDPOINT}/${contentId}/quiz`, quizData);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error(`Error al actualizar quiz para contenido (ID: ${contentId}):`, error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Obtener todos los contenidos (para dashboard admin)
export const getAllContents = async (filters?: { sectionId?: string; courseId?: string; type?: string }): Promise<Content[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.sectionId) params.append('sectionId', filters.sectionId);
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.type) params.append('type', filters.type);

    const endpoint = params.toString() ? `${CONTENT_ENDPOINT}?${params.toString()}` : CONTENT_ENDPOINT;
    const response = await api.get(endpoint);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error('Error al obtener todos los contenidos:', error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Estadísticas de contenido
export const getContentStats = async (courseId?: string) => {
  try {
    const endpoint = courseId ? `${CONTENT_ENDPOINT}/stats?courseId=${courseId}` : `${CONTENT_ENDPOINT}/stats`;
    const response = await api.get(endpoint);
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error('Error al obtener estadísticas de contenido:', error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};
