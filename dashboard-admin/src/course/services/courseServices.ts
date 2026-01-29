import api from '../../shared/api/axios';

const COURSES_ENDPOINT = '/courses';

// Obtener todos los cursos (incluyendo inactivos)
export const getAll = async () => {
  try {
    const response = await api.get(COURSES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los cursos:', error);
    throw error;
  }
};

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
      const response = await api.get(COURSES_ENDPOINT + `/${id}/price`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
      throw error;
    }
  }
}

// Obtener navegacion de un curso por su id
export const getNavegationById = async(id: string) => {
  if(id){
    try {
      const response = await api.get(COURSES_ENDPOINT + `/${id}/navigate`);
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

// Servicio para eliminar curso
export const deleteCourse = async (id: string) => {
  try {
    const response = await api.delete(`${COURSES_ENDPOINT}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al eliminar el curso:', error);
    throw error;
  }
};

// Obtener información completa del curso (creador, instructor, secciones, contenidos, usuarios inscritos)
export const getCourseCompleteInfo = async (id: string) => {
  try {
    const response = await api.get(`${COURSES_ENDPOINT}/${id}/complete`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la información completa del curso:', error);
    throw error;
  }
};

// Obtener usuarios inscritos en un curso
export const getCourseEnrolledUsers = async (id: string, includeRevoked: boolean = false) => {
  try {
    const response = await api.get(`${COURSES_ENDPOINT}/${id}/enrolled-users`, {
      params: { includeRevoked }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los usuarios inscritos:', error);
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