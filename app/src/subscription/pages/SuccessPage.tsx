import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Success from "../components/Success";
import { getSubscriptionSuccess } from "../services/subscriptionService";
import { useAuth } from "@/user/contexts/AuthContext";

function SuccessPage() {
  const { user, loading } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const fetchSubscription = async () => {
    try {
      const response = await getSubscriptionSuccess();
      setSubscriptionData(response.data);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!subscriptionData) {
    return <div>Loading...</div>;
  }

  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(subscriptionData.mpSubscription.nextPaymentDate));

  return (
    <div>
      <Success
        userName={subscriptionData.user.name}
        nextBillingDate={formattedDate}
        amount={subscriptionData.mpSubscription.transactionAmount}
        planName={subscriptionData.plan.name}
      />
    </div>
  );
}

export default SuccessPage;
