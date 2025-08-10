import axiosInstance from '@/shared/api/axios';

export interface Course {
  id: number;
  title: string;
  summary?: string;
  image?: string;
  price: number;
  courseDiscount?: {
    id: number;
    event: string;
    value: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
}

export interface CartCourse {
  id: number;
  cartId: number;
  courseId: number;
  unitPrice: string;
  discountValue: number;
  priceWithDiscount: string;
  course: Course;
}

export interface CartBackendResponse {
  id: number;
  userId: number;
  status: string;
  totalPrice: string;
  finalPrice: string;
  discountAmount: string;
  cartCourses: CartCourse[];
}

// Interfaces para compatibilidad con el frontend existente
export interface CourseDisplay {
  id: number;
  title: string;
  description?: string;
  image?: string;
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
  course: CourseDisplay;
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
  private baseUrl = '/cart';

  /**
   * Obtiene el carrito activo del usuario
   */
  async getActiveCart(): Promise<CartSummary | null> {
    try {
      const response = await axiosInstance.get("/cart");
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
  async getCartSummary(): Promise<CartSummary | null> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/summary`);
      const backendData: CartSummary = response.data.data;
      
      if (!backendData) {
        return null;
      }
      
      // El backend ya devuelve los datos transformados
      return backendData;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No hay carrito activo
      }
      console.error('Error obteniendo resumen del carrito:', error);
      throw error;
    }
  }

  /**
   * Agrega un curso al carrito
   */
  async addCourseToCart(courseId: number): Promise<void> {
    try {
      await axiosInstance.post(`/cart/courses`, { courseId });
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

  /**
   * Cancela el carrito con estado pending del usuario
   */
  async cancelPendingCart(): Promise<{ cartId: string, status: string }> {
    try {
      const response = await axiosInstance.put('/cart/cancel-pending');
      return response.data.data;
    } catch (error) {
      console.error('Error cancelando carrito pendiente:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de órdenes del usuario
   */
  async getOrders(page: number = 1, limit: number = 10): Promise<{
    data: Array<{
      id: string;
      status: 'pending' | 'paid' | 'cancelled';
      finalPrice: number;
      totalPrice: number;
      discountAmount: number;
      preferenceId?: string;
      externalReference?: string;
      initPoint?: string;
      createdAt: string;
      updatedAt: string;
      orderCourses: Array<{
        id: string;
        orderId: string;
        courseId: string;
        unitPrice: number;
        discountValue: number;
        priceWithDiscount: number;
        course: {
          id: string;
          title: string;
          image?: string;
          summary?: string;
        };
      }>;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    try {
      const response = await axiosInstance.get('/orders/user', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo historial de órdenes:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();
