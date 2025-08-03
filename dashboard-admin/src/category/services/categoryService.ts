import api from '../../shared/api/axios'

const CATEGORIES_ENDPOINT = '/categories'

// Interfaces para categorías
export interface Category {
  id: number
  name: string
  icon: string
  description: string
  isActive: boolean
  coursesCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CategoryFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
}

export interface CategoryStats {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
  totalCourses: number
}

export interface CreateCategoryData {
  name: string
  icon: string
  description: string
  isActive: boolean
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

// Obtener todas las categorías
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get(CATEGORIES_ENDPOINT)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    throw error
  }
}

// Obtener categorías activas
export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get(`${CATEGORIES_ENDPOINT}/actives`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al obtener categorías activas:', error)
    throw error
  }
}

// Obtener categorías activas limitadas
export const getActiveCategoriesLimited = async (limit: number = 2): Promise<Category[]> => {
  try {
    const response = await api.get(`${CATEGORIES_ENDPOINT}/actives/limit?limit=${limit}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al obtener categorías activas limitadas:', error)
    throw error
  }
}

// Obtener una categoría por ID
export const getCategoryById = async (categoryId: number): Promise<Category> => {
  try {
    const response = await api.get(`${CATEGORIES_ENDPOINT}/${categoryId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al obtener categoría:', error)
    throw error
  }
}

// Crear una nueva categoría
export const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
  try {
    const response = await api.post(CATEGORIES_ENDPOINT, categoryData)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al crear categoría:', error)
    throw error
  }
}

// Actualizar una categoría
export const updateCategory = async (categoryId: number, categoryData: UpdateCategoryData): Promise<Category> => {
  try {
    const response = await api.put(`${CATEGORIES_ENDPOINT}/${categoryId}`, categoryData)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    throw error
  }
}

// Eliminar una categoría
export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await api.delete(`${CATEGORIES_ENDPOINT}/${categoryId}`)
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    throw error
  }
}

// Obtener estadísticas de categorías
export const getCategoryStats = async (): Promise<CategoryStats> => {
  try {
    const categories = await getAllCategories()
    const activeCategories = categories.filter(cat => cat.isActive)
    const inactiveCategories = categories.filter(cat => !cat.isActive)
    const totalCourses = categories.reduce((sum, cat) => sum + (cat.coursesCount || 0), 0)
    
    return {
      totalCategories: categories.length,
      activeCategories: activeCategories.length,
      inactiveCategories: inactiveCategories.length,
      totalCourses
    }
  } catch (error) {
    console.error('Error al obtener estadísticas de categorías:', error)
    throw error
  }
}

// Filtrar categorías del lado del cliente
export const filterCategories = (categories: Category[], filters: CategoryFilters): Category[] => {
  return categories.filter(category => {
    // Filtro de búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const matchesName = category.name?.toLowerCase().includes(searchTerm)
      const matchesDescription = category.description?.toLowerCase().includes(searchTerm)
      
      if (!matchesName && !matchesDescription) {
        return false
      }
    }
    
    // Filtro por estado
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active' && !category.isActive) {
        return false
      }
      if (filters.status === 'inactive' && category.isActive) {
        return false
      }
    }
    
    return true
  })
}