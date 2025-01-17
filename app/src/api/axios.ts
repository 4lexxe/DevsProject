import axios from 'axios';

// Definir el tipo para las variables de entorno de Vite
interface ImportMetaEnv {
  VITE_API_URL: string;
  // Añade aquí otras variables de entorno si las necesitas
}

// Acceder a las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;