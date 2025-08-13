import React from 'react';
import SubscriptionCard from '@/subscription/components/Plans/SubscriptionPlanCard'
import { Plan } from '../../interfaces/plan';

interface SubscriptionPlansProps {
  plans: Plan[];
  title?: string;
  subtitle?: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  plans, 
  title = "Planes de Suscripción",
  subtitle = "Elige el plan que mejor se adapte a tus necesidades y comienza tu viaje de aprendizaje hoy mismo."
}) => {
  return (
    <div className="min-h-screen bg-[#eff6ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#0c154c] mb-4">{title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.isArray(plans) && plans.map((plan, index) => (
            <SubscriptionCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;