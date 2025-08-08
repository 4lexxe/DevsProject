import api from '../../shared/api/axios';
const ADMIN_ENDPOINT = '/admins';
// Crear un administrador
export const createAdmin = async (userId, adminData) => {
    try {
        const response = await api.post(ADMIN_ENDPOINT, { userId, admin: adminData });
        return response.data;
    }
    catch (error) {
        console.error('Error al crear el administrador:', error);
        throw error;
    }
};
// Obtener todos los administradores
export const getAllAdmins = async () => {
    try {
        const response = await api.get(ADMIN_ENDPOINT);
        return response.data;
    }
    catch (error) {
        console.error('Error al obtener los administradores:', error);
        throw error;
    }
};
// Obtener un administrador por ID
export const getAdminById = async (adminId) => {
    try {
        const response = await api.get(`${ADMIN_ENDPOINT}/${adminId}`);
        return response.data;
    }
    catch (error) {
        console.error(`Error al obtener el administrador con id ${adminId}:`, error);
        throw error;
    }
};
// Actualizar un administrador
export const updateAdmin = async (adminId, adminData) => {
    try {
        const response = await api.put(`${ADMIN_ENDPOINT}/${adminId}`, adminData);
        return response.data;
    }
    catch (error) {
        console.error(`Error al actualizar el administrador con id ${adminId}:`, error);
        throw error;
    }
};
// Eliminar un administrador
export const deleteAdmin = async (adminId) => {
    try {
        await api.delete(`${ADMIN_ENDPOINT}/${adminId}`);
        return true;
    }
    catch (error) {
        console.error(`Error al eliminar el administrador con id ${adminId}:`, error);
        throw error;
    }
};
