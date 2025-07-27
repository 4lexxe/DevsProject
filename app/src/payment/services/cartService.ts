import axiosInstance from '@/shared/api/axios';

export interface Course {
  id: number;
  title: string;
  description?: string;
  originalPrice: number;
  finalPrice: number;
  discountApplied?: {
    event: string;
    percentage: number;
    amount: number;
  };
}

export interface CartItem {
  cartCourseId: number;
  course: Course;
}

export interface CartSummary {
  id: number;
  status: string;
  courses: CartItem[];
  summary: {
    totalOriginal: number;
    totalWithDiscounts: number;
    totalSavings: number;
    courseCount: number;
  };
}

export interface PaymentPreference {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  cartSummary: CartSummary;
}

class CartService {
  private baseUrl = '/api/cart';

  /**
   * Obtiene el carrito activo del usuario
   */
  async getActiveCart(): Promise<CartSummary | null> {
    try {
      const response = await axiosInstance.get(this.baseUrl);
      return response.data.data;
    } catch (error: any) {
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
  async getCartSummary(): Promise<CartSummary> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/summary`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo resumen del carrito:', error);
      throw error;
    }
  }

  /**
   * Agrega un curso al carrito
   */
  async addCourseToCart(courseId: number): Promise<void> {
    try {
      await axiosInstance.post(`${this.baseUrl}/courses`, { courseId });
    } catch (error) {
      console.error('Error agregando curso al carrito:', error);
      throw error;
    }
  }

  /**
   * Elimina un curso del carrito
   */
  async removeCourseFromCart(courseId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/courses/${courseId}`);
    } catch (error) {
      console.error('Error eliminando curso del carrito:', error);
      throw error;
    }
  }

  /**
   * Vacía completamente el carrito
   */
  async clearCart(): Promise<void> {
    try {
      await axiosInstance.delete(this.baseUrl);
    } catch (error) {
      console.error('Error vaciando carrito:', error);
      throw error;
    }
  }

  /**
   * Crea una preferencia de pago para el carrito
   */
  async createPaymentPreference(): Promise<PaymentPreference> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/payment`);
      return response.data.data;
    } catch (error) {
      console.error('Error creando preferencia de pago:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();
