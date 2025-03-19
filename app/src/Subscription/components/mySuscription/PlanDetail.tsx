import type { Plan } from "@/subscription/interfaces/subscription"
import { formatCurrency } from "@/subscription/utils/formatDate"

interface PlanDetailsProps {
  plan: Plan
}

export default function PlanDetails({ plan }: PlanDetailsProps) {
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
            <p className="text-2xl font-bold text-[#0c154c]">{formatCurrency(plan.totalPrice)}</p>
            {plan.installments > 1 && (
              <p className="text-sm text-gray-500">
                {plan.installments} cuotas de {formatCurrency(plan.installmentPrice)}
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

       