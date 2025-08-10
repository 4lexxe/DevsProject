import React from 'react';
import { Calendar, ShoppingCart, CheckCircle, Clock, XCircle, CreditCard, Target } from 'lucide-react';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return { backgroundColor: "#42d7c7", color: "#0c154c" };
      case "active":
        return { backgroundColor: "#02ffff", color: "#0c154c" };
      case "pending":
        return { backgroundColor: "#fbbf24", color: "#0c154c" };
      case "cancelled":
      case "rejected":
        return { backgroundColor: "#ef4444", color: "white" };
      default:
        return { backgroundColor: "#6b7280", color: "white" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado";
      case "approved":
        return "Aprobado";
      case "active":
        return "Activo";
      case "pending":
        return "Pendiente de Pago";
      case "cancelled":
        return "Cancelado";
      case "rejected":
        return "Rechazado";
      default:
        return "Desconocido";
    }
  };

  const expired = isOrderExpired(order.expirationDateTo);
  const timeRemaining = getTimeRemaining(order.expirationDateTo);
  const isUrgent = timeRemaining && (timeRemaining.includes('h') || timeRemaining.includes('m')) && !timeRemaining.includes('día');

  return (
    <div
      className={`border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
        order.status === 'pending' && expired ? 'border-red-300 bg-red-50' : ''
      }`}
      style={{ 
        borderColor: order.status === 'pending' && expired ? "#fca5a5" : "#42d7c7", 
        backgroundColor: order.status === 'pending' && expired ? "#fef2f2" : "white" 
      }}
    >
      {/* Alerta de expiración */}
      {order.status === 'pending' && order.expirationDateTo && (
        <>
          {expired ? (
            <div className="bg-red-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Esta orden ha expirado el {formatDateTime(order.expirationDateTo)}
            </div>
          ) : (
            isUrgent && (
              <div className="bg-orange-500 text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                ⚠️ Esta orden expira en {timeRemaining} - ¡Completa tu pago pronto!
              </div>
            )
          )}
        </>
      )}

      <div className="p-6">
        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#0c154c" }}>
              Orden #{order.id}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Creada: {formatDate(order.createdAt)}
              </span>
              {order.expirationDateTo && order.status === 'pending' && (
                <span className={`flex items-center gap-1 ${expired ? 'text-red-600' : 'text-orange-600'}`}>
                  <Clock className="h-4 w-4" />
                  {expired ? (
                    <span className="font-medium">Expirada el {formatDateTime(order.expirationDateTo)}</span>
                  ) : (
                    <span>Expira: {getTimeRemaining(order.expirationDateTo)}</span>
                  )}
                </span>
              )}
              <span className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                {order.orderCourses.length} {order.orderCourses.length === 1 ? "curso" : "cursos"}
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
            {order.orderCourses.map((orderCourse, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 rounded-lg"
                style={{ backgroundColor: "#eff6ff" }}
              >
                <div className="flex-1">
                  <div className="font-medium" style={{ color: "#0c154c" }}>
                    {orderCourse.course.title}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{orderCourse.course.summary}</div>
                  {orderCourse.discountValue > 0 && (
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Descuento: {orderCourse.discountValue}%
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end ml-4">
                  {orderCourse.discountValue > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatCurrency(orderCourse.unitPrice)}
                    </div>
                  )}
                  <div className="font-bold text-lg" style={{ color: "#1d4ed8" }}>
                    {formatCurrency(orderCourse.priceWithDiscount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        {order.discountAmount > 0 && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#f0fdf4" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Resumen del pedido</div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-500">
                    Precio original: {formatCurrency(order.totalPrice)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Descuento: -{formatCurrency(order.discountAmount)}
                  </span>
                </div>
              </div>
              <div className="text-lg font-bold text-green-600">
                ¡Ahorraste {formatCurrency(order.discountAmount)}!
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {order.status === "pending" && order.initPoint && (
            <>
              <button
                onClick={() => onPayment(order.initPoint)}
                disabled={expired}
                className={`flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
                  expired 
                    ? 'opacity-50 cursor-not-allowed bg-gray-400' 
                    : 'hover:opacity-90'
                }`}
                style={!expired ? { backgroundColor: "#42d7c7" } : {}}
              >
                <span className="flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {expired ? 'Orden Expirada' : 'Completar Pago'}
                </span>
              </button>
              
              <button
                onClick={() => onCancel(order.id)}
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
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
