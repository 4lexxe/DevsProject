import api from '../../shared/api/axios'
import type { User } from './auth.service'

const USERS_ENDPOINT = '/users'

// Interfaces adicionales para el dashboard
export interface UserFilters {
  role?: string
  status?: 'active' | 'inactive'
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersThisMonth: number
}

// Obtener todos los usuarios con filtros
export const getAllUsers = async (filters?: UserFilters): Promise<User[]> => {
  try {
    // Como el backend no maneja filtros, solo obtenemos todos los usuarios
    // y aplicamos el filtrado del lado del cliente
    const response = await api.get(USERS_ENDPOINT)
    const allUsers = response.data.data || response.data
    
    // Si no hay filtros, retornamos todos los usuarios
    if (!filters) return allUsers
    
    // Aplicar filtros del lado del cliente
    return allUsers.filter((user: User) => {
      // Filtro de búsqueda por texto
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const matchesName = user.name?.toLowerCase().includes(searchTerm)
        const matchesEmail = user.email?.toLowerCase().includes(searchTerm)
        const matchesUsername = user.username?.toLowerCase().includes(searchTerm)
        const matchesDisplayName = user.displayName?.toLowerCase().includes(searchTerm)
        
        if (!matchesName && !matchesEmail && !matchesUsername && !matchesDisplayName) {
          return false
        }
      }
      
      // Filtro por rol
      if (filters.role && user.role?.name.toLowerCase() !== filters.role.toLowerCase()) {
        return false
      }
      
      // Filtro por estado
      if (filters.status) {
        if (filters.status === 'active' && !user.isActiveSession) return false
        if (filters.status === 'inactive' && user.isActiveSession) return false
      }
      
      // Filtro por rango de fechas - como no tenemos createdAt, lo omitimos por ahora
      // TODO: Agregar createdAt al interface User si es necesario
      if (filters.dateFrom || filters.dateTo) {
        // Si necesitamos filtro por fechas, podríamos usar lastActiveAt
        const userDate = user.lastActiveAt ? new Date(user.lastActiveAt) : new Date()
        if (filters.dateFrom && userDate < new Date(filters.dateFrom)) return false
        if (filters.dateTo && userDate > new Date(filters.dateTo)) return false
      }
      
      return true
    })
  } catch (error) {
    console.error('Error al obtener los usuarios:', error)
    throw error
  }
}

// Obtener usuario por ID
export const getUserById = async (userId: number): Promise<User> => {
  try {
    console.log(`Fetching user with ID: ${userId}`)
    console.log(`API endpoint: ${USERS_ENDPOINT}/${userId}`)
    const response = await api.get(`${USERS_ENDPOINT}/${userId}`)
    console.log('User API response:', response.data)
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error al obtener el usuario con id ${userId}:`, error)
    if (error.response) {
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
    }
    throw error
  }
}

// Crear nuevo usuario
export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.post(USERS_ENDPOINT, userData)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al crear el usuario:', error)
    throw error
  }
}

// Actualizar usuario
export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`${USERS_ENDPOINT}/${userId}`, userData)
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error al actualizar el usuario con id ${userId}:`, error)
    throw error
  }
}

// Eliminar usuario
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await api.delete(`${USERS_ENDPOINT}/${userId}`)
  } catch (error) {
    console.error(`Error al eliminar el usuario con id ${userId}:`, error)
    throw error
  }
}

// Desactivar usuario
export const deactivateUser = async (userId: number): Promise<User> => {
  try {
    const response = await api.patch(`${USERS_ENDPOINT}/${userId}/deactivate`)
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error al desactivar el usuario con id ${userId}:`, error)
    throw error
  }
}

// Activar usuario
export const activateUser = async (userId: number): Promise<User> => {
  try {
    const response = await api.patch(`${USERS_ENDPOINT}/${userId}/activate`)
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error al activar el usuario con id ${userId}:`, error)
    throw error
  }
}

// Obtener estadísticas de usuarios
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const response = await api.get(`${USERS_ENDPOINT}/stats`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al obtener las estadísticas de usuarios:', error)
    // Retornar valores por defecto en caso de error
    return {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      newUsersThisMonth: 0
    }
  }
}

// Obtener roles disponibles
export const getRoles = async () => {
  try {
    const response = await api.get('/roles')
    return response.data.data || response.data
  } catch (error) {
    console.error('Error al obtener los roles:', error)
    // Retornar roles por defecto si el endpoint no existe
    return [
      { id: 1, name: 'admin', description: 'Administrador' },
      { id: 2, name: 'user', description: 'Usuario' },
      { id: 3, name: 'superadmin', description: 'Super Administrador' }
    ]
  }
}
