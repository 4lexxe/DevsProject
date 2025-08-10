import axiosInstance from '@/shared/api/axios';

export interface Payment {
  id: string;
  status: string;
  transactionAmount: number;
  transactionId: string;
  dateApproved?: string;
  paymentMethodId?: string;
  paymentTypeId?: string;
  payer?: any; // Datos del pagador
  items?: {
    id: string;
    title: string;
    unit_price: string;
    description: string;
  }[]; // Items del pago
  data: Object;
}

class PaymentService {
  private baseUrl = '/payments';

  /**
   * Obtiene el historial de pagos del usuario
   */
  async getPaymentHistory(): Promise<Payment[]> {
    try {
      const response = await axiosInstance.get(`/payments/user`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo historial de pagos:', error);
      throw error;
    }
  }

  /**
   * Obtiene un pago específico por ID
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    try {
      const response = await axiosInstance.get(`/payments/${paymentId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<Payment> {
    try {
      const response = await axiosInstance.delete(`/orders/${orderId}/cancel`);
      return response.data.data;
    } catch (error) {
      console.error('Error cancelando orden:', error);
      throw error;
    }
  }

}

export const paymentService = new PaymentService();
