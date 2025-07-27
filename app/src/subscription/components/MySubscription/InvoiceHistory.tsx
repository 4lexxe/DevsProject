import type { Payment } from "@/subscription/interfaces/subscription"
import { formatCurrency, formatDate, getPaymentMethodText, getStatusText } from "@/subscription/utils/formatDate"
import { downloadInvoice } from "@/subscription/services/subscriptionService"

interface PaymentHistoryProps {
  payments: Payment[]
  planName: string
}

export default function InvoiceHistory({ payments, planName }: PaymentHistoryProps) {

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const invoiceData = await downloadInvoice(paymentId);
      const blob = new Blob([invoiceData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${paymentId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  const getPaymentMethodIcon = (method: string): JSX.Element => {
    switch (method) {
      case "credit_card":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        )
      case "debit_card":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        )
      case "account_money":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z"></path>
            <polyline points="17 2 12 7 7 2"></polyline>
          </svg>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {getStatusText(status)}
          </span>
        )
      case "rejected":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            {getStatusText(status)}
          </span>
        )
      case "in_process":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            {getStatusText(status)}
          </span>
        )
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {getStatusText(status)}
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg border border-[#eff6ff] shadow-sm">
      <div className="p-6 border-b border-[#eff6ff]">
        <h2 className="text-xl font-semibold text-[#0c154c]">Historial de Pagos</h2>
        <p className="text-sm text-gray-500 mt-1">Registro de todos los pagos realizados con Mercado Pago</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#eff6ff]">
          <thead className="bg-[#eff6ff]">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider"
              >
                ID de Pago
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider"
              >
                Plan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider"
              >
                Método de pago
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider"
              >
                Monto
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#0c154c] uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-[#0c154c] uppercase tracking-wider"
              >
                Comprobante
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#eff6ff]">
            {payments &&
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#eff6ff]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(payment.dateApproved)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{planName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-[#eff6ff] rounded-full text-[#1d4ed8]">
                        {getPaymentMethodIcon(payment.paymentMethodId)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">{getPaymentMethodText(payment.paymentMethodId)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0c154c]">
                    {formatCurrency(payment.transactionAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-[#1d4ed8] hover:text-[#0c154c] inline-flex items-center"
                      onClick={() => handleDownloadInvoice(payment.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!payments || payments.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No hay pagos registrados</div>
      ) : (
        <div className="p-4 border-t border-[#eff6ff] bg-[#eff6ff] text-center text-sm text-gray-500">
          Mostrando los últimos {payments.length} pagos de tu historial
        </div>
      )}
    </div>
  )
}

