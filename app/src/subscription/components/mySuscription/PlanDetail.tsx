import type { Plan } from "@/subscription/interfaces/subscription"
import { formatCurrency } from "@/subscription/utils/formatDate"

interface PlanDetailsProps {
  plan: Plan
}

export default function PlanDetails({ plan }: PlanDetailsProps) {
  // Verificar si hay un descuento activo
  const hasActiveDiscount = plan.discountEvent?.isActive

  // Calcular el precio con descuento si hay un descuento activo
  const discountedPrice = hasActiveDiscount
    ? Number(plan.totalPrice) - (Number(plan.totalPrice) * plan.discountEvent!.value) / 100
    : Number(plan.totalPrice)

  // Calcular el precio de la cuota con descuento si hay un descuento activo
  const discountedInstallmentPrice =
    hasActiveDiscount && plan.installments > 1
      ? Number(plan.installmentPrice) - (Number(plan.installmentPrice) * plan.discountEvent!.value) / 100
      : Number(plan.installmentPrice)

  // Formatear las fechas del descuento si existe
  const formatDiscountDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-[#eff6ff] rounded-lg border border-[#42d7c7] shadow-sm mb-6">
      <div className="p-6 border-b border-[#42d7c7]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#0c154c]">{plan.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
          </div>
          <div className="bg-[#0c154c] text-white px-3 py-1 rounded-full text-sm">Nivel {plan.accessLevel}</div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">Precio total</p>
            {hasActiveDiscount ? (
              <>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-[#0c154c]">{formatCurrency(discountedPrice)}</p>
                  <span className="text-sm line-through text-gray-500">{formatCurrency(plan.totalPrice)}</span>
                  <span className="bg-[#42d7c7] text-[#0c154c] text-xs font-medium px-2 py-1 rounded-full">
                    {plan.discountEvent!.value}% OFF
                  </span>
                </div>
                {plan.discountEvent?.description && (
                  <p className="text-sm text-[#1d4ed8] mt-1">{plan.discountEvent.description}</p>
                )}
              </>
            ) : (
              <p className="text-2xl font-bold text-[#0c154c]">{formatCurrency(plan.totalPrice)}</p>
            )}
            {plan.installments > 1 && (
              <p className="text-sm text-gray-500 mt-1">
                {plan.installments} cuotas de{" "}
                {hasActiveDiscount ? formatCurrency(discountedInstallmentPrice) : formatCurrency(plan.installmentPrice)}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Duración</p>
            <p className="text-lg font-medium text-[#0c154c]">
              {plan.duration} {plan.durationType}
            </p>
          </div>
        </div>

        {hasActiveDiscount && (
          <div className="mb-6 p-4 bg-[#f0fdfa] border border-[#42d7c7] rounded-md">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#42d7c7] mr-2 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <div>
                <p className="font-medium text-[#0c154c]">Promoción: {plan.discountEvent!.event}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Válido desde {formatDiscountDate(plan.discountEvent!.startDate)} hasta{" "}
                  {formatDiscountDate(plan.discountEvent!.endDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-md font-medium text-[#0c154c] mb-3">Características incluidas:</h3>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#42d7c7] mr-2 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

