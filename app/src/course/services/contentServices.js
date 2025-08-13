import api from '../../shared/api/axios';
// Obtiene el contenido por sección
const CONTENT = "/contents";
export const getContentBySection = async (sectionId) => {
    try {
        const response = await api.get(`${CONTENT}/section/${sectionId}`);
        return response.data.data;
    }
    catch (error) {
        console.error(`Error al obtener el contenido de la sección (ID: ${sectionId}):`, error.response?.data || error.message);
        throw error;
    }
};
// Obtiene un contenido específico por ID y su navegacion
export const getContentById = async (contentId) => {
    try {
        const response = await api.get(`${CONTENT}/navigate/${contentId}`);
        return response.data.data;
    }
    catch (error) {
        console.error(`Error al obtener el contenido (ID: ${contentId}):`, error.response?.data || error.message);
        throw error;
    }
};
export const getQuizByContentId = async (contentId) => {
    try {
        const response = await api.get(`${CONTENT}/${contentId}/quiz`);
        return response.data.data;
    }
    catch (error) {
        console.error(`Error al obtener el contenido (ID: ${contentId}):`, error.response?.data || error.message);
        throw error;
    }
};
