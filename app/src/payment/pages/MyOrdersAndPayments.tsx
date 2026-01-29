"use client"

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { motion } from "framer-motion"
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
import WaveDivider from "@/shared/components/WaveDivider"
import FontelloIcon from "@/shared/components/icons/FontelloIcon"

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

  // Calcular estadísticas
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const paidOrders = orders.filter(o => o.status === 'paid').length
  const totalSpent = payments.reduce((sum, p) => sum + (p.transactionAmount || 0), 0)

  // Verificaciones condicionales después de todos los hooks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-light">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-light">
            Cargando {activeTab === 'orders' ? 'órdenes' : 'pagos'}...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <FontelloIcon 
              name="icon-attention" 
              className="text-3xl text-red-600"
              fallback={
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
          </div>
          <p className="text-red-600 mb-6 font-light">{error}</p>
          <button 
            onClick={() => activeTab === 'orders' ? loadOrders() : loadPayments()}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-light hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
          >
            <FontelloIcon 
              name="icon-arrows-cw" 
              className="text-base"
              fallback={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            />
            Reintentar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Wave divider superior */}
      <WaveDivider position="top" color="#ffffff" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
              <FontelloIcon 
                name="icon-basket" 
                className="text-3xl text-gray-700"
                fallback={
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
            </div>
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-light text-gray-900 mb-2 tracking-tight">
                Mis Compras
              </h1>
              <p className="text-gray-500 font-light">Gestiona tus órdenes y pagos</p>
            </div>
          </div>

          {/* Estadísticas */}
          {activeTab === 'orders' && totalOrders > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FontelloIcon 
                      name="icon-doc-text" 
                      className="text-xl text-gray-600"
                      fallback={
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      }
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-light text-gray-900">{totalOrders}</div>
                    <div className="text-xs text-gray-500 font-light">Total</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FontelloIcon 
                      name="icon-clock" 
                      className="text-xl text-gray-600"
                      fallback={
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-light text-gray-900">{pendingOrders}</div>
                    <div className="text-xs text-gray-500 font-light">Pendientes</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FontelloIcon 
                      name="icon-ok" 
                      className="text-xl text-gray-600"
                      fallback={
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-light text-gray-900">{paidOrders}</div>
                    <div className="text-xs text-gray-500 font-light">Pagadas</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FontelloIcon 
                      name="icon-money" 
                      className="text-xl text-gray-600"
                      fallback={
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-4c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
                  </div>
                  <div>
                    <div className="text-lg font-light text-gray-900">
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalSpent)}
                    </div>
                    <div className="text-xs text-gray-500 font-light">Total gastado</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Content */}
        {activeTab === 'orders' ? (
          <div className="space-y-6">
            {sortedOrders.length === 0 ? (
              <EmptyState type="orders" />
            ) : (
              sortedOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderCard
                    order={order}
                    onPayment={handlePayment}
                    onCancel={handleCancelOrder}
                    cancellingOrder={cancellingOrder}
                  />
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {payments.length === 0 ? (
              <EmptyState type="payments" />
            ) : (
              payments.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PaymentCard
                    payment={payment as PaymentInfo}
                  />
                </motion.div>
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

      {/* Wave divider inferior */}
      <WaveDivider position="bottom" color="#ffffff" />
    </div>
  )
}
