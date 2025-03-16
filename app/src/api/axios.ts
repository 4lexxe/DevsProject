import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Validar que API_URL esté definido
if (!API_URL) {
  throw new Error("La variable de entorno VITE_API_URL no está definida.");
}

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación a todas las solicitudes
api.interceptors.request.use(config => {
  // Obtener el token desde localStorage con la clave correcta 'token'
  const token = localStorage.getItem('token');
  
  // Si existe un token, agregarlo a los headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
