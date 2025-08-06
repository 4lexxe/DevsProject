import api from '../../shared/api/axios';
import axios from 'axios';

// Obtiene el contenido por sección
const CONTENT = "/contents"

export const getContentBySection = async (sectionId: string) => {
  try {
    console.log(`Obteniendo contenido para la sección ID: ${sectionId}`);
    const response = await api.get(`${CONTENT}/section/${sectionId}`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido de la sección (ID: ${sectionId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtiene un contenido específico por ID y su navegacion
export const getContentById = async (contentId: string) => {
  try {
    console.log(`Obteniendo contenido con ID: ${contentId}`);
    const response = await api.get(`${CONTENT}/navigate/${contentId}`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getQuizById = async (contentId: string) => {
  try {
    console.log(`Obteniendo contenido con ID: ${contentId}`);
    const response = await api.get(`${CONTENT}/${contentId}/quiz`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtener todos los contenidos públicos (sin autenticación)
export const getPublicContents = async () => {
  try {
    console.log('🌐 Obteniendo contenidos públicos');
    
    // Usar una instancia de axios sin interceptores para rutas públicas
    const publicApi = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const response = await publicApi.get('/contents');
    console.log('📡 Respuesta del API:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching public contents:', error);
    throw error;
  }
};