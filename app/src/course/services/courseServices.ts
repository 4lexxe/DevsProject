import api from '../../api/axios';

interface Course {
  id: number;
  name: string;
}

const COURSES_ENDPOINT = '/courses';

//Obtener todos los cursos activos
export const getCourses = async () => {
  try {
    const response = await api.get(COURSES_ENDPOINT + "/actives");
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    throw error;
  }
};

// Obtener curso por id
export const getById = async(id: string) => {
  if(id){
    try {
      const response = await api.get(COURSES_ENDPOINT + `/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
      throw error;
    }
  }
}

// Agregar más servicios relacionados con cursos aquí
export const createCourse = async (courseData: any) => {
  try {
    const response = await api.post(COURSES_ENDPOINT, courseData);
    return response.data.data;
  } catch (error) {
    console.error('Error al crear el curso desde el service:', error);
    throw error;
  }
};

// Servicio para Eliminar
export const updateCourse = async (id: string, courseData: any) => {
  try {
    const response = await api.put(`${COURSES_ENDPOINT}/${id}`, courseData);
    return response.data.data;
  } catch (error) {
    console.error('Error al actualizar el curso:', error);
    throw error;
  }
};

// Servicio para 
export const deleteCourse = async (id: string) => {
  try {
    const response = await api.delete(`${COURSES_ENDPOINT}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al eliminar el curso:', error);
    throw error;
  }
};

// Servicio para obtener el conteo de módulos
/* export const getModulesCount = async (courseId: number): Promise<number> => { 
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
}; */