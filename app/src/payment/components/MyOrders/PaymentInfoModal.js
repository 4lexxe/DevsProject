import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, CreditCard, Wallet, Zap, Building2, Ticket, Smartphone } from 'lucide-react';
const PaymentInfoModal = ({ payment, isOpen, onClose }) => {
    if (!isOpen || !payment)
        return null;
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
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsx("div", { className: "bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto", style: { border: `2px solid #42d7c7` }, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-bold", style: { color: "#0c154c" }, children: "Informaci\u00F3n del Pago" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 text-2xl", children: "\u00D7" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "p-4 rounded-lg", style: { backgroundColor: "#eff6ff" }, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mb-2", children: _jsx(CheckCircle, { className: "h-10 w-10 mx-auto text-green-500" }) }), _jsx("div", { className: "font-bold text-lg", style: { color: "#42d7c7" }, children: "Pago Aprobado" })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "ID de Pago" }), _jsx("div", { className: "font-mono text-sm", style: { color: "#1d4ed8" }, children: payment.id })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "M\u00E9todo de Pago" }), _jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: getPaymentMethodName(payment.paymentMethodId, payment.paymentTypeId) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Fecha y Hora del Pago" }), _jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: formatDateTime(payment.dateApproved) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Monto" }), _jsx("div", { className: "font-bold text-lg", style: { color: "#1d4ed8" }, children: formatCurrency(payment.transactionAmount) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Estado" }), _jsx("div", { className: "font-medium", style: { color: "#42d7c7" }, children: payment.status === "approved" ? "Aprobado" : payment.status })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600", children: "Comprador" }), _jsx("div", { className: "font-medium", style: { color: "#0c154c" }, children: payment.payer.first_name && payment.payer.last_name
                                                    ? `${payment.payer.first_name} ${payment.payer.last_name}`
                                                    : payment.payer.email }), _jsx("div", { className: "text-sm text-gray-500", children: payment.payer.email }), payment.payer.identification && (_jsxs("div", { className: "text-sm text-gray-500", children: [payment.payer.identification.type, ": ", payment.payer.identification.number] }))] })] }), _jsx("div", { className: "pt-4 border-t", style: { borderColor: "#e5e7eb" }, children: _jsx("button", { onClick: onClose, className: "w-full px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:opacity-90", style: { backgroundColor: "#1d4ed8" }, children: "Cerrar" }) })] })] }) }) }));
};
export default PaymentInfoModal;
