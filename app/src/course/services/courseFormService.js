import api from "@/shared/api/axios"; // Importa la instancia de axios
const CATEGORY_ENDPOINT = "/categories/actives";
const CAREERTYPE_ENPOINT = "/careerTypes/actives";
const COURSES_ENDPOINT = "/courses";
const SECTIONS_ENDPOINT = '/sections';
// Obtener todas las categorias activas
export const getCategories = async () => {
    try {
        const response = await api.get(CATEGORY_ENDPOINT);
        return response.data;
    }
    catch (error) {
        console.error("Error al obtener las categorias activas:", error);
        throw error;
    }
};
// Obtener todas los tipos de carrera activos
export const getCareerTypes = async () => {
    try {
        const response = await api.get(CAREERTYPE_ENPOINT);
        return response.data;
    }
    catch (error) {
        console.error("Error al obtener los tipos de carrera activas:", error);
        throw error;
    }
};
// Agregar más servicios relacionados con cursos aquí
export const createFullCourse = async (courseData) => {
    try {
        const response = await api.post(COURSES_ENDPOINT, courseData);
        return response.data;
    }
    catch (error) {
        console.error('Error al crear el curso cons sus categorias y tipo de carrera desde el service:', error);
        throw error;
    }
};
export const editFullCourse = async (id, courseData) => {
    try {
        const response = await api.put(`${COURSES_ENDPOINT}/${id}`, courseData);
        return response.data;
    }
    catch (error) {
        console.error('Error al crear el curso cons sus categorias y tipo de carrera desde el service:', error);
        throw error;
    }
};
// Crear una nueva sección con contenidos
export const createSection = async (sectionData) => {
    try {
        const response = await api.post(SECTIONS_ENDPOINT + "/contents", sectionData);
        return response.data;
    }
    catch (error) {
        console.error('Error al crear las secciones con sus contenidos:', error);
        throw error;
    }
};
// actualizar una sección con contenidos
export const editSection = async (sectionData) => {
    try {
        const response = await api.put(SECTIONS_ENDPOINT + "/contents", sectionData);
        return response.data;
    }
    catch (error) {
        console.error('Error al crear las secciones con sus contenidos:', error);
        throw error;
    }
};
