import React from 'react';
import { CreditCard, Calendar, CheckCircle, Clock, XCircle, Wallet, Zap, Building2, Ticket, Smartphone } from 'lucide-react';

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
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => {
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

  return (
    <div
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
  );
};

export default PaymentCard;
