import axiosInstance from '@/shared/api/axios';
class CartService {
    baseUrl = '/cart';
    /**
     * Obtiene el carrito activo del usuario
     */
    async getActiveCart() {
        try {
            const response = await axiosInstance.get("/cart");
            return response.data.data;
        }
        catch (error) {
            if (error.response?.status === 404) {
                return null; // No hay carrito activo
            }
            console.error('Error obteniendo carrito:', error);
            throw error;
        }
    }
    /**
     * Obtiene el resumen del carrito con precios y descuentos
     */
    async getCartSummary() {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/summary`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo resumen del carrito:', error);
            throw error;
        }
    }
    /**
     * Agrega un curso al carrito
     */
    async addCourseToCart(courseId) {
        try {
            await axiosInstance.post(`/cart/courses`, { courseId });
        }
        catch (error) {
            console.error('Error agregando curso al carrito:', error);
            throw error;
        }
    }
    /**
     * Elimina un curso del carrito
     */
    async removeCourseFromCart(courseId) {
        try {
            await axiosInstance.delete(`${this.baseUrl}/courses/${courseId}`);
        }
        catch (error) {
            console.error('Error eliminando curso del carrito:', error);
            throw error;
        }
    }
    /**
     * Vacía completamente el carrito
     */
    async clearCart() {
        try {
            await axiosInstance.delete(this.baseUrl);
        }
        catch (error) {
            console.error('Error vaciando carrito:', error);
            throw error;
        }
    }
    /**
     * Crea una preferencia de pago para el carrito
     */
    async createPaymentPreference() {
        try {
            const response = await axiosInstance.post(`${this.baseUrl}/payment`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error creando preferencia de pago:', error);
            throw error;
        }
    }
    /**
     * Cancela el carrito con estado pending del usuario
     */
    async cancelPendingCart() {
        try {
            const response = await axiosInstance.put('/cart/cancel-pending');
            return response.data.data;
        }
        catch (error) {
            console.error('Error cancelando carrito pendiente:', error);
            throw error;
        }
    }
    /**
     * Obtiene el historial de órdenes del usuario
     */
    async getOrders(page = 1, limit = 10) {
        try {
            const response = await axiosInstance.get('/cart/orders', {
                params: { page, limit }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error obteniendo historial de órdenes:', error);
            throw error;
        }
    }
}
export const cartService = new CartService();
