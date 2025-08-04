"use client"

import { useEffect, useState } from "react"
import { CreditCard, Calendar, CheckCircle, Clock, XCircle, FileText, ShoppingCart, Target, Wallet, Zap, Building2, Ticket, Smartphone, Info } from "lucide-react"
import { Link, Navigate } from "react-router-dom"
import { cartService } from "../services/cartService"
import { paymentService } from "../services"
import type { Payment } from "../services/paymentService"
import { useAuth } from "@/user/contexts/AuthContext"

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
}

interface Order {
  id: string;
  status: 'pending' | 'paid' | 'cancelled';
  finalPrice: number;
  preferenceId?: string;
  createdAt: string;
  updatedAt: string;
  preference?: {
    id: string;
    preferenceId: string;
    externalReference: string;
    status: string;
    total: number;
    createdAt: string;
    initPoint?: string;
    items?: Array<{
      id: string;
      title: string;
      description: string;
      unit_price: number;
      quantity: number;
    }>;
    payments?: PaymentInfo[];
  };
  courses: Array<{
    cartCourseId: string;
    course: {
      id: string;
      title: string;
      description: string;
      originalPrice: number;
      finalPrice: number;
      discountApplied?: {
        id: string;
        event: string;
        percentage: number;
        amount: number;
      };
    };
  }>;
  summary: {
    totalOriginal: number;
    totalWithDiscounts: number;
    totalSavings: number;
    courseCount: number;
  };
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

  // Función mejorada para obtener el nombre del método de pago según MercadoPago API
  const getPaymentMethodName = (paymentMethodId: string, paymentTypeId: string) => {
    // Métodos de pago específicos de MercadoPago
    const methods: { [key: string]: string } = {
      // Tarjetas de crédito
      visa: "Visa",
      master: "Mastercard", 
      amex: "American Express",
      elo: "Elo",
      hipercard: "Hipercard",
      diners: "Diners Club",
      cabal: "Cabal",
      argencard: "Argencard",
      naranja: "Naranja",
      shopping: "Shopping",
      cencosud: "Cencosud",
      cordobesa: "Cordobesa",
      tarjeta_ml: "Tarjeta MercadoLibre",
      
      // Dinero en cuenta
      account_money: "Dinero en cuenta MercadoPago",
      
      // Débito inmediato
      debin: "Débito inmediato (DEBIN)",
      
      // PSE (Colombia)
      pse: "PSE",
      
      // PIX (Brasil)
      pix: "PIX",
      
      // Efectivo
      pagofacil: "Pago Fácil",
      rapipago: "Rapipago",
      bapropagos: "Bapro Pagos",
      cobro_express: "Cobro Express",
      redlink: "Red Link",
      
      // Transferencia bancaria
      banco_frances: "Banco Francés",
      banco_galicia: "Banco Galicia",
      banco_santander: "Banco Santander",
      banco_ciudad: "Banco Ciudad",
      banco_macro: "Banco Macro",
      banco_nacion: "Banco Nación",
      banco_supervielle: "Banco Supervielle",
      banco_comafi: "Banco Comafi",
      banco_patagonia: "Banco Patagonia",
      
      // Wallets digitales
      mercadopago_wallet: "MercadoPago Wallet",
      moyap: "Moyap",
      
      // Otros
      webpay: "Webpay",
      khipu: "Khipu",
      payu: "PayU",
    }

    // Tipos de pago
    const types: { [key: string]: string } = {
      credit_card: "Tarjeta de Crédito",
      debit_card: "Tarjeta de Débito", 
      prepaid_card: "Tarjeta Prepaga",
      account_money: "Dinero en Cuenta",
      bank_transfer: "Transferencia Bancaria",
      ticket: "Efectivo",
      digital_wallet: "Billetera Digital",
      crypto_transfer: "Criptomonedas",
      voucher_card: "Vale",
      digital_currency: "Moneda Digital",
      pse: "PSE - Pagos Seguros en Línea",
      pix: "PIX - Transferencia Instantánea"
    }

    const method = methods[paymentMethodId?.toLowerCase()] || paymentMethodId || 'Método desconocido'
    const type = types[paymentTypeId?.toLowerCase()] || paymentTypeId || 'Tipo desconocido'

    // Si es dinero en cuenta, solo mostrar eso
    if (paymentMethodId?.toLowerCase() === 'account_money' || paymentTypeId?.toLowerCase() === 'account_money') {
      return (
        <span className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Dinero en cuenta MercadoPago
        </span>
      )
    }

    // Si es PIX, solo mostrar eso
    if (paymentMethodId?.toLowerCase() === 'pix' || paymentTypeId?.toLowerCase() === 'pix') {
      return (
        <span className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          PIX - Transferencia Instantánea
        </span>
      )
    }

    // Si es DEBIN, solo mostrar eso
    if (paymentMethodId?.toLowerCase() === 'debin') {
      return (
        <span className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Débito inmediato (DEBIN)
        </span>
      )
    }

    // Para tarjetas, mostrar tipo + método
    if (paymentTypeId?.toLowerCase().includes('card')) {
      return (
        <span className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {type} {method}
        </span>
      )
    }

    // Para efectivo
    if (paymentTypeId?.toLowerCase() === 'ticket') {
      return (
        <span className="flex items-center gap-2">
          <Ticket className="h-4 w-4" />
          {method}
        </span>
      )
    }

    // Para transferencias bancarias
    if (paymentTypeId?.toLowerCase() === 'bank_transfer') {
      return (
        <span className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {method}
        </span>
      )
    }

    // Para wallets digitales
    if (paymentTypeId?.toLowerCase() === 'digital_wallet') {
      return (
        <span className="flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          {method}
        </span>
      )
    }

    // Default: mostrar tipo y método
    return (
      <span className="flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        {type} - {method}
      </span>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return { backgroundColor: "#42d7c7", color: "#0c154c" }
      case "active":
        return { backgroundColor: "#02ffff", color: "#0c154c" }
      case "pending":
        return { backgroundColor: "#fbbf24", color: "#0c154c" }
      case "cancelled":
      case "rejected":
        return { backgroundColor: "#ef4444", color: "white" }
      default:
        return { backgroundColor: "#6b7280", color: "white" }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "approved":
        return "Aprobado"
      case "active":
        return "Activo"
      case "pending":
        return "Pendiente de Pago"
      case "cancelled":
        return "Cancelado"
      case "rejected":
        return "Rechazado"
      default:
        return "Desconocido"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrder(orderId)
      await cartService.cancelPendingCart()
      // Recargar las órdenes para reflejar el cambio
      await loadOrders()
    } catch (error) {
      console.error('Error cancelling order:', error)
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
        <div className="mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm" style={{ border: "2px solid #42d7c7" }}>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={activeTab === 'orders' ? { backgroundColor: "#42d7c7" } : {}}
            >
              <span className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Mis Órdenes
              </span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === 'payments'
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={activeTab === 'payments' ? { backgroundColor: "#42d7c7" } : {}}
            >
              <span className="flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                Mis Pagos
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'orders' ? (
          /* Orders Section */
          <div className="space-y-6">
            {sortedOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <FileText className="h-16 w-16 mx-auto text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "#0c154c" }}>
                  No tienes órdenes aún
                </h2>
                <p className="text-gray-600">Cuando realices tu primera compra, aparecerá aquí</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors mt-4"
                  style={{ backgroundColor: "#1d4ed8" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e40af"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                >
                  Explorar Cursos
                </Link>
              </div>
            ) : (
              sortedOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{ borderColor: "#42d7c7", backgroundColor: "white" }}
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: "#0c154c" }}>
                          Orden #{order.id}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingCart className="h-4 w-4" />
                            {order.courses.length} {order.courses.length === 1 ? "curso" : "cursos"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                        <div className="text-2xl font-bold" style={{ color: "#1d4ed8" }}>
                          {formatCurrency(order.finalPrice)}
                        </div>
                        <div
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                          style={getStatusColor(order.status)}
                        >
                          <span className="mr-2">{getStatusIcon(order.status)}</span>
                          {getStatusText(order.status)}
                        </div>
                      </div>
                    </div>

                    {/* Courses List */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3" style={{ color: "#0c154c" }}>
                        Cursos incluidos:
                      </h4>
                      <div className="space-y-3">
                        {order.courses.map((courseItem, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-4 rounded-lg"
                            style={{ backgroundColor: "#eff6ff" }}
                          >
                            <div className="flex-1">
                              <div className="font-medium" style={{ color: "#0c154c" }}>
                                {courseItem.course.title}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">{courseItem.course.description}</div>
                              {courseItem.course.discountApplied && (
                                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  Descuento: {courseItem.course.discountApplied.percentage}% 
                                  ({courseItem.course.discountApplied.event})
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end ml-4">
                              {courseItem.course.discountApplied && (
                                <div className="text-sm text-gray-500 line-through">
                                  {formatCurrency(courseItem.course.originalPrice)}
                                </div>
                              )}
                              <div className="font-bold text-lg" style={{ color: "#1d4ed8" }}>
                                {formatCurrency(courseItem.course.finalPrice)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    {order.summary.totalSavings > 0 && (
                      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#f0fdf4" }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-600">Resumen del pedido</div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">
                                Precio original: {formatCurrency(order.summary.totalOriginal)}
                              </span>
                              <span className="text-sm text-green-600 font-medium">
                                Descuento: -{formatCurrency(order.summary.totalSavings)}
                              </span>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            ¡Ahorraste {formatCurrency(order.summary.totalSavings)}!
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {order.status === "pending" && order.preference?.initPoint && (
                        <>
                          <button
                            onClick={() => handlePayment(order.preference?.initPoint)}
                            className="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:opacity-90"
                            style={{ backgroundColor: "#42d7c7" }}
                          >
                            <span className="flex items-center justify-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Completar Pago
                            </span>
                          </button>
                          
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrder === order.id}
                            className="px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ borderColor: "#ef4444", color: "#ef4444", backgroundColor: "white" }}
                          >
                            <span className="flex items-center justify-center gap-2">
                              {cancellingOrder === order.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                  Cancelando...
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4" />
                                  Cancelar Orden
                                </>
                              )}
                            </span>
                          </button>
                        </>
                      )}

                      {order.status === "paid" && order.preference?.payments && order.preference.payments.length > 0 && (
                        <button
                          onClick={() => showPaymentInfo(order.preference!.payments![0])}
                          className="px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-300 hover:opacity-80"
                          style={{ borderColor: "#1d4ed8", color: "#1d4ed8", backgroundColor: "white" }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <Info className="h-4 w-4" />
                            Ver Información del Pago
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Payments Section */
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <CreditCard className="h-16 w-16 mx-auto text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "#0c154c" }}>
                  No tienes pagos registrados
                </h2>
                <p className="text-gray-600">Cuando realices tu primera compra, aparecerá aquí</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors mt-4"
                  style={{ backgroundColor: "#1d4ed8" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e40af"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                >
                  Explorar Cursos
                </Link>
              </div>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="border-2 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md"
                  style={{ borderColor: "#42d7c7" }}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <div className="p-2 rounded-full" style={{ backgroundColor: "#e0f2fe" }}>
                          <CreditCard className="h-5 w-5" style={{ color: "#1d4ed8" }} />
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: "#0c154c" }}>
                            Pago #{payment.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ID: {payment.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                          style={getStatusColor(payment.status)}
                        >
                          <span className="mr-1">{getStatusIcon(payment.status)}</span>
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                    </div>

                    <hr className="mb-4 border-gray-200" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Monto</div>
                        <div className="font-semibold text-lg" style={{ color: "#1d4ed8" }}>
                          {formatCurrency(payment.transactionAmount)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-1">Fecha</div>
                        <div className="flex items-center gap-2" style={{ color: "#0c154c" }}>
                          <Calendar className="h-4 w-4" />
                          {payment.dateApproved ? formatDateTime(payment.dateApproved) : 'N/A'}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-1">Método de Pago</div>
                        <div className="font-medium" style={{ color: "#0c154c" }}>
                          {getPaymentMethodName(payment.paymentMethodId || '', payment.paymentTypeId || '')}
                        </div>
                      </div>
                    </div>

                    {payment.items && payment.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-2">Items comprados:</div>
                        <div className="flex flex-wrap gap-2">
                          {payment.items.map((item, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 rounded-full text-xs"
                              style={{
                                backgroundColor: "#e0f2fe",
                                color: "#1d4ed8",
                                border: "1px solid #bae6fd"
                              }}
                            >
                              {item.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Payment Info Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              style={{ border: `2px solid #42d7c7` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold" style={{ color: "#0c154c" }}>
                    Información del Pago
                  </h3>
                  <button onClick={closePaymentInfo} className="text-gray-500 hover:text-gray-700 text-2xl">
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
                    <div className="text-center">
                      <div className="mb-2">
                        <CheckCircle className="h-10 w-10 mx-auto text-green-500" />
                      </div>
                      <div className="font-bold text-lg" style={{ color: "#42d7c7" }}>
                        Pago Aprobado
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">ID de Pago</div>
                      <div className="font-mono text-sm" style={{ color: "#1d4ed8" }}>
                        {selectedPayment.id}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Método de Pago</div>
                      <div className="font-medium" style={{ color: "#0c154c" }}>
                        {getPaymentMethodName(selectedPayment.paymentMethodId, selectedPayment.paymentTypeId)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Fecha y Hora del Pago</div>
                      <div className="font-medium" style={{ color: "#0c154c" }}>
                        {formatDateTime(selectedPayment.dateApproved)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Monto</div>
                      <div className="font-bold text-lg" style={{ color: "#1d4ed8" }}>
                        {formatCurrency(selectedPayment.transactionAmount)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Estado</div>
                      <div className="font-medium" style={{ color: "#42d7c7" }}>
                        {selectedPayment.status === "approved" ? "Aprobado" : selectedPayment.status}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Comprador</div>
                      <div className="font-medium" style={{ color: "#0c154c" }}>
                        {selectedPayment.payer.first_name && selectedPayment.payer.last_name
                          ? `${selectedPayment.payer.first_name} ${selectedPayment.payer.last_name}`
                          : selectedPayment.payer.email}
                      </div>
                      <div className="text-sm text-gray-500">{selectedPayment.payer.email}</div>
                      {selectedPayment.payer.identification && (
                        <div className="text-sm text-gray-500">
                          {selectedPayment.payer.identification.type}: {selectedPayment.payer.identification.number}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: "#e5e7eb" }}>
                    <button
                      onClick={closePaymentInfo}
                      className="w-full px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:opacity-90"
                      style={{ backgroundColor: "#1d4ed8" }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
