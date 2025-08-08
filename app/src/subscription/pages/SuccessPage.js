import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Success from "../components/Success";
import { getSubscriptionSuccess } from "../services/subscriptionService";
import { useAuth } from "@/user/contexts/AuthContext";
function SuccessPage() {
    const { user, loading } = useAuth();
    const [subscriptionData, setSubscriptionData] = useState(null);
    const fetchSubscription = async () => {
        try {
            const response = await getSubscriptionSuccess();
            setSubscriptionData(response.data);
        }
        catch (error) {
            console.error("Error fetching subscription data:", error);
        }
    };
    useEffect(() => {
        if (user) {
            fetchSubscription();
        }
    }, [user]);
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (!subscriptionData) {
        return _jsx("div", { children: "Loading..." });
    }
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(subscriptionData.mpSubscription.nextPaymentDate));
    return (_jsx("div", { children: _jsx(Success, { userName: subscriptionData.user.name, nextBillingDate: formattedDate, amount: subscriptionData.mpSubscription.transactionAmount, planName: subscriptionData.plan.name }) }));
}
export default SuccessPage;
