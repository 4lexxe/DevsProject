import React, { useEffect, useState } from 'react';
import SubscriptionPlans from '../components/SubscriptionPlans';
import { getActivePlans } from '../services/planService';

function PlansPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const activePlans = await getActivePlans();
        setPlans(activePlans.data);
      } catch (error) {
        console.error("Error fetching active plans:", error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <SubscriptionPlans 
      plans={plans} 
      title="Planes de Suscripción" 
      subtitle="Elige el plan que mejor se adapte a tus necesidades y comienza tu viaje de aprendizaje hoy mismo."
    />
  );
}

export default PlansPage;