import React from 'react';
import { AlertTriangle, Eye, CreditCard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  loading?: boolean;
}

const PendingPaymentModal: React.FC<PendingPaymentModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  loading = false
}) => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate('/user/orders');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Pago Pendiente
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              Tienes un pago pendiente en tu carrito. Para agregar nuevos cursos, puedes:
            </p>
            <ul className="text-sm text-gray-500 space-y-1 ml-4">
              <li>• Ver tu orden pendiente y completar el pago</li>
              <li>• Cancelar la orden pendiente y crear una nueva</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleViewOrders}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Eye className="w-4 h-4" />
              Ver Órdenes
            </button>
            
            <button
              onClick={onContinue}
              disabled={loading}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Cancelando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Continuar
                </>
              )}
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Al continuar, se cancelará tu pago pendiente actual
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPaymentModal;
