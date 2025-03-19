import { useEffect, useState } from "react";
import MercadoPago from "@/shared/assets/imgs/mercadopago.png";
import { useAuth } from "@/auth/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { postSubscription } from "../../services/subscriptionService";
import { div } from "@tensorflow/tfjs";
import { set } from "react-hook-form";

function MpButton({ plan }: { plan: any }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const checkout = () => {
    if (loading || isProcessing) {
      return;
    }

    setIsProcessing(true);

    const fetchSubscription = async () => {
      try {
        const response = await postSubscription({ planId: plan.id });

        if (!response.data.initPoint) {
          setIsProcessing(false);
          return;
        }
        window.location.href = response.data.initPoint;
        return response;
      } catch (error: any) {

        setMessage(error.response.data.message);
        console.error("Error al crear la suscripción:", error);
        setIsProcessing(false);
      }
    };

    setTimeout(() => {
      if (!user) {
        navigate("/register", { replace: true });
        setIsProcessing(false);
        return;
      }

      fetchSubscription();

      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div>
      { message && <div className="text-red-500 text-sm mb-4">{message}</div>}
      <button
        onClick={checkout}
        disabled={loading || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
          plan.accessLevel === "Básico"
            ? "bg-[#42d7c7] hover:bg-[#42d7c7]/90 text-[#0c154c]"
            : plan.accessLevel === "Estándar"
            ? "bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 text-white"
            : "bg-[#02ffff] hover:bg-[#02ffff]/90 text-[#0c154c]"
        } ${loading || isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading || isProcessing ? (
          <div className="flex items-center">
            <Loader2 size={24} className="animate-spin mr-2" />
            <div>Cargando...</div>
          </div>
        ) : (
          <>
            <p className="mr-4">Pagar con</p>
            <img src={MercadoPago} alt="MercadoPago" className="w-32" />
          </>
        )}
      </button>
    </div>
  );
}

export default MpButton;
