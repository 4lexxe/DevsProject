import React from "react";
import { CreditCard, Check, AlertCircle } from "lucide-react";
import { Plan } from "../interfaces/Plan";
import MercadoPago from "@/shared/assets/imgs/mercadopago.png";

interface SubscriptionCardProps {
  plan: Plan;
}

// Function to format price in CLP
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
};

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ plan }) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 flex flex-col ${
        plan.accessLevel === "Básico"
          ? "bg-white border-t-4 border-[#42d7c7]"
          : plan.accessLevel === "Estándar"
          ? "bg-gradient-to-br from-white to-[#eff6ff] border-t-4 border-[#1d4ed8]"
          : "bg-gradient-to-br from-[#0c154c] to-[#1d4ed8] text-white border-t-4 border-[#02ffff]"
      }`}
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-2xl font-bold ${
              plan.accessLevel === "Premium" ? "text-white" : "text-[#0c154c]"
            }`}
          >
            {plan.name}
          </h2>
          <div
            className={`p-2 rounded-full ${
              plan.accessLevel === "Básico"
                ? "bg-[#42d7c7]/10"
                : plan.accessLevel === "Estándar"
                ? "bg-[#1d4ed8]/10"
                : "bg-[#02ffff]/20"
            }`}
          >
            <CreditCard
              className={`h-6 w-6 ${
                plan.accessLevel === "Básico"
                  ? "text-[#42d7c7]"
                  : plan.accessLevel === "Estándar"
                  ? "text-[#1d4ed8]"
                  : "text-[#02ffff]"
              }`}
            />
          </div>
        </div>
        <p
          className={`mb-6 ${
            plan.accessLevel === "Premium" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {plan.description}
        </p>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span
              className={`text-4xl font-extrabold ${
                plan.accessLevel === "Premium" ? "text-white" : "text-[#0c154c]"
              }`}
            >
              {formatPrice(plan.totalPrice)}
            </span>
            <span
              className={`ml-2 ${
                plan.accessLevel === "Premium"
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              /{plan.duration} {plan.durationType}
            </span>
          </div>

          {plan.installments > 1 && (
            <p
              className={`mt-2 ${
                plan.accessLevel === "Premium"
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              o {plan.installments} cuotas de{" "}
              {formatPrice(plan.installmentPrice)}
            </p>
          )}
        </div>
      </div>

      {/* Features */}
      <div
        className={`px-6 pb-6 flex-grow ${
          plan.accessLevel === "Premium" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        <h3
          className={`font-semibold mb-4 ${
            plan.accessLevel === "Premium" ? "text-white" : "text-[#0c154c]"
          }`}
        >
          Incluye:
        </h3>
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <Check
                className={`h-5 w-5 mr-2 flex-shrink-0 ${
                  plan.accessLevel === "Básico"
                    ? "text-[#42d7c7]"
                    : plan.accessLevel === "Estándar"
                    ? "text-[#1d4ed8]"
                    : "text-[#02ffff]"
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button - Now in a fixed position at the bottom */}
      <div className="px-6 pb-8 mt-auto">
        <button
          className={`w-full py-3 px-4  rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
            plan.accessLevel === "Básico"
              ? "bg-[#42d7c7] hover:bg-[#42d7c7]/90 text-[#0c154c]"
              : plan.accessLevel === "Estándar"
              ? "bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 text-white"
              : "bg-[#02ffff] hover:bg-[#02ffff]/90 text-[#0c154c]"
          }`}
        >
          <p className="mr-4">Pagar con</p>
          <img src={MercadoPago} alt="MercadoPago" className="w-32" />
        </button>

        <p
          className={`text-xs mt-2 text-center ${
            plan.accessLevel === "Premium" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <AlertCircle className="inline h-3 w-3 mr-1" />
          Informacion Adicional
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCard;
