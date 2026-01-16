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

// Servicio para obtener usuarios con acceso a un curso
export const getCourseUsers = async (courseId: number) => {
  try {
    // Este endpoint debería devolver todos los usuarios que tienen acceso al curso
    // Basado en el modelo CourseAccess del backend
    const response = await api.get(`/course-access/course/${courseId}/users`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener usuarios del curso ${courseId}:`, error);
    throw error;
  }
};

// Servicio para otorgar acceso a múltiples usuarios a un curso
export const grantCourseAccess = async (userIds: number[], courseId: number) => {
  try {
    const promises = userIds.map(userId =>
      api.post('/course-access/grant', { userId, courseId })
    );
    const responses = await Promise.all(promises);
    return responses.map(res => res.data.data);
  } catch (error) {
    console.error('Error al otorgar acceso:', error);
    throw error;
  }
};

// Servicio para revocar acceso a un usuario de un curso
export const revokeCourseAccess = async (userId: number, courseId: number, revokeReason: string) => {
  try {
    const response = await api.put(`/course-access/${userId}/courses/${courseId}/revoke`, {
      revokeReason
    });
    return response.data.data;
  } catch (error) {
    console.error('Error al revocar acceso:', error);
    throw error;
  }
};