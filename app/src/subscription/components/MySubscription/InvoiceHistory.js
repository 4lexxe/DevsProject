import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatCurrency, formatDate, getPaymentMethodText, getStatusText } from "@/subscription/utils/formatDate";
import { downloadInvoice } from "@/subscription/services/subscriptionService";
export default function InvoiceHistory({ payments, planName }) {
    const handleDownloadInvoice = async (paymentId) => {
        try {
            const invoiceData = await downloadInvoice(paymentId);
            const blob = new Blob([invoiceData], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice_${paymentId}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };
    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case "credit_card":
                return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "1", y: "4", width: "22", height: "16", rx: "2", ry: "2" }), _jsx("line", { x1: "1", y1: "10", x2: "23", y2: "10" })] }));
            case "debit_card":
                return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "1", y: "4", width: "22", height: "16", rx: "2", ry: "2" }), _jsx("line", { x1: "1", y1: "10", x2: "23", y2: "10" })] }));
            case "account_money":
                return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "8", x2: "12", y2: "16" }), _jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" })] }));
            default:
                return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z" }), _jsx("polyline", { points: "17 2 12 7 7 2" })] }));
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return (_jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800", children: getStatusText(status) }));
            case "rejected":
                return (_jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800", children: getStatusText(status) }));
            case "in_process":
                return (_jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800", children: getStatusText(status) }));
            default:
                return (_jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800", children: getStatusText(status) }));
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg border border-[#eff6ff] shadow-sm", children: [_jsxs("div", { className: "p-6 border-b border-[#eff6ff]", children: [_jsx("h2", { className: "text-xl font-semibold text-[#0c154c]", children: "Historial de Pagos" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Registro de todos los pagos realizados con Mercado Pago" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-[#eff6ff]", children: [_jsx("thead", { className: "bg-[#eff6ff]", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider", children: "Fecha" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider", children: "ID de Pago" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider", children: "Plan" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider", children: "M\u00E9todo de pago" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider", children: "Monto" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider", children: "Estado" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-[#0c154c] uppercase tracking-wider", children: "Comprobante" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-[#eff6ff]", children: payments &&
                                payments.map((payment) => (_jsxs("tr", { className: "hover:bg-[#eff6ff]", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-700", children: formatDate(payment.dateApproved) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-700", children: payment.id }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-700", children: planName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-8 w-8 flex items-center justify-center bg-[#eff6ff] rounded-full text-[#1d4ed8]", children: getPaymentMethodIcon(payment.paymentMethodId) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-gray-700", children: getPaymentMethodText(payment.paymentMethodId) }) })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0c154c]", children: formatCurrency(payment.transactionAmount) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getStatusBadge(payment.status) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("button", { className: "text-[#1d4ed8] hover:text-[#0c154c] inline-flex items-center", onClick: () => handleDownloadInvoice(payment.id), children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-1", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsx("polyline", { points: "7 10 12 15 17 10" }), _jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" })] }), "Descargar"] }) })] }, payment.id))) })] }) }), !payments || payments.length === 0 ? (_jsx("div", { className: "p-6 text-center text-gray-500", children: "No hay pagos registrados" })) : (_jsxs("div", { className: "p-4 border-t border-[#eff6ff] bg-[#eff6ff] text-center text-sm text-gray-500", children: ["Mostrando los \u00FAltimos ", payments.length, " pagos de tu historial"] }))] }));
}
