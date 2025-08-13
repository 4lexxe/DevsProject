import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import DetailForm from "../components/DetailForm/DetailForm";
import { userData } from "../services/userService";
import { getPlanById } from "../services/planService";
import { useAuth } from "@/user/contexts/AuthContext";
import { useParams } from "react-router-dom";
function DetailsFormPage() {
    const { id } = useParams();
    const [userD, setUser] = useState(null);
    const [planD, setPlan] = useState(null);
    const [error, setError] = useState(null);
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
        return _jsx("div", { children: "Cargando datos..." });
    }
    if (error) {
        return _jsx("div", { children: "Error al cargar los datos..." });
    }
    return (_jsx("main", { children: _jsx(DetailForm, { userData: userD, planData: {
                id: planD.id,
                name: planD.name,
                description: planD.description,
                installments: planD.installments,
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
            } }) }));
}
export default DetailsFormPage;
