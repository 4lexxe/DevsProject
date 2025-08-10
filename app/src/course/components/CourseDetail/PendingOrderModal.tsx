import React, { useState } from 'react';
import { AlertCircle, ShoppingBag, X, Loader2 } from 'lucide-react';
import { cancelPendingOrder } from '@/course/services/directPurchaseService';

interface PendingOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderId: string;
    orderType: string;
    expirationDate?: string;
    courseName?: string;
  };
  errorMessage: string;
  onOrderCancelled: () => void;
}

const PendingOrderModal: React.FC<PendingOrderModalProps> = ({
  isOpen,
  onClose,
  orderData,
  errorMessage,
  onOrderCancelled
}) => {
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoToOrders = () => {
    // Navegar a la página de órdenes
    window.location.href = '/user/orders';
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      setCancelError(null);
      
      await cancelPendingOrder(orderData.orderId);
      
      // Llamar al callback para notificar que la orden fue cancelada
      onOrderCancelled();
      // No cerramos el modal aquí, lo hace el componente padre
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      setCancelError(
        error.response?.data?.message || 'Error al cancelar la orden'
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Orden Pendiente
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {errorMessage}
            </p>

            {orderData.expirationDate && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Expira:</strong> {new Date(orderData.expirationDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {cancelError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{cancelError}</p>
              </div>
            )}

            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-4">
                ¿Qué te gustaría hacer?
              </p>
              
              <div className="space-y-3">
                {/* Botón para ir a órdenes */}
                <button
                  onClick={handleGoToOrders}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ver mis órdenes
                </button>

                {/* Botón para cancelar orden */}
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Cancelar orden pendiente
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            Al cancelar la orden pendiente podrás realizar una nueva compra
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingOrderModal;
