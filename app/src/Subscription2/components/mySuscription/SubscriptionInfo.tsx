import type { Subscription } from "@/subscription/interfaces/subscription"
import { formatDate } from "@/subscription/utils/formatDate"
import StatusBadge from "./StatusBadge"

interface SubscriptionInfoProps {
  subscription: Subscription
}

export default function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  return (
    <div className="bg-white rounded-lg border border-[#eff6ff] shadow-sm">
      <div className="p-6 border-b border-[#eff6ff]">
        <h2 className="text-xl font-semibold text-[#0c154c]">Detalles de Suscripción</h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Fecha de inicio</p>
          <p className="font-medium text-[#0c154c]">{formatDate(subscription.startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fecha de finalización</p>
          <p className="font-medium text-[#0c154c]">{formatDate(subscription.endDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estado</p>
          <div className="mt-1">
            <StatusBadge status={subscription.status} />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">ID de suscripción</p>
          <p className="font-medium text-[#0c154c]">{subscription.id}</p>
        </div>
      </div>
    </div>
  )
}
