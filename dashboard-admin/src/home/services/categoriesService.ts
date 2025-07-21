import api from "@/shared/api/axios"; // Importa la instancia de axios

const CATEGORY_ENDPOINT = "/categories/actives";


// Obtener todas las categorias activas
export const getCategoriesActivesLimited = async (limit: string) => {
  try {
    const response = await api.get(CATEGORY_ENDPOINT + `?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener las categorias activas:", error);
    throw error;
  }
};

export const getCoursesByCategory = async (id: string) => {
  try {
    const response = await api.get(`/courses/category/actives/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los cursos de categorias activas:", error);
    throw error;
  }
};