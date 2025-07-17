import api from '../../shared/api/axios';

// Función para verificar si un email existe en la base de datos
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await api.post('/auth/check-email', { email });
    return response.data.exists || false;
  } catch (error) {
    console.error('Error al verificar email:', error);
    // Si hay error en la petición, asumimos que el email no existe
    // para no bloquear el formulario
    return false;
  }
};
