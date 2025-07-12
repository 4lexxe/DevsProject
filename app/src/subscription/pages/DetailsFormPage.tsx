import React, { useEffect, useState } from "react";
import DetailForm from "../components/detailsForm/DetailForm";
import { userData } from "../services/userService";
import { getPlanById } from "../services/planService";
import { useAuth } from "@/user/contexts/AuthContext";
import { useParams } from "react-router-dom";

interface UserData {
  id: string;
  name: string;
  surname: string;
  email: string;
  identificationNumber: string;
  identificationType: "CUIT" | "CUIL" | "DNI";
}

interface DiscountEvent {
  value: number;
  event: string;
}

interface PlanData {
  name: string;
  description: string;
  installment: number;
  installmentPrice: string;
  totalPrice: string;
  duration: number;
  durationType: string;
  accessLevel: "Básico" | "Estándar" | "Premium";
  discountEvent?: DiscountEvent;
  mpSubPlan: {
    initPoint: string; // URL de inicio de la suscripción
  };
}

function DetailsFormPage() {
  const { id } = useParams<{ id: string }>();
  const [userD, setUser] = useState<UserData | null>(null);
  const [planD, setPlan] = useState<PlanData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && id) {
      Promise.all([userData(user.id.toString()), getPlanById(id)])
        .then(([userRes, planRes]) => {
          setUser(userRes);
          setPlan(planRes);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, []);

  if (!userD || !planD) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos...</div>;
  }

  return (
    <main>
      <DetailForm
        userData={userD}
        planData={{
          initPoint: planD.mpSubPlan.initPoint,
          name: planD.name,
          description: planD.description,
          installment: planD.installment,
          installmentPrice: planD.installmentPrice,
          totalPrice: planD.totalPrice,
          duration: planD.duration,
          durationType: planD.durationType,
          accessLevel: planD.accessLevel,
          discount: planD.discountEvent
            ? {
                value: planD.discountEvent.value,
                event: planD.discountEvent.event,
              }
            : undefined,
        }}
      />
    </main>
  );
}

export default DetailsFormPage;
