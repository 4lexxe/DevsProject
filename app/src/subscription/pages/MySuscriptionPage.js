"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import StatusBadge from "../components/MySubscription/StatusBadge";
import PlanDetails from "../components/MySubscription/PlanDetail";
import SubscriptionInfo from "../components/MySubscription/SubscriptionInfo";
import NextPayment from "../components/MySubscription/NextPayment";
import PaymentHistory from "../components/MySubscription/InvoiceHistory";
import CancelDialog from "../components/MySubscription/CancelDialog";
import TabNavigation from "../components/MySubscription/TabNavigation";
import NoSubscription from "../components/MySubscription/NoSubscription";
import { getSubscriptionData, cancelSubscription } from "../services/subscriptionService";
import { useAuth } from "@/user/contexts/AuthContext";
import { Navigate } from "react-router-dom";
export default function SubscriptionPage() {
    const [activeTab, setActiveTab] = useState("details");
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const { user, loading } = useAuth();
    useEffect(() => {
        const fetchSubscriptionData = async () => {
            try {
                const response = await getSubscriptionData();
                setSubscription(response.data);
            }
            catch (error) {
                console.error("Error fetching subscription data:", error);
            }
        };
        fetchSubscriptionData();
    }, []);
    if (loading) {
        return _jsx("div", { className: "flex justify-center align-middle", children: "Cargando..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (!subscription) {
        return _jsx("div", { children: _jsx(NoSubscription, {}) });
    }
    const payments = subscription?.payments || [];
    const handleCancelSubscription = async () => {
        try {
            const response = await cancelSubscription(subscription.id);
            if (response.status === "success") {
                setSubscription(null);
                alert("Suscripción cancelada exitosamente.");
            }
            else {
                alert("Hubo un problema al cancelar la suscripción.");
            }
        }
        catch (error) {
            console.error("Error cancelando la suscripción:", error);
            alert("Ocurrió un error al cancelar la suscripción.");
        }
        setShowCancelDialog(false);
    };
    const handleChangePlan = () => {
        alert("Funcionalidad aun no disponible");
    };
    return (_jsxs("div", { className: "container mx-auto py-10 px-4 max-w-7xl bg-white", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-[#0c154c]", children: "Mi Suscripci\u00F3n" }), _jsx("div", { className: "flex items-center gap-2", children: _jsx(StatusBadge, { status: subscription.status }) })] }), _jsx(TabNavigation, { activeTab: activeTab, onTabChange: (tab) => setActiveTab(tab) }), activeTab === "details" && (_jsxs(_Fragment, { children: [_jsx(PlanDetails, { plan: subscription.plan }), _jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsx(SubscriptionInfo, { subscription: subscription }), _jsx(NextPayment, { subscription: subscription })] }), _jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-4 justify-end", children: [_jsx("button", { onClick: () => setShowCancelDialog(true), className: "px-4 py-2 border border-[#1d4ed8] rounded-md text-sm font-medium text-[#1d4ed8] hover:bg-[#eff6ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8]", children: "Cancelar suscripci\u00F3n" }), _jsx("button", { onClick: handleChangePlan, className: "px-4 py-2 bg-[#1d4ed8] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#0c154c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8]", children: "Cambiar plan" })] })] })), activeTab === "payments" && (_jsx(PaymentHistory, { payments: payments, planName: subscription.plan.name })), _jsx(CancelDialog, { isOpen: showCancelDialog, onClose: () => setShowCancelDialog(false), onConfirm: handleCancelSubscription })] }));
}
