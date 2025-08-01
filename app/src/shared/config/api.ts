// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configuración adicional de la API
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Endpoints específicos
export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
  },
  
  // Cursos
  COURSES: {
    BASE: '/courses',
    ACTIVES: '/courses/actives',
    BY_CATEGORY: '/courses/category',
    BY_CAREER_TYPE: '/courses/careerType',
  },
  
  // Búsqueda
  SEARCH: {
    COURSES: '/search/courses',
    ADVANCED: '/search/courses/advanced',
    SUGGESTIONS: '/search/courses/suggestions',
  },
  
  // Usuarios
  USERS: {
    BASE: '/users',
    PUBLIC: '/users/public',
  },
  
  // Recursos
  RESOURCES: {
    BASE: '/resources',
  },
  
  // Categorías
  CATEGORIES: {
    BASE: '/categories',
    ACTIVES: '/categories/actives',
  },
  
  // Tipos de carrera
  CAREER_TYPES: {
    BASE: '/careerTypes',
    ACTIVES: '/careerTypes/actives',
  },
};