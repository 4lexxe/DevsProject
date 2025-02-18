import axios, { AxiosError } from "axios";

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

// Interceptor de solicitud para agregar autenticación si es necesario
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtener token desde almacenamiento local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejo global de errores
api.interceptors.response.use(
  (response) => response.data, // Devolver la respuesta si es exitosa
  (error: AxiosError) => {
    console.error("Error en la respuesta de la API:", error);

    if (error.response) {
      // Errores con respuesta del servidor
      if (error.response.status === 401) {
        console.warn("No autorizado. Redirigiendo a login...");
        // Puedes redirigir a login si usas React/Vue/Angular
      } else if (error.response.status === 500) {
        console.warn("Error interno del servidor.");
      }
    } else if (error.request) {
      // No hay respuesta del servidor
      console.warn("No hay respuesta del servidor. Verifica tu conexión.");
    } else {
      // Otro tipo de error
      console.warn("Error en la configuración de la solicitud.");
    }

    return Promise.reject(error);
  }
);

export default api;
