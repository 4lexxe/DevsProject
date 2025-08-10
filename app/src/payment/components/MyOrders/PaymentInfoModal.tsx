import React from 'react';
import { CheckCircle, CreditCard, Wallet, Zap, Building2, Ticket, Smartphone } from 'lucide-react';

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

  const getPaymentMethodName = (paymentMethodId: string, paymentTypeId: string) => {
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
      return (
        <span className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Dinero en cuenta MercadoPago
        </span>
      );
    }

    if (paymentMethodId?.toLowerCase() === 'pix' || paymentTypeId?.toLowerCase() === 'pix') {
      return (
        <span className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          PIX - Transferencia Instantánea
        </span>
      );
    }

    if (paymentMethodId?.toLowerCase() === 'debin') {
      return (
        <span className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Débito inmediato (DEBIN)
        </span>
      );
    }

    if (paymentTypeId?.toLowerCase().includes('card')) {
      return (
        <span className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {type} {method}
        </span>
      );
    }

    if (paymentTypeId?.toLowerCase() === 'ticket') {
      return (
        <span className="flex items-center gap-2">
          <Ticket className="h-4 w-4" />
          {method}
        </span>
      );
    }

    if (paymentTypeId?.toLowerCase() === 'bank_transfer') {
      return (
        <span className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {method}
        </span>
      );
    }

    if (paymentTypeId?.toLowerCase() === 'digital_wallet') {
      return (
        <span className="flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          {method}
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        {type} - {method}
      </span>
    );
  };

  return (
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
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
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
                  {payment.id}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Método de Pago</div>
                <div className="font-medium" style={{ color: "#0c154c" }}>
                  {getPaymentMethodName(payment.paymentMethodId, payment.paymentTypeId)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Fecha y Hora del Pago</div>
                <div className="font-medium" style={{ color: "#0c154c" }}>
                  {formatDateTime(payment.dateApproved)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Monto</div>
                <div className="font-bold text-lg" style={{ color: "#1d4ed8" }}>
                  {formatCurrency(payment.transactionAmount)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Estado</div>
                <div className="font-medium" style={{ color: "#42d7c7" }}>
                  {payment.status === "approved" ? "Aprobado" : payment.status}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Comprador</div>
                <div className="font-medium" style={{ color: "#0c154c" }}>
                  {payment.payer.first_name && payment.payer.last_name
                    ? `${payment.payer.first_name} ${payment.payer.last_name}`
                    : payment.payer.email}
                </div>
                <div className="text-sm text-gray-500">{payment.payer.email}</div>
                {payment.payer.identification && (
                  <div className="text-sm text-gray-500">
                    {payment.payer.identification.type}: {payment.payer.identification.number}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: "#e5e7eb" }}>
              <button
                onClick={onClose}
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
  );
};

export default PaymentInfoModal;
