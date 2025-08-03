// Tipos principales para categorías
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

// Tipos para formularios
export interface CategoryFormData {
  name: string
  icon: string
  description: string
  isActive: boolean
}

// Tipos para filtros
export interface CategoryFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
}

// Tipos para estadísticas
export interface CategoryStats {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
  totalCourses: number
}

// Tipos para props de componentes
export interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (categoryId: number) => void
  onToggleStatus: (categoryId: number, isActive: boolean) => void
  isLoading?: boolean
}

export interface CategoryFormProps {
  category?: Category
  onSubmit: (data: CategoryFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface CategoryStatsProps {
  stats: CategoryStats
  isLoading?: boolean
}

// Tipos para modales
export interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category
  mode: 'create' | 'edit' | 'view'
}

// Tipos para acciones
export type CategoryAction = 'create' | 'edit' | 'delete' | 'toggle-status' | 'view'

// Tipos para respuestas de API
export interface CategoryResponse {
  success: boolean
  data: Category
  message: string
}

export interface CategoriesResponse {
  success: boolean
  data: Category[]
  message: string
}

// Tipos para validación
export interface CategoryValidationErrors {
  name?: string
  icon?: string
  description?: string
  isActive?: string
}

// Tipos para ordenamiento
export type CategorySortField = 'name' | 'createdAt' | 'coursesCount' | 'isActive'
export type SortDirection = 'asc' | 'desc'

export interface CategorySort {
  field: CategorySortField
  direction: SortDirection
}