import axiosInstance from '@/shared/api/axios';

export interface Payment {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  courses: string[];
  paymentMethod: string;
  transactionId: string;
  dateApproved?: string;
  paymentMethodId?: string;
  paymentTypeId?: string;
}

export interface PaymentStats {
  totalTransactions: number;
  completedPayments: number;
  totalSpent: number;
}

class PaymentService {
  private baseUrl = '/api/payments';

  /**
   * Obtiene el historial de pagos del usuario
   */
  async getPaymentHistory(): Promise<Payment[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/history`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo historial de pagos:', error);
      throw error;
    }
  }

  /**
   * Obtiene los pagos del usuario actual
   */
  async getUserPayments(): Promise<Payment[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/user`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo pagos del usuario:', error);
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
   * Obtiene estadísticas de pagos del usuario
   */
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de pagos:', error);
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
