import React from 'react';
import { motion } from 'framer-motion';
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

interface PaymentCardProps {
  payment: PaymentInfo;
  onViewDetails?: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onViewDetails }) => {
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
      return { name: 'Dinero en cuenta MercadoPago', icon: 'icon-wallet', iconBg: 'bg-blue-200' };
    }

    if (paymentMethodId?.toLowerCase() === 'pix' || paymentTypeId?.toLowerCase() === 'pix') {
      return { name: 'PIX - Transferencia Instantánea', icon: 'icon-flash', iconBg: 'bg-yellow-200' };
    }

    if (paymentMethodId?.toLowerCase() === 'debin') {
      return { name: 'Débito inmediato (DEBIN)', icon: 'icon-bank', iconBg: 'bg-indigo-200' };
    }

    if (paymentTypeId?.toLowerCase().includes('card')) {
      return { name: `${type} ${method}`, icon: 'icon-credit-card', iconBg: 'bg-purple-200' };
    }

    if (paymentTypeId?.toLowerCase() === 'ticket') {
      return { name: method, icon: 'icon-ticket', iconBg: 'bg-green-200' };
    }

    if (paymentTypeId?.toLowerCase() === 'bank_transfer') {
      return { name: method, icon: 'icon-bank', iconBg: 'bg-indigo-200' };
    }

    if (paymentTypeId?.toLowerCase() === 'digital_wallet') {
      return { name: method, icon: 'icon-mobile', iconBg: 'bg-pink-200' };
    }

    return { name: `${type} - ${method}`, icon: 'icon-credit-card', iconBg: 'bg-gray-200' };
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return {
          bg: 'bg-teal-50',
          border: 'border-teal-300',
          text: 'text-teal-700',
          badge: 'bg-teal-100 text-teal-700 border-teal-300',
          icon: 'icon-ok',
          iconBg: 'bg-teal-500'
        };
      case "pending":
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
          icon: 'icon-clock',
          iconBg: 'bg-yellow-400'
        };
      case "cancelled":
      case "rejected":
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-700 border-red-300',
          icon: 'icon-cancel',
          iconBg: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-700 border-gray-300',
          icon: 'icon-help',
          iconBg: 'bg-gray-500'
        };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Pagado";
      case "approved": return "Aprobado";
      case "pending": return "Pendiente";
      case "cancelled": return "Cancelado";
      case "rejected": return "Rechazado";
      default: return "Desconocido";
    }
  };

  const paymentMethod = getPaymentMethodInfo(payment.paymentMethodId || '', payment.paymentTypeId || '');
  const statusConfig = getStatusConfig(payment.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-2xl border-2 ${statusConfig.border} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start gap-4 mb-4 md:mb-0 flex-1">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 flex-shrink-0">
              <FontelloIcon 
                name={paymentMethod.icon} 
                className="text-3xl text-gray-600"
                fallback={
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
                Pago #{payment.id.slice(-8)}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-light">
                <span className="flex items-center gap-2">
                  <FontelloIcon 
                    name="icon-hash" 
                    className="text-base"
                    fallback={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    }
                  />
                  ID: {payment.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light border-2 self-start md:self-auto ${statusConfig.badge}`}>
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
            {getStatusText(payment.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <FontelloIcon 
                  name="icon-money" 
                  className="text-xl text-gray-600"
                  fallback={
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-4c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>
              <div className="text-xs text-gray-600 font-light uppercase tracking-wide">Monto</div>
            </div>
            <div className="font-light text-3xl text-gray-900">
              {formatCurrency(payment.transactionAmount)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <FontelloIcon 
                  name="icon-calendar" 
                  className="text-xl text-gray-600"
                  fallback={
                    <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                />
              </div>
              <div className="text-xs text-gray-600 font-light uppercase tracking-wide">Fecha</div>
            </div>
            <div className="font-light text-gray-900">
              {payment.dateApproved ? formatDateTime(payment.dateApproved) : 'N/A'}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <FontelloIcon 
                  name={paymentMethod.icon} 
                  className="text-xl text-gray-600"
                  fallback={
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  }
                />
              </div>
              <div className="text-xs text-gray-500 font-light uppercase tracking-wide">Método</div>
            </div>
            <div className="font-light text-gray-900 text-sm">
              {paymentMethod.name}
            </div>
          </div>
        </div>

        {payment.items && payment.items.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <FontelloIcon 
                name="icon-basket" 
                className="text-lg text-gray-600"
                fallback={
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              <div className="text-xs text-gray-500 font-light uppercase tracking-wide">Items comprados</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {payment.items.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                  <FontelloIcon 
                    name="icon-book" 
                    className="text-xs"
                    fallback={
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    }
                  />
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentCard;
