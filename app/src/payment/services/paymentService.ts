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
      const response = await axiosInstance.get(`${this.baseUrl}`);
      return response.data.data;
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
      const response = await axiosInstance.get(`${this.baseUrl}/${paymentId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los pagos (con paginación)
   */
  async getAllPayments(page: number = 1, limit: number = 10): Promise<{ items: Payment[], total: number }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
