import axiosInstance from '@/shared/api/axios';
class PaymentService {
    baseUrl = '/payments';
    /**
     * Obtiene el historial de pagos del usuario
     */
    async getPaymentHistory() {
        try {
            const response = await axiosInstance.get(`/payments/user`);
            return response.data.data || [];
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
            const response = await axiosInstance.get(`/payments/${paymentId}`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error obteniendo pago:', error);
            throw error;
        }
    }
    async cancelOrder(orderId) {
        try {
            const response = await axiosInstance.delete(`/orders/${orderId}/cancel`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error cancelando orden:', error);
            throw error;
        }
    }
}
export const paymentService = new PaymentService();
