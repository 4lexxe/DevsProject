import api from '../../shared/api/axios';

export interface CareerType {
  id?: number;
  name: string;
  icon?: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerTypeCreateRequest {
  name: string;
  icon?: string;
  description: string;
  isActive?: boolean;
}

export interface CareerTypeUpdateRequest {
  name?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}

const CAREER_TYPES_ENDPOINT = '/careerTypes';

// Obtener todos los tipos de carrera
export const getCareerTypes = async (): Promise<CareerType[]> => {
  try {
    const response = await api.get(CAREER_TYPES_ENDPOINT);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching career types:', error);
    throw error;
  }
};

// Obtener todos los tipos de carrera activos
export const getActiveCareerTypes = async (): Promise<CareerType[]> => {
  try {
    const response = await api.get(`${CAREER_TYPES_ENDPOINT}/actives`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching active career types:', error);
    throw error;
  }
};

// Obtener un tipo de carrera por ID
export const getCareerTypeById = async (id: number): Promise<CareerType> => {
  try {
    const response = await api.get(`${CAREER_TYPES_ENDPOINT}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching career type with id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo tipo de carrera
export const createCareerType = async (careerTypeData: CareerTypeCreateRequest): Promise<CareerType> => {
  try {
    const response = await api.post(CAREER_TYPES_ENDPOINT, careerTypeData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating career type:', error);
    throw error;
  }
};

// Actualizar un tipo de carrera
export const updateCareerType = async (id: number, careerTypeData: CareerTypeUpdateRequest): Promise<CareerType> => {
  try {
    const response = await api.put(`${CAREER_TYPES_ENDPOINT}/${id}`, careerTypeData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating career type with id ${id}:`, error);
    throw error;
  }
};

// Eliminar un tipo de carrera
export const deleteCareerType = async (id: number): Promise<void> => {
  try {
    await api.delete(`${CAREER_TYPES_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting career type with id ${id}:`, error);
    throw error;
  }
};
