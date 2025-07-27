"use client"

import { useEffect, useState } from "react"
import { CreditCard, Calendar, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { paymentService } from "../services"
import type { Payment, PaymentStats } from "../services/paymentService"

export default function MyPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats>({
    totalTransactions: 0,
    completedPayments: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPaymentsAndStats = async () => {
      try {
        setLoading(true)
        const [paymentsData, statsData] = await Promise.all([
          paymentService.getPaymentHistory(),
          paymentService.getPaymentStats()
        ])
        setPayments(paymentsData)
        setStats(statsData)
      } catch (err) {
        setError('Error al cargar los pagos')
        console.error('Error loading payments:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPaymentsAndStats()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'pending':
        return 'Pendiente'
      case 'failed':
        return 'Fallido'
      default:
        return 'Desconocido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
          border: '1px solid #bbf7d0'
        }
      case 'pending':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          border: '1px solid #fde68a'
        }
      case 'failed':
        return {
          backgroundColor: '#fecaca',
          color: '#991b1b',
          border: '1px solid #fca5a5'
        }
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db'
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando pagos...</p>
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
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pagos</h1>
          <p className="text-gray-600">Historial completo de tus transacciones</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border-2 rounded-lg shadow-sm bg-white" style={{ borderColor: "#42d7c7" }}>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#1d4ed8" }}>
                {stats.totalTransactions}
              </div>
              <div className="text-sm text-gray-600">Total Pagos</div>
            </div>
          </div>

          <div className="border-2 rounded-lg shadow-sm bg-white" style={{ borderColor: "#42d7c7" }}>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#16a34a" }}>
                {stats.completedPayments}
              </div>
              <div className="text-sm text-gray-600">Completados</div>
            </div>
          </div>

          <div className="border-2 rounded-lg shadow-sm bg-white" style={{ borderColor: "#42d7c7" }}>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#1d4ed8" }}>
                {formatCurrency(stats.totalSpent)}
              </div>
              <div className="text-sm text-gray-600">Monto Total</div>
            </div>
          </div>
        </div>

        {/* Lista de Pagos */}
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="border-2 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-lg"
              style={{ borderColor: "#42d7c7" }}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <div className="p-2 rounded-full" style={{ backgroundColor: "#e0f2fe" }}>
                      <CreditCard className="h-5 w-5" style={{ color: "#1d4ed8" }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Pago #{payment.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Transacción #{payment.transactionId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                      style={getStatusColor(payment.status)}
                    >
                      {getStatusIcon(payment.status)}
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                </div>

                <hr className="mb-4 border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Monto</div>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Fecha</div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {formatDate(payment.date)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Método</div>
                    <div className="text-gray-900">
                      {payment.paymentMethod || 'Tarjeta de crédito'}
                    </div>
                  </div>
                </div>

                {payment.courses && payment.courses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Cursos comprados:</div>
                    <div className="flex flex-wrap gap-2">
                      {payment.courses.map((courseId, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: "#e0f2fe",
                            color: "#1d4ed8",
                            border: "1px solid #bae6fd"
                          }}
                        >
                          Curso {courseId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {payments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes pagos registrados
            </h3>
            <p className="text-gray-600 mb-4">
              Cuando realices tu primera compra, aparecerá aquí
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors"
              style={{ backgroundColor: "#1d4ed8" }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e40af"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            >
              Explorar Cursos
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
