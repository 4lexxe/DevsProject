"use client"

import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { cartService } from "../services/cartService"
import { paymentService } from "../services"
import type { Payment } from "../services/paymentService"
import { useAuth } from "@/user/contexts/AuthContext"
import axiosInstance from "@/shared/api/axios"
import { 
  OrderCard, 
  PaymentCard, 
  PaymentInfoModal, 
  TabNavigation, 
  EmptyState 
} from "../components/MyOrders"

// Define types based on our backend response
interface PaymentInfo {
  id: string;
  status: string;
  dateApproved: string;
  transactionAmount: number;
  paymentMethodId: string;
  paymentTypeId: string;
  payer: {
    first_name?: string;
    last_name?: string;
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  items?: Array<{
    id: string;
    title: string;
    unit_price: number;
    description: string;
  }>;
}

interface Order {
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
  expirationDateFrom?: string;
  expirationDateTo?: string;
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
  payments?: PaymentInfo[];
}

export default function MyOrdersAndPayments() {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'orders' | 'payments'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [selectedPayment, setSelectedPayment] = useState<PaymentInfo | null>(null)
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      if (activeTab === 'orders') {
        loadOrders()
      } else {
        loadPayments()
      }
    }
  }, [activeTab, user])

  const loadOrders = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await cartService.getOrders(page, 10)
      setOrders(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError('Error al cargar las órdenes')
      console.error('Error loading orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadPayments = async () => {
    try {
      setLoading(true)
      const paymentsData = await paymentService.getPaymentHistory()
      setPayments(paymentsData)
    } catch (err) {
      setError('Error al cargar los pagos')
      console.error('Error loading payments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = (initPoint?: string) => {
    if (initPoint) {
      window.open(initPoint, "_blank")
    }
  }

  const showPaymentInfo = (payment: PaymentInfo) => {
    setSelectedPayment(payment)
  }

  const closePaymentInfo = () => {
    setSelectedPayment(null)
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrder(orderId)
      await axiosInstance.put(`/orders/${orderId}/cancel`)
      await loadOrders()
    } catch (error) {
      console.error('Error cancelando orden:', error)
      setError('Error al cancelar la orden')
    } finally {
      setCancellingOrder(null)
    }
  }

  // Ordenar por fecha más reciente primero
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Verificaciones condicionales después de todos los hooks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">
            Cargando {activeTab === 'orders' ? 'órdenes' : 'pagos'}...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => activeTab === 'orders' ? loadOrders() : loadPayments()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eff6ff" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#0c154c" }}>
            Mis Compras
          </h1>
          <p className="text-gray-600">Historial completo de tus órdenes y pagos</p>
        </div>

        {/* Tabs */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Content */}
        {activeTab === 'orders' ? (
          /* Orders Section */
          <div className="space-y-6">
            {sortedOrders.length === 0 ? (
              <EmptyState type="orders" />
            ) : (
              sortedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPayment={handlePayment}
                  onCancel={handleCancelOrder}
                  cancellingOrder={cancellingOrder}
                />
              ))
            )}
          </div>
        ) : (
          /* Payments Section */
          <div className="space-y-4">
            {payments.length === 0 ? (
              <EmptyState type="payments" />
            ) : (
              payments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment as PaymentInfo}
                />
              ))
            )}
          </div>
        )}

        {/* Payment Info Modal */}
        <PaymentInfoModal
          payment={selectedPayment}
          isOpen={!!selectedPayment}
          onClose={closePaymentInfo}
        />
      </div>
    </div>
  )
}
