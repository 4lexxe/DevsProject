import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import MercadoPago from "@/shared/assets/imgs/mercadopago.png";
import { useAuth } from "@/user/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
function MpButton({ plan }) {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const checkout = () => {
        if (loading || isProcessing)
            return;
        setIsProcessing(true);
        setTimeout(() => {
            if (!user) {
                setIsProcessing(false);
                navigate("/register", { replace: true });
                return;
            }
            // Redirige al usuario al punto de inicio de MercadoPago
            navigate(`/subscription/plan/${plan.id}/form/details`, { replace: true });
            // No es necesario setIsProcessing(false) aquí porque la página se redirige
        }, 2000);
    };
    return (_jsx("div", { children: _jsx("button", { onClick: checkout, disabled: loading || isProcessing, className: `w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${plan.accessLevel === "Básico"
                ? "bg-[#42d7c7] hover:bg-[#42d7c7]/90 text-[#0c154c]"
                : plan.accessLevel === "Estándar"
                    ? "bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 text-white"
                    : "bg-[#02ffff] hover:bg-[#02ffff]/90 text-[#0c154c]"} ${loading || isProcessing ? "opacity-50 cursor-not-allowed" : ""}`, children: loading || isProcessing ? (_jsxs("div", { className: "flex items-center", children: [_jsx(Loader2, { size: 24, className: "animate-spin mr-2" }), _jsx("div", { children: "Cargando..." })] })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "mr-4", children: "Pagar con" }), _jsx("img", { src: MercadoPago, alt: "MercadoPago", className: "w-32" })] })) }) }));
}
export default MpButton;
