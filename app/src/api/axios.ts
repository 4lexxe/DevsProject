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



export default api;
