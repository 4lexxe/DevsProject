import React from 'react';
import FontelloIcon from '@/shared/components/icons/FontelloIcon';

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

interface PaymentInfoModalProps {
  payment: PaymentInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentInfoModal: React.FC<PaymentInfoModalProps> = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
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

  const getPaymentMethodInfo = (paymentMethodId: string, paymentTypeId: string) => {
    const methods: { [key: string]: string } = {
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
      account_money: "Dinero en cuenta MercadoPago",
      debin: "Débito inmediato (DEBIN)",
      pse: "PSE",
      pix: "PIX",
      pagofacil: "Pago Fácil",
      rapipago: "Rapipago",
      bapropagos: "Bapro Pagos",
      cobro_express: "Cobro Express",
      redlink: "Red Link",
      banco_frances: "Banco Francés",
      banco_galicia: "Banco Galicia",
      banco_santander: "Banco Santander",
      banco_ciudad: "Banco Ciudad",
      banco_macro: "Banco Macro",
      banco_nacion: "Banco Nación",
      banco_supervielle: "Banco Supervielle",
      banco_comafi: "Banco Comafi",
      banco_patagonia: "Banco Patagonia",
      mercadopago_wallet: "MercadoPago Wallet",
      moyap: "Moyap",
      webpay: "Webpay",
      khipu: "Khipu",
      payu: "PayU",
    };

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
    };

    const method = methods[paymentMethodId?.toLowerCase()] || paymentMethodId || 'Método desconocido';
    const type = types[paymentTypeId?.toLowerCase()] || paymentTypeId || 'Tipo desconocido';

    if (paymentMethodId?.toLowerCase() === 'account_money' || paymentTypeId?.toLowerCase() === 'account_money') {
      return { name: 'Dinero en cuenta MercadoPago', icon: 'icon-wallet' };
    }

    if (paymentMethodId?.toLowerCase() === 'pix' || paymentTypeId?.toLowerCase() === 'pix') {
      return { name: 'PIX - Transferencia Instantánea', icon: 'icon-flash' };
    }

    if (paymentMethodId?.toLowerCase() === 'debin') {
      return { name: 'Débito inmediato (DEBIN)', icon: 'icon-bank' };
    }

    if (paymentTypeId?.toLowerCase().includes('card')) {
      return { name: `${type} ${method}`, icon: 'icon-credit-card' };
    }

    if (paymentTypeId?.toLowerCase() === 'ticket') {
      return { name: method, icon: 'icon-ticket' };
    }

    if (paymentTypeId?.toLowerCase() === 'bank_transfer') {
      return { name: method, icon: 'icon-bank' };
    }

    if (paymentTypeId?.toLowerCase() === 'digital_wallet') {
      return { name: method, icon: 'icon-mobile' };
    }

    return { name: `${type} - ${method}`, icon: 'icon-credit-card' };
  };

  const paymentMethod = getPaymentMethodInfo(payment.paymentMethodId, payment.paymentTypeId);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
            <h3 className="text-2xl font-light text-gray-900 tracking-tight">
              Información del Pago
            </h3>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <FontelloIcon 
                name="icon-cancel" 
                className="text-xl"
                fallback={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              />
            </button>
          </div>

          <div className="space-y-6">
            {/* Status Badge */}
            <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
              <div className="mb-3 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
                  <FontelloIcon 
                    name="icon-ok" 
                    className="text-3xl text-green-600"
                    fallback={
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                </div>
              </div>
              <div className="font-light text-lg text-green-700">
                Pago Aprobado
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-5">
              <div className="pb-4 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-2 font-light uppercase tracking-wide">ID de Pago</div>
                <div className="font-mono text-sm text-gray-900 font-light">
                  {payment.id}
                </div>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-2 font-light uppercase tracking-wide">Método de Pago</div>
                <div className="flex items-center gap-2 text-gray-900 font-light">
                  <FontelloIcon 
                    name={paymentMethod.icon} 
                    className="text-base"
                    fallback={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    }
                  />
                  {paymentMethod.name}
                </div>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-2 font-light uppercase tracking-wide">Fecha y Hora</div>
                <div className="flex items-center gap-2 text-gray-900 font-light">
                  <FontelloIcon 
                    name="icon-calendar" 
                    className="text-base"
                    fallback={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                  {formatDateTime(payment.dateApproved)}
                </div>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-2 font-light uppercase tracking-wide">Monto</div>
                <div className="font-light text-2xl text-gray-900">
                  {formatCurrency(payment.transactionAmount)}
                </div>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-2 font-light uppercase tracking-wide">Estado</div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-light border border-green-200">
                  <FontelloIcon 
                    name="icon-ok" 
                    className="text-sm"
                    fallback={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                  {payment.status === "approved" ? "Aprobado" : payment.status}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-3 font-light uppercase tracking-wide">Comprador</div>
                <div className="space-y-2">
                  <div className="font-light text-gray-900">
                    {payment.payer.first_name && payment.payer.last_name
                      ? `${payment.payer.first_name} ${payment.payer.last_name}`
                      : payment.payer.email}
                  </div>
                  <div className="text-sm text-gray-500 font-light">{payment.payer.email}</div>
                  {payment.payer.identification && (
                    <div className="text-sm text-gray-500 font-light">
                      {payment.payer.identification.type}: {payment.payer.identification.number}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-900 text-white font-light rounded-lg transition-all duration-300 hover:bg-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoModal;
