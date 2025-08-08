import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import SubscriptionPlans from '../components/plans/SubscriptionPlans';
import { getActivePlans } from '../services/planService';
function PlansPage() {
    const [plans, setPlans] = useState([]);
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const activePlans = await getActivePlans();
                setPlans(activePlans.data);
            }
            catch (error) {
                console.error("Error fetching active plans:", error);
            }
        };
        fetchPlans();
    }, []);
    return (_jsx(SubscriptionPlans, { plans: plans, title: "Planes de Suscripci\u00F3n", subtitle: "Elige el plan que mejor se adapte a tus necesidades y comienza tu viaje de aprendizaje hoy mismo." }));
}
export default PlansPage;
