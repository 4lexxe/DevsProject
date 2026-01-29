import React from 'react';
import { motion } from 'framer-motion';
import FontelloIcon from '@/shared/components/icons/FontelloIcon';
import { Link } from 'react-router-dom';

interface OrderCourse {
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
}

interface Order {
  id: string;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
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
  expired?: boolean;
  orderCourses: OrderCourse[];
}

interface OrderCardProps {
  order: Order;
  onPayment: (initPoint?: string) => void;
  onCancel: (orderId: string) => void;
  cancellingOrder: string | null;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPayment, onCancel, cancellingOrder }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const isOrderExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  const getTimeRemaining = (expirationDate?: string) => {
    if (!expirationDate) return null;
    
    const now = new Date();
    const expiration = new Date(expirationDate);
    const diff = expiration.getTime() - now.getTime();
    
    if (diff <= 0) return "Expirada";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} día${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m restantes`;
    } else {
      return `${minutes}m restantes`;
    }
  };

  const getStatusConfig = (status: string, expired?: boolean) => {
    if (expired || status === "expired") {
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: 'icon-clock',
        iconBg: 'bg-orange-200'
      };
    }
    
    switch (status) {
      case "paid":
        return {
          bg: 'bg-green-50',
          border: 'border-green-300',
          text: 'text-green-700',
          badge: 'bg-green-100 text-green-700 border-green-300',
          icon: 'icon-ok',
          iconBg: 'bg-green-200'
        };
      case "pending":
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
          icon: 'icon-clock',
          iconBg: 'bg-yellow-200'
        };
      case "cancelled":
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-700 border-red-300',
          icon: 'icon-cancel',
          iconBg: 'bg-red-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-700 border-gray-300',
          icon: 'icon-help',
          iconBg: 'bg-gray-200'
        };
    }
  };

  const getStatusText = (status: string, expired?: boolean) => {
    if (expired || status === "expired") return "Expirada";
    switch (status) {
      case "paid": return "Pagado";
      case "pending": return "Pendiente";
      case "cancelled": return "Cancelado";
      default: return "Desconocido";
    }
  };

  const orderExpired = order.expired || isOrderExpired(order.expirationDateTo) || order.status === "expired";
  const timeRemaining = getTimeRemaining(order.expirationDateTo);
  const isUrgent = timeRemaining && (timeRemaining.includes('h') || timeRemaining.includes('m')) && !timeRemaining.includes('día');
  const statusConfig = getStatusConfig(order.status, orderExpired);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-2xl border-2 ${statusConfig.border} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      {/* Alerta de expiración */}
      {order.status === 'pending' && order.expirationDateTo && (
        <>
          {orderExpired ? (
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FontelloIcon 
                  name="icon-attention" 
                  className="text-xl"
                  fallback={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">Orden Expirada</div>
                <div className="text-sm opacity-90">Expirada el {formatDateTime(order.expirationDateTo)}</div>
              </div>
            </div>
          ) : (
            isUrgent && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <FontelloIcon 
                    name="icon-clock" 
                    className="text-xl"
                    fallback={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">¡Tiempo limitado!</div>
                  <div className="text-sm opacity-90">Esta orden expira en {timeRemaining}</div>
                </div>
              </div>
            )
          )}
        </>
      )}

      <div className="p-6 sm:p-8">
        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 ${statusConfig.iconBg} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                <FontelloIcon 
                  name="icon-doc-text" 
                  className="text-3xl text-gray-700"
                  fallback={
                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
                  Orden #{order.id.slice(-8)}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-light">
                  <span className="flex items-center gap-2">
                    <FontelloIcon 
                      name="icon-calendar" 
                      className="text-base"
                      fallback={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                    {formatDate(order.createdAt)}
                  </span>
                  {order.expirationDateTo && order.status === 'pending' && (
                    <span className={`flex items-center gap-2 ${orderExpired ? 'text-red-600' : 'text-orange-600'}`}>
                      <FontelloIcon 
                        name="icon-clock" 
                        className="text-base"
                        fallback={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      />
                      {orderExpired ? 'Expirada' : timeRemaining}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <FontelloIcon 
                      name="icon-book" 
                      className="text-base"
                      fallback={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      }
                    />
                    {order.orderCourses.length} {order.orderCourses.length === 1 ? "curso" : "cursos"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 mt-4 md:mt-0">
            <div className="text-4xl font-light text-gray-900">
              {formatCurrency(order.finalPrice)}
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light border-2 ${statusConfig.badge}`}>
              <div className={`w-2 h-2 rounded-full ${statusConfig.iconBg.replace('bg-', 'bg-').replace('-200', '-500')}`}></div>
              <FontelloIcon 
                name={statusConfig.icon} 
                className="text-sm"
                fallback={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              {getStatusText(order.status, orderExpired)}
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FontelloIcon 
              name="icon-list" 
              className="text-lg text-gray-600"
              fallback={
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              }
            />
            <h4 className="font-light text-gray-900 text-sm uppercase tracking-wide">
              Cursos incluidos
            </h4>
          </div>
          <div className="space-y-3">
            {order.orderCourses.map((orderCourse, index) => (
              <Link
                key={index}
                to={`/course/${orderCourse.course.id}`}
                className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
              >
                {orderCourse.course.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <img
                      src={orderCourse.course.image}
                      alt={orderCourse.course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-light text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                    {orderCourse.course.title}
                  </div>
                  {orderCourse.course.summary && (
                    <div className="text-sm text-gray-500 font-light line-clamp-1">
                      {orderCourse.course.summary}
                    </div>
                  )}
                  {orderCourse.discountValue > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-light border border-gray-200">
                      <FontelloIcon 
                        name="icon-tag" 
                        className="text-xs"
                        fallback={
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        }
                      />
                      {orderCourse.discountValue}% de descuento
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end justify-center ml-4 flex-shrink-0">
                  {orderCourse.discountValue > 0 && (
                    <div className="text-sm text-gray-400 line-through font-light mb-1">
                      {formatCurrency(orderCourse.unitPrice)}
                    </div>
                  )}
                  <div className="font-light text-lg text-gray-900">
                    {formatCurrency(orderCourse.priceWithDiscount)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        {order.discountAmount > 0 && (
          <div className="mb-6 p-5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <FontelloIcon 
                    name="icon-gift" 
                    className="text-2xl text-gray-600"
                    fallback={
                      <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    }
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-light mb-1">Ahorro total</div>
                  <div className="text-xl font-light text-gray-900">
                    {formatCurrency(order.discountAmount)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 font-light">Precio original</div>
                <div className="text-lg text-gray-700 font-light line-through">
                  {formatCurrency(order.totalPrice)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          {order.status === "pending" && order.initPoint && !orderExpired && (
            <>
              <button
                onClick={() => onPayment(order.initPoint)}
                className="flex-1 px-6 py-4 bg-gray-900 text-white font-light rounded-xl transition-all duration-300 hover:bg-gray-800 hover:shadow-lg flex items-center justify-center gap-3 group"
              >
                <FontelloIcon 
                  name="icon-credit-card" 
                  className="text-xl group-hover:scale-110 transition-transform"
                  fallback={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  }
                />
                <span>Completar Pago</span>
                <FontelloIcon 
                  name="icon-right-open" 
                  className="text-base group-hover:translate-x-1 transition-transform"
                  fallback={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  }
                />
              </button>
              
              <button
                onClick={() => onCancel(order.id)}
                disabled={cancellingOrder === order.id}
                className="px-6 py-4 font-light rounded-xl border-2 border-gray-300 text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancellingOrder === order.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                    Cancelando...
                  </>
                ) : (
                  <>
                    <FontelloIcon 
                      name="icon-cancel" 
                      className="text-base"
                      fallback={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      }
                    />
                    Cancelar Orden
                  </>
                )}
              </button>
            </>
          )}
          
          {order.status === "pending" && orderExpired && (
            <button
              onClick={() => onCancel(order.id)}
              disabled={cancellingOrder === order.id}
              className="w-full px-6 py-4 font-light rounded-xl border-2 border-gray-300 text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {cancellingOrder === order.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                  Cancelando...
                </>
              ) : (
                <>
                  <FontelloIcon 
                    name="icon-trash" 
                    className="text-base"
                    fallback={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                  />
                  Eliminar Orden Expirada
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
