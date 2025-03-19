import React from "react";
import { CreditCard, Check, AlertCircle, Tag, Sparkles } from "lucide-react";
import { Plan, DiscountEvent } from "../../interfaces/plan";

import MpButton from "./MpButton";

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

// Function to calculate discounted price
const calculateDiscountedPrice = (price: number, discount: DiscountEvent) => {
  return Math.round(price - price * (discount.value / 100));
};

// Function to format date range
const formatDateRange = (startDate: Date, endDate: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };
  return `${new Date(startDate).toLocaleDateString(
    "es-CL",
    options
  )} - ${new Date(endDate).toLocaleDateString("es-CL", options)}`;
};

const SubscriptionPlanCard: React.FC<SubscriptionCardProps> = ({ plan }) => {
  const activeDiscount = plan.discountEvent;
  const finalPrice = activeDiscount
    ? calculateDiscountedPrice(plan.totalPrice, activeDiscount)
    : plan.totalPrice;
  const finalInstallmentPrice = activeDiscount
    ? Math.round(
        calculateDiscountedPrice(plan.installmentPrice, activeDiscount)
      )
    : plan.installmentPrice;
  const savings = activeDiscount ? plan.totalPrice - finalPrice : 0;

  const getPlanColors = () => {
    switch (plan.accessLevel) {
      case "Básico":
        return {
          primary: "#42d7c7",
          badge: "bg-[#42d7c7]/20 text-[#42d7c7]",
          discountBg: "bg-[#42d7c7]/10 border-[#42d7c7]/20",
          discountText: "text-[#42d7c7]",
          savingsText: "text-[#42d7c7]",
        };
      case "Estándar":
        return {
          primary: "#1d4ed8",
          badge: "bg-[#1d4ed8]/20 text-[#1d4ed8]",
          discountBg: "bg-[#1d4ed8]/10 border-[#1d4ed8]/20",
          discountText: "text-[#1d4ed8]",
          savingsText: "text-[#1d4ed8]",
        };
      case "Premium":
        return {
          primary: "#02ffff",
          badge: "bg-[#02ffff]/20 text-[#0c154c]",
          discountBg: "bg-[#02ffff]/10 border-[#02ffff]/20",
          discountText: "text-[#02ffff]",
          savingsText: "text-[#02ffff]",
        };
      default:
        return {
          primary: "#42d7c7",
          badge: "bg-[#42d7c7]/20 text-[#42d7c7]",
          discountBg: "bg-[#42d7c7]/10 border-[#42d7c7]/20",
          discountText: "text-[#42d7c7]",
          savingsText: "text-[#42d7c7]",
        };
    }
  };

  const colors = getPlanColors();

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 md:hover:scale-105 flex flex-col sm:mx-16 md:mx-0 ${
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
          {/* Discount Badge */}
          {activeDiscount && (
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full mb-3 ${colors.badge}`}
            >
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold text-sm">
                {activeDiscount.value}% OFF
              </span>
            </div>
          )}

          <div className="flex items-baseline flex-wrap gap-2">
            {activeDiscount && (
              <span
                className={`text-2xl font-bold line-through ${
                  plan.accessLevel === "Premium"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {formatPrice(plan.totalPrice)}
              </span>
            )}
            <span
              className={`text-4xl font-extrabold ${
                plan.accessLevel === "Premium" ? "text-white" : "text-[#0c154c]"
              }`}
            >
              {formatPrice(finalPrice)}
            </span>
            <span
              className={`${
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
              {formatPrice(finalInstallmentPrice)}
            </p>
          )}

          {/* Savings Amount */}
          {activeDiscount && (
            <div className={`mt-3 text-sm font-medium ${colors.savingsText}`}>
              ¡Ahorras {formatPrice(savings)}!
            </div>
          )}

          {/* Discount Event Badge */}
          {activeDiscount && (
            <div className={`mt-4 p-3 rounded-lg border ${colors.discountBg}`}>
              <div className={`flex items-start gap-2 ${colors.discountText}`}>
                <Tag className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">{activeDiscount.event}</p>
                  {activeDiscount.description && (
                    <p className="text-sm mt-1 opacity-90">
                      {activeDiscount.description}
                    </p>
                  )}
                  <p className="text-sm mt-1 opacity-75">
                    Válido:{" "}
                    {formatDateRange(
                      activeDiscount.startDate,
                      activeDiscount.endDate
                    )}
                  </p>
                </div>
              </div>
            </div>
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

      {/* CTA Button */}
      <div className="px-6 pb-8 mt-auto">
        <MpButton plan={plan} />
        <p
          className={`text-xs mt-2 text-center ${
            plan.accessLevel === "Premium" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <AlertCircle className="inline h-3 w-3 mr-1" />
          No se te dará ningún beneficio
          <br />
          !Este plan es solo de prueba
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlanCard;
