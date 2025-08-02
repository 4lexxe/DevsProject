"use client";

import { useState, useEffect } from "react";
import StatusBadge from "../components/MySubscription/StatusBadge";
import PlanDetails from "../components/MySubscription/PlanDetail";
import SubscriptionInfo from "../components/MySubscription/SubscriptionInfo";
import NextPayment from "../components/MySubscription/NextPayment";
import PaymentHistory from "../components/MySubscription/InvoiceHistory";
import CancelDialog from "../components/MySubscription/CancelDialog";
import TabNavigation from "../components/MySubscription/TabNavigation";
import NoSubscription from "../components/MySubscription/NoSubscription";
import type { Subscription } from "../interfaces/subscription";

import { getSubscriptionData, cancelSubscription } from "../services/subscriptionService";

import { useAuth } from "@/user/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState<"details" | "payments">("details");
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await getSubscriptionData();
        setSubscription(response.data);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchSubscriptionData();
  }, []);

  if (loading) {
    return <div className="flex justify-center align-middle">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!subscription) {
    return <div>
        <NoSubscription />
    </div>;
  }

  const payments = subscription?.payments || [];

  const handleCancelSubscription = async () => {
    try {
      const response = await cancelSubscription(subscription.id);
      if (response.status === "success") {
        setSubscription(null);
        alert("Suscripción cancelada exitosamente.");
      } else {
        alert("Hubo un problema al cancelar la suscripción.");
      }
    } catch (error) {
      console.error("Error cancelando la suscripción:", error);
      alert("Ocurrió un error al cancelar la suscripción.");
    }
    setShowCancelDialog(false);
  };

  const handleChangePlan = () => {
    alert("Funcionalidad aun no disponible");
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl bg-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#0c154c]">Mi Suscripción</h1>
        <div className="flex items-center gap-2">
          <StatusBadge status={subscription.status} />
        </div>
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {activeTab === "details" && (
        <>
          <PlanDetails plan={subscription.plan} />

          <div className="grid gap-6 md:grid-cols-2">
            <SubscriptionInfo subscription={subscription} />
            <NextPayment subscription={subscription} />
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={() => setShowCancelDialog(true)}
              className="px-4 py-2 border border-[#1d4ed8] rounded-md text-sm font-medium text-[#1d4ed8] hover:bg-[#eff6ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8]"
            >
              Cancelar suscripción
            </button>
            <button 
            onClick={handleChangePlan}
            className="px-4 py-2 bg-[#1d4ed8] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#0c154c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8]" 
            >
              Cambiar plan
            </button>
          </div>
        </>
      )}

      {activeTab === "payments" && (
        <PaymentHistory payments={payments} planName={subscription.plan.name} />
      )}

      <CancelDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelSubscription}
      />
    </div>
  );
}
