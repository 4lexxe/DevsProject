import api from '../../shared/api/axios';

// Definir la interfaz para HeaderSection
export interface HeaderSection {
  id?: string;
  image: string;
  title: string;
  slogan: string;
  about: string;
  buttonName: string;
  buttonLink: string;
}

const HEADER_SECTION_ENDPOINT = '/header-sections';

// Obtener todas las secciones de encabezado
export const getHeaderSections = async (): Promise<HeaderSection[]> => {
  try {
    const response = await api.get(HEADER_SECTION_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las secciones de encabezado:', error);
    throw error;
  }
};

// Obtener una sección de encabezado por ID
export const getHeaderSectionById = async (id: string) => {
  try {
    const response = await api.get(`${HEADER_SECTION_ENDPOINT}/${id}`);
    return response;
  } catch (error) {
    console.error('Error al obtener la sección de encabezado:', error);
    throw error;
  }
};

// Crear una nueva sección de encabezado
export const createHeaderSection = async (headerSectionData: HeaderSection) => {
  try {
    console.log('Datos que se envían al servidor:', headerSectionData);
    // Asegurarse de que se envía el ID si está definido
    const response = await api.post(HEADER_SECTION_ENDPOINT, headerSectionData);
    console.log('Respuesta del servidor:', response.data);
    return response;
  } catch (error) {
    console.error('Error al crear la sección de encabezado:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown } };
      console.error('Detalles del error del servidor:', axiosError.response?.data);
    }
    throw error;
  }
};

// Actualizar una sección de encabezado
export const updateHeaderSection = async (id: string, headerSectionData: HeaderSection) => {
  try {
    const response = await api.put(`${HEADER_SECTION_ENDPOINT}/${id}`, headerSectionData);
    return response;
  } catch (error) {
    console.error('Error al actualizar la sección de encabezado:', error);
    throw error;
  }
};

// Eliminar una sección de encabezado
export const deleteHeaderSection = async (id: string) => {
  try {
    const response = await api.delete(`${HEADER_SECTION_ENDPOINT}/${id}`);
    return response;
  } catch (error) {
    console.error('Error al eliminar la sección de encabezado:', error);
    throw error;
  }
};