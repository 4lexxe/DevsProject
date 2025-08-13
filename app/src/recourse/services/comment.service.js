import api from '../../shared/api/axios';
// Crear un nuevo comentario
export const createComment = async (commentData) => {
    try {
        const response = await api.post('/comment', commentData); // Prefijo /api/comment
        return response.data;
    }
    catch (error) {
        const err = error;
        throw new Error(err.response?.data?.error || 'Error al crear el comentario');
    }
};
// Obtener todos los comentarios de un recurso
export const getCommentsByResource = async (resourceId) => {
    try {
        const response = await api.get(`/comment/resource/${resourceId}`); // Prefijo /api/comment
        return response.data;
    }
    catch (error) {
        const err = error;
        throw new Error(err.response?.data?.error || 'Error al obtener los comentarios');
    }
};
// Actualizar un comentario existente
export const updateComment = async (id, commentData) => {
    try {
        const response = await api.put(`/comment/${id}`, commentData); // Prefijo /api/comment
        return response.data;
    }
    catch (error) {
        const err = error;
        throw new Error(err.response?.data?.error || 'Error al actualizar el comentario');
    }
};
// Eliminar un comentario
export const deleteComment = async (id) => {
    try {
        await api.delete(`/comment/${id}`); // Prefijo /api/comment
    }
    catch (error) {
        const err = error;
        throw new Error(err.response?.data?.error || 'Error al eliminar el comentario');
    }
};
