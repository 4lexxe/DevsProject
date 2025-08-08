import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CreditCard, Check, AlertCircle, Tag, Sparkles } from "lucide-react";
// Function to format price in CLP
export const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(price);
};
// Function to calculate discounted price
const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price - price * (discount.value / 100));
};
// Function to format date range
const formatDateRange = (startDate, endDate) => {
    const options = {
        day: "numeric",
        month: "short",
    };
    return `${new Date(startDate).toLocaleDateString("es-CL", options)} - ${new Date(endDate).toLocaleDateString("es-CL", options)}`;
};
const SubscriptionPlanCard = ({ plan }) => {
    const activeDiscount = plan.discountEvent;
    const finalPrice = activeDiscount
        ? calculateDiscountedPrice(plan.totalPrice, activeDiscount)
        : plan.totalPrice;
    const finalInstallmentPrice = activeDiscount
        ? Math.round(calculateDiscountedPrice(plan.installmentPrice, activeDiscount))
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
    return (_jsxs("div", { className: `relative rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 md:hover:scale-105 flex flex-col sm:mx-16 md:mx-0 ${plan.accessLevel === "Básico"
            ? "bg-white border-t-4 border-[#42d7c7]"
            : plan.accessLevel === "Estándar"
                ? "bg-gradient-to-br from-white to-[#eff6ff] border-t-4 border-[#1d4ed8]"
                : "bg-gradient-to-br from-[#0c154c] to-[#1d4ed8] text-white border-t-4 border-[#02ffff]"}`, children: [_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: `text-2xl font-bold ${plan.accessLevel === "Premium" ? "text-white" : "text-[#0c154c]"}`, children: plan.name }), _jsx("div", { className: `p-2 rounded-full ${plan.accessLevel === "Básico"
                                    ? "bg-[#42d7c7]/10"
                                    : plan.accessLevel === "Estándar"
                                        ? "bg-[#1d4ed8]/10"
                                        : "bg-[#02ffff]/20"}`, children: _jsx(CreditCard, { className: `h-6 w-6 ${plan.accessLevel === "Básico"
                                        ? "text-[#42d7c7]"
                                        : plan.accessLevel === "Estándar"
                                            ? "text-[#1d4ed8]"
                                            : "text-[#02ffff]"}` }) })] }), _jsx("p", { className: `mb-6 ${plan.accessLevel === "Premium" ? "text-gray-300" : "text-gray-600"}`, children: plan.description }), _jsxs("div", { className: "mb-6", children: [activeDiscount && (_jsxs("div", { className: `inline-flex items-center gap-1 px-3 py-1 rounded-full mb-3 ${colors.badge}`, children: [_jsx(Sparkles, { className: "h-4 w-4" }), _jsxs("span", { className: "font-semibold text-sm", children: [activeDiscount.value, "% OFF"] })] })), _jsxs("div", { className: "flex items-baseline flex-wrap gap-2", children: [activeDiscount && (_jsx("span", { className: `text-2xl font-bold line-through ${plan.accessLevel === "Premium"
                                            ? "text-gray-400"
                                            : "text-gray-500"}`, children: formatPrice(plan.totalPrice) })), _jsx("span", { className: `text-4xl font-extrabold ${plan.accessLevel === "Premium" ? "text-white" : "text-[#0c154c]"}`, children: formatPrice(finalPrice) }), _jsxs("span", { className: `${plan.accessLevel === "Premium"
                                            ? "text-gray-300"
                                            : "text-gray-600"}`, children: ["/", plan.duration, " ", plan.durationType] })] }), plan.installments > 1 && (_jsxs("p", { className: `mt-2 ${plan.accessLevel === "Premium"
                                    ? "text-gray-300"
                                    : "text-gray-600"}`, children: ["o ", plan.installments, " cuotas de", " ", formatPrice(finalInstallmentPrice)] })), activeDiscount && (_jsxs("div", { className: `mt-3 text-sm font-medium ${colors.savingsText}`, children: ["\u00A1Ahorras ", formatPrice(savings), "!"] })), activeDiscount && (_jsx("div", { className: `mt-4 p-3 rounded-lg border ${colors.discountBg}`, children: _jsxs("div", { className: `flex items-start gap-2 ${colors.discountText}`, children: [_jsx(Tag, { className: "h-4 w-4 mt-1 flex-shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: activeDiscount.event }), activeDiscount.description && (_jsx("p", { className: "text-sm mt-1 opacity-90", children: activeDiscount.description })), _jsxs("p", { className: "text-sm mt-1 opacity-75", children: ["V\u00E1lido:", " ", formatDateRange(activeDiscount.startDate, activeDiscount.endDate)] })] })] }) }))] })] }), _jsxs("div", { className: `px-6 pb-6 flex-grow ${plan.accessLevel === "Premium" ? "text-gray-200" : "text-gray-700"}`, children: [_jsx("h3", { className: `font-semibold mb-4 ${plan.accessLevel === "Premium" ? "text-white" : "text-[#0c154c]"}`, children: "Incluye:" }), _jsx("ul", { className: "space-y-3", children: plan.features.map((feature, idx) => (_jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: `h-5 w-5 mr-2 flex-shrink-0 ${plan.accessLevel === "Básico"
                                        ? "text-[#42d7c7]"
                                        : plan.accessLevel === "Estándar"
                                            ? "text-[#1d4ed8]"
                                            : "text-[#02ffff]"}` }), _jsx("span", { children: feature })] }, idx))) })] }), _jsxs("div", { className: "px-6 pb-8 mt-auto", children: [_jsx("div", { children: "Proximamente !!!" }), _jsxs("p", { className: `text-xs mt-2 text-center ${plan.accessLevel === "Premium" ? "text-gray-300" : "text-gray-600"}`, children: [_jsx(AlertCircle, { className: "inline h-3 w-3 mr-1" }), "No se te dar\u00E1 ning\u00FAn beneficio", _jsx("br", {}), "!Este plan es solo de prueba"] })] })] }));
};
export default SubscriptionPlanCard;
