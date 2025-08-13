import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SubscriptionCard from '@/subscription/components/Plans/SubscriptionPlanCard';
const SubscriptionPlans = ({ plans, title = "Planes de Suscripción", subtitle = "Elige el plan que mejor se adapte a tus necesidades y comienza tu viaje de aprendizaje hoy mismo." }) => {
    return (_jsx("div", { className: "min-h-screen bg-[#eff6ff] py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-extrabold text-[#0c154c] mb-4", children: title }), _jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: subtitle })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: Array.isArray(plans) && plans.map((plan, index) => (_jsx(SubscriptionCard, { plan: plan }, index))) })] }) }));
};
export default SubscriptionPlans;
