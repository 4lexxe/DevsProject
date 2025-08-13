import api from '../../shared/api/axios'; // Importa la instancia de Axios configurada
// Servicio para manejar las operaciones relacionadas con las calificaciones
const RatingService = {
    /**
     * Obtiene todas las calificaciones de un recurso específico.
     * @param resourceId - ID del recurso.
     * @returns Una promesa con la lista de calificaciones.
     */
    async getRatingsByResource(resourceId) {
        try {
            const response = await api.get(`/rating/${resourceId}`);
            return response.data;
        }
        catch (error) {
            console.error('Error al obtener las calificaciones:', error);
            throw new Error('Error al obtener las calificaciones.');
        }
    },
    /**
     * Agrega o actualiza una calificación de un usuario a un recurso.
     * @param ratingData - Datos de la calificación (resourceId y star).
     * @returns Una promesa con el mensaje de éxito.
     */
    async rateResource(ratingData) {
        try {
            const response = await api.post('/rating/rate', ratingData);
            return response.data;
        }
        catch (error) {
            console.error('Error al calificar el recurso:', error);
            throw new Error('Error al calificar el recurso.');
        }
    },
    /**
     * Elimina una calificación de un usuario a un recurso.
     * @param resourceId - ID del recurso.
     * @returns Una promesa con el mensaje de éxito.
     */
    async deleteRating(resourceId) {
        try {
            const response = await api.delete('/rating', { data: { resourceId } });
            return response.data;
        }
        catch (error) {
            console.error('Error al eliminar la calificación:', error);
            throw new Error('Error al eliminar la calificación.');
        }
    },
    /**
     * Obtiene la cantidad total de estrellas de un recurso.
     * @param resourceId - ID del recurso.
     * @returns Una promesa con el recuento de estrellas.
     */
    async getStarCount(resourceId) {
        try {
            const response = await api.get(`/rating/star-count/${resourceId}`);
            return response.data;
        }
        catch (error) {
            console.error('Error al obtener el recuento de estrellas:', error);
            throw new Error('Error al obtener el recuento de estrellas.');
        }
    },
};
export default RatingService;
