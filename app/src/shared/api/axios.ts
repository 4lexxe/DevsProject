import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Validar que API_URL esté definido
if (!API_URL) {
  throw new Error("La variable de entorno VITE_API_URL no está definida.");
}

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor para requests - las cookies HttpOnly se envían automáticamente
api.interceptors.request.use(
  (config) => {
    // Ya no necesitamos agregar manualmente el token Authorization
    // Las cookies HttpOnly se envían automáticamente con cada request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores de autenticación de forma más inteligente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Solo redirigir a login si es un endpoint que requiere autenticación
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Lista de endpoints públicos que no deberían redirigir a login
      const publicEndpoints = [
        '/resources',
        '/users/public',
        '/courses',
        '/sections',
        '/contents',
        '/header-sections',
        '/auth/verify',
        '/auth/login',
        '/auth/register',
        '/comment/resource',
        '/rating/'
      ];
      
      // Solo redirigir si NO es un endpoint público
      const isPublicEndpoint = publicEndpoints.some(endpoint => url.includes(endpoint));
      
      if (!isPublicEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
