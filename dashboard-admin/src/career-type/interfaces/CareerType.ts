export interface ICareerType {
  id: string
  name: string
  description: string
  icon?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ICareerTypeInput {
  name: string
  description: string
  icon?: string
  isActive: boolean
}

export interface ICareerTypeFormData {
  name: string
  description: string
  icon?: string
  isActive: boolean
}