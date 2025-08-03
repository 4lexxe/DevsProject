import api from '../../shared/api/axios'
import { ICareerType, ICareerTypeInput } from '../interfaces/CareerType'

const CAREER_TYPES_ENDPOINT = '/careerTypes'

// Obtener todos los tipos de carrera
export const getCareerTypes = async (): Promise<ICareerType[]> => {
  try {
    const response = await api.get(CAREER_TYPES_ENDPOINT)
    return response.data.data
  } catch (error) {
    console.error('Error al obtener los tipos de carrera:', error)
    throw error
  }
}

// Obtener solo los tipos de carrera activos
export const getActiveCareerTypes = async (): Promise<ICareerType[]> => {
  try {
    const response = await api.get(`${CAREER_TYPES_ENDPOINT}/actives`)
    return response.data.data
  } catch (error) {
    console.error('Error al obtener los tipos de carrera activos:', error)
    throw error
  }
}

// Obtener tipo de carrera por ID
export const getCareerTypeById = async (id: string): Promise<ICareerType> => {
  try {
    const response = await api.get(`${CAREER_TYPES_ENDPOINT}/${id}`)
    return response.data.data
  } catch (error) {
    console.error('Error al obtener el tipo de carrera:', error)
    throw error
  }
}

// Crear nuevo tipo de carrera
export const createCareerType = async (careerTypeData: ICareerTypeInput): Promise<ICareerType> => {
  try {
    const response = await api.post(CAREER_TYPES_ENDPOINT, careerTypeData)
    return response.data.data
  } catch (error) {
    console.error('Error al crear el tipo de carrera:', error)
    throw error
  }
}

// Actualizar tipo de carrera
export const updateCareerType = async (id: string, careerTypeData: ICareerTypeInput): Promise<ICareerType> => {
  try {
    const response = await api.put(`${CAREER_TYPES_ENDPOINT}/${id}`, careerTypeData)
    return response.data.data
  } catch (error) {
    console.error('Error al actualizar el tipo de carrera:', error)
    throw error
  }
}

// Eliminar tipo de carrera
export const deleteCareerType = async (id: string): Promise<void> => {
  try {
    await api.delete(`${CAREER_TYPES_ENDPOINT}/${id}`)
  } catch (error) {
    console.error('Error al eliminar el tipo de carrera:', error)
    throw error
  }
}