import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CreditCard, Calendar, CheckCircle, Clock, XCircle, Wallet, Zap, Building2, Ticket, Smartphone } from 'lucide-react';
const PaymentCard = ({ payment }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const getPaymentMethodName = (paymentMethodId, paymentTypeId) => {
        const methods = {
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
        const types = {
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
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Wallet, { className: "h-4 w-4" }), "Dinero en cuenta MercadoPago"] }));
        }
        if (paymentMethodId?.toLowerCase() === 'pix' || paymentTypeId?.toLowerCase() === 'pix') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-4 w-4" }), "PIX - Transferencia Instant\u00E1nea"] }));
        }
        if (paymentMethodId?.toLowerCase() === 'debin') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Building2, { className: "h-4 w-4" }), "D\u00E9bito inmediato (DEBIN)"] }));
        }
        if (paymentTypeId?.toLowerCase().includes('card')) {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4" }), type, " ", method] }));
        }
        if (paymentTypeId?.toLowerCase() === 'ticket') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Ticket, { className: "h-4 w-4" }), method] }));
        }
        if (paymentTypeId?.toLowerCase() === 'bank_transfer') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Building2, { className: "h-4 w-4" }), method] }));
        }
        if (paymentTypeId?.toLowerCase() === 'digital_wallet') {
            return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Smartphone, { className: "h-4 w-4" }), method] }));
        }
        return (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4" }), type, " - ", method] }));
    };
    const getStatusColor = (status) => {
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
    const getStatusIcon = (status) => {
        switch (status) {
            case "paid":
            case "approved":
                return _jsx(CheckCircle, { className: "h-4 w-4" });
            case "active":
                return _jsx(CheckCircle, { className: "h-4 w-4" });
            case "pending":
                return _jsx(Clock, { className: "h-4 w-4" });
            case "cancelled":
            case "rejected":
                return _jsx(XCircle, { className: "h-4 w-4" });
            default:
                return _jsx(Clock, { className: "h-4 w-4" });
        }
    };
    const getStatusText = (status) => {
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
    return (_jsx("div", { className: "border-2 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md", style: { borderColor: "#42d7c7" }, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4 md:mb-0", children: [_jsx("div", { className: "p-2 rounded-full", style: { backgroundColor: "#e0f2fe" }, children: _jsx(CreditCard, { className: "h-5 w-5", style: { color: "#1d4ed8" } }) }), _jsxs("div", { children: [_jsxs("h3", { className: "font-semibold", style: { color: "#0c154c" }, children: ["Pago #", payment.id] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["ID: ", payment.id] })] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium", style: getStatusColor(payment.status), children: [_jsx("span", { className: "mr-1", children: getStatusIcon(payment.status) }), getStatusText(payment.status)] }) })] }), _jsx("hr", { className: "mb-4 border-gray-200" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Monto" }), _jsx("div", { className: "font-semibold text-lg", style: { color: "#1d4ed8" }, children: formatCurrency(payment.transactionAmount) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Fecha" }), _jsxs("div", { className: "flex items-center gap-2", style: { color: "#0c154c" }, children: [_jsx(Calendar, { className: "h-4 w-4" }), payment.dateApproved ? formatDateTime(payment.dateApproved) : 'N/A'] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "M\u00E9todo de Pago" }), _jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: getPaymentMethodName(payment.paymentMethodId || '', payment.paymentTypeId || '') })] })] }), payment.items && payment.items.length > 0 && (_jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200", children: [_jsx("div", { className: "text-sm text-gray-600 mb-2", children: "Items comprados:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: payment.items.map((item, index) => (_jsx("span", { className: "inline-block px-3 py-1 rounded-full text-xs", style: {
                                    backgroundColor: "#e0f2fe",
                                    color: "#1d4ed8",
                                    border: "1px solid #bae6fd"
                                }, children: item.title }, index))) })] }))] }) }));
};
export default PaymentCard;
