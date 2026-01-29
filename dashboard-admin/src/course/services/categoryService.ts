import api from '../../shared/api/axios';

export interface Category {
  id?: number;
  name: string;
  icon?: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  coursesCount?: number;
}

export interface CategoryCreateRequest {
  name: string;
  icon?: string;
  description: string;
  isActive?: boolean;
}

export interface CategoryUpdateRequest {
  name?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}

const CATEGORIES_ENDPOINT = '/categories';

// Obtener todas las categorías
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get(CATEGORIES_ENDPOINT);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Obtener todas las categorías activas
export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get(`${CATEGORIES_ENDPOINT}/actives`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching active categories:', error);
    throw error;
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await api.get(`${CATEGORIES_ENDPOINT}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

// Crear una nueva categoría
export const createCategory = async (categoryData: CategoryCreateRequest): Promise<Category> => {
  try {
    const response = await api.post(CATEGORIES_ENDPOINT, categoryData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Actualizar una categoría
export const updateCategory = async (id: number, categoryData: CategoryUpdateRequest): Promise<Category> => {
  try {
    const response = await api.put(`${CATEGORIES_ENDPOINT}/${id}`, categoryData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

// Eliminar una categoría
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`${CATEGORIES_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};
