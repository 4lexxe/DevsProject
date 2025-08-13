import api from '@/shared/api/axios';
const USERS_ENDPOINT = '/users';
// Obtener todos los usuarios con filtros
export const getAllUsers = async (filters) => {
    try {
        // Como el backend no maneja filtros, solo obtenemos todos los usuarios
        // y aplicamos el filtrado del lado del cliente
        const response = await api.get(USERS_ENDPOINT);
        const allUsers = response.data.data || response.data;
        // Si no hay filtros, retornamos todos los usuarios
        if (!filters)
            return allUsers;
        // Aplicar filtros del lado del cliente
        return allUsers.filter((user) => {
            // Filtro de búsqueda por texto
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const matchesName = user.name?.toLowerCase().includes(searchTerm);
                const matchesEmail = user.email?.toLowerCase().includes(searchTerm);
                const matchesUsername = user.username?.toLowerCase().includes(searchTerm);
                const matchesDisplayName = user.displayName?.toLowerCase().includes(searchTerm);
                if (!matchesName && !matchesEmail && !matchesUsername && !matchesDisplayName) {
                    return false;
                }
            }
            // Filtro por rol
            if (filters.role && user.role?.name.toLowerCase() !== filters.role.toLowerCase()) {
                return false;
            }
            // Filtro por estado
            if (filters.status) {
                if (filters.status === 'active' && !user.isActiveSession)
                    return false;
                if (filters.status === 'inactive' && user.isActiveSession)
                    return false;
            }
            // Filtro por rango de fechas - como no tenemos createdAt, lo omitimos por ahora
            // TODO: Agregar createdAt al interface User si es necesario
            if (filters.dateFrom || filters.dateTo) {
                // Si necesitamos filtro por fechas, podríamos usar lastActiveAt
                const userDate = user.lastActiveAt ? new Date(user.lastActiveAt) : new Date();
                if (filters.dateFrom && userDate < new Date(filters.dateFrom))
                    return false;
                if (filters.dateTo && userDate > new Date(filters.dateTo))
                    return false;
            }
            return true;
        });
    }
    catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error;
    }
};
// Obtener usuario por ID
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`${USERS_ENDPOINT}/${userId}`);
        return response.data.data || response.data;
    }
    catch (error) {
        console.error(`Error al obtener el usuario con id ${userId}:`, error);
        throw error;
    }
};
// Actualizar información de usuario
export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`${USERS_ENDPOINT}/${userId}`, userData);
        return response.data.data || response.data;
    }
    catch (error) {
        console.error(`Error al actualizar el usuario con id ${userId}:`, error);
        throw error;
    }
};
// Desactivar usuario
export const deactivateUser = async (userId) => {
    try {
        await api.patch(`${USERS_ENDPOINT}/${userId}/deactivate`);
        return true;
    }
    catch (error) {
        console.error(`Error al desactivar el usuario con id ${userId}:`, error);
        throw error;
    }
};
// Activar usuario
export const activateUser = async (userId) => {
    try {
        await api.patch(`${USERS_ENDPOINT}/${userId}/activate`);
        return true;
    }
    catch (error) {
        console.error(`Error al activar el usuario con id ${userId}:`, error);
        throw error;
    }
};
// Eliminar usuario
export const deleteUser = async (userId) => {
    try {
        await api.delete(`${USERS_ENDPOINT}/${userId}`);
        return true;
    }
    catch (error) {
        console.error(`Error al eliminar el usuario con id ${userId}:`, error);
        throw error;
    }
};
// Obtener estadísticas de usuarios
export const getUserStats = async () => {
    try {
        const response = await api.get(`${USERS_ENDPOINT}/stats`);
        return response.data.data || response.data;
    }
    catch (error) {
        console.error('Error al obtener las estadísticas de usuarios:', error);
        // Si el endpoint no existe, calculamos desde todos los usuarios
        const users = await getAllUsers();
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return {
            totalUsers: users.length,
            activeUsers: users.filter(user => user.isActiveSession).length,
            inactiveUsers: users.filter(user => !user.isActiveSession).length,
            newUsersThisMonth: users.filter(user => new Date(user.lastActiveAt) >= thisMonth).length
        };
    }
};
// Obtener roles disponibles
export const getRoles = async () => {
    try {
        const response = await api.get('/roles');
        return response.data.data || response.data;
    }
    catch (error) {
        console.error('Error al obtener los roles:', error);
        // Roles por defecto si no existe el endpoint
        return [
            { id: 1, name: 'user', description: 'Usuario regular' },
            { id: 2, name: 'admin', description: 'Administrador' },
            { id: 3, name: 'superadmin', description: 'Super Administrador' }
        ];
    }
};
