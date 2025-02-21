import api from "@/api/axios"; // Importa la instancia de axios

const CATEGORY_ENDPOINT = "/category/actives";
const CAREERTYPE_ENPOINT = "/careerType/actives"
const COURSES_ENDPOINT = "/course"
const SECTIONS_ENDPOINT = '/sections';


// Obtener todas las categorias activas
export const getCategories = async () => {
  try {
    const response = await api.get(CATEGORY_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las categorias activas:", error);
    throw error;
  }
};

// Obtener todas los tipos de carrera activos
export const getCareerTypes = async() => {
  try {
    const response = await api.get(CAREERTYPE_ENPOINT);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los tipos de carrera activas:", error);
    throw error;
  }
} 


// Agregar más servicios relacionados con cursos aquí
export const createFullCourse = async (courseData: any) => {
  try {
    const response = await api.post(COURSES_ENDPOINT, courseData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el curso cons sus categorias y tipo de carrera desde el service:', error);
    throw error;
  }
};

// Crear una nueva sección
export const createSections = async (sectionData: any) => {
  try {
    const response = await api.post(SECTIONS_ENDPOINT, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error al crear las secciones con sus contenidos:', error);
    throw error;
  }
};

