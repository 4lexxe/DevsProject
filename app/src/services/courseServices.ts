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