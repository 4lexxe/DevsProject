import api from '../api/axios';

// Definir interfaces
interface AdminData {
  name: string;
  admin_since: string;
  permissions: string[];
  isSuperAdmin: boolean;
  admin_notes?: string;
}

interface Admin extends AdminData {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const ADMIN_ENDPOINT = '/admins';

// Crear un administrador
export const createAdmin = async (userId: number, adminData: AdminData): Promise<Admin> => {
  try {
    const response = await api.post(ADMIN_ENDPOINT, { userId, admin: adminData });
    return response.data;
  } catch (error) {
    console.error('Error al crear el administrador:', error);
    throw error;
  }
};

// Obtener todos los administradores
export const getAllAdmins = async (): Promise<Admin[]> => {
  try {
    const response = await api.get(ADMIN_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los administradores:', error);
    throw error;
  }
};

// Obtener un administrador por ID
export const getAdminById = async (adminId: number): Promise<Admin> => {
  try {
    const response = await api.get(`${ADMIN_ENDPOINT}/${adminId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el administrador con id ${adminId}:`, error);
    throw error;
  }
};

// Actualizar un administrador
export const updateAdmin = async (adminId: number, adminData: Partial<AdminData>): Promise<Admin> => {
  try {
    const response = await api.put(`${ADMIN_ENDPOINT}/${adminId}`, adminData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el administrador con id ${adminId}:`, error);
    throw error;
  }
};

// Eliminar un administrador
export const deleteAdmin = async (adminId: number): Promise<boolean> => {
  try {
    await api.delete(`${ADMIN_ENDPOINT}/${adminId}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar el administrador con id ${adminId}:`, error);
    throw error;
  }
};