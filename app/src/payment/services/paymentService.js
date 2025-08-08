import axiosInstance from '@/shared/api/axios';
class PaymentService {
    baseUrl = '/payments';
    /**
     * Obtiene el historial de pagos del usuario
     */
    async getPaymentHistory() {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo historial de pagos:', error);
            throw error;
        }
    }
    /**
     * Obtiene un pago específico por ID
     */
    async getPaymentById(paymentId) {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/${paymentId}`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo pago:', error);
            throw error;
        }
    }
    /**
     * Obtiene todos los pagos (con paginación)
     */
    async getAllPayments(page = 1, limit = 10) {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo pagos:', error);
            throw error;
        }
    }
}
export const paymentService = new PaymentService();
