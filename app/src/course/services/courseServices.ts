import api from '../../shared/api/axios';

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
  if (!id || id === 'undefined') {
    throw new Error('ID del curso no válido');
  }
  
  try {
    const response = await api.get(COURSES_ENDPOINT + `/${id}/price`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    throw error;
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
