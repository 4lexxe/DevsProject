import api from "@/api/axios"; // Importa la instancia de axios

const CATEGORY_ENDPOINT = "/category";
const CAREERTYPE_ENPOINT = "/careerType"

export const getCategories = async () => {
  try {
    const response = await api.get(CATEGORY_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    throw error;
  }
};

export const getCareerTypes = async() => {
  try {
    const response = await api.get(CAREERTYPE_ENPOINT);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    throw error;
  }
}
