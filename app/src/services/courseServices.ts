import api from '../api/axios';

const COURSES_ENDPOINT = '/courses';

export const getCourses = async () => {
  try {
    const response = await api.get(COURSES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    throw error;
  }
};

// Agrega más servicios relacionados con cursos aquí
export const createCourse = async (courseData: any) => {
  try {
    const response = await api.post(COURSES_ENDPOINT, courseData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el curso:', error);
    throw error;
  }
};

export const updateCourse = async (id: string, courseData: any) => {
  try {
    const response = await api.put(`${COURSES_ENDPOINT}/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el curso:', error);
    throw error;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const response = await api.delete(`${COURSES_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el curso:', error);
    throw error;
  }
};


// Asegúrate de tener este servicio

interface Course {
  id: number;
  name: string;
}

// Servicio para obtener el conteo de módulos
export const getModulesCount = async (courseId: number): Promise<number> => {
  try {
    const response = await api.get(`/courses/${courseId}/modules/count`);
    if (!response || !response.data) {
      throw new Error('Respuesta vacía del servidor');
    }
    return response.data.sectionCount; // Asegúrate de usar el nombre correcto
  } catch (error: any) {
    console.error(`Error al obtener el conteo de módulos para el curso ${courseId}:`, error.message);
    throw error;
  }
};

