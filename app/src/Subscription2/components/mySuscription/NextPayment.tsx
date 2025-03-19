import type { Subscription } from "@/subscription/interfaces/subscription"
import { formatCurrency, formatDate } from "@/subscription/utils/formatDate"
import mercadopago from "@/shared/assets/imgs/mercadopago.png"

interface NextPaymentProps {
  subscription: Subscription
}

export default function NextPayment({ subscription }: NextPaymentProps) {
  const { mpSubscription, plan } = subscription

  return (
    <div className="bg-white rounded-lg border border-[#eff6ff] shadow-sm">
      <div className="p-6 border-b border-[#eff6ff]">
        <h2 className="text-xl font-semibold text-[#0c154c]">Próximo Pago</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="bg-[#42d7c7] p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha del próximo pago</p>
            <p className="font-medium text-[#0c154c]">{formatDate(mpSubscription.nextPaymentDate)}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Monto a debitar</p>
          <p className="text-xl font-bold text-[#0c154c]">{formatCurrency(plan.totalPrice)}</p>
        </div>
        <div className="mt-6 pt-4 border-t border-[#eff6ff]">
          <div className="flex items-center">
            <img src={mercadopago} alt="Mercado Pago" className="w-40" />
            <p className="ml-2 text-sm text-gray-500">Procesado por Mercado Pago</p>

          </div>
        </div>
      </div>
    </div>
  )
}

