"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CustomInput from "@/shared/components/inputs/CustomInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/subscription/validations/userSchema";
import { editUser } from "@/subscription/services/userService";
import api from "@/shared/api/axios";
export default function SubscriptionFormPage({ userData, planData }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Configuración de react-hook-form
    const { register, handleSubmit, formState: { errors }, reset, } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            identificationNumber: userData.identificationNumber,
            identificationType: userData.identificationType,
        },
        mode: "onChange", // Validación en tiempo real
    });
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(Number(amount));
    };
    const calculateDiscountedPrice = (price, discount) => {
        const originalPrice = Number(price);
        if (discount) {
            return originalPrice - (originalPrice * discount.value) / 100;
        }
        return originalPrice;
    };
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        console.log("Datos del usuario:", data);
        try {
            // Editar usuario con los datos del formulario
            const response = await editUser(userData.id, { userId: userData.id, ...data });
            console.log("Respuesta de editUser:", response);
            // Verificar si la API devolvió success
            if (response.status === "success") {
                try {
                    // Hacer POST a /api/subscription con los datos necesarios usando axios
                    console.log(planData);
                    const subscriptionResponse = await api.post("/subscriptions", {
                        userId: userData.id,
                        planId: planData.id,
                        payerEmail: response.user.email,
                    });
                    console.log("Respuesta de suscripción:", subscriptionResponse.data);
                    if (subscriptionResponse.data.status === "success") {
                        alert("¡Suscripción creada exitosamente!");
                        // Aquí podrías redirigir a una página de éxito o siguiente paso
                        window.location.href = subscriptionResponse.data.data.initPoint;
                    }
                    else {
                        throw new Error(subscriptionResponse.data.message || "Error al crear la suscripción");
                    }
                }
                catch (subscriptionError) {
                    console.error("Error al crear la suscripción:", subscriptionError);
                    const errorMessage = subscriptionError.response?.data?.message || subscriptionError.message || "Error desconocido";
                    alert(`Usuario actualizado, pero hubo un error al crear la suscripción: ${errorMessage}`);
                }
            }
            else {
                throw new Error(response.message || "Error al actualizar el usuario");
            }
            // Simular llamada a API (remover esta línea si no es necesaria)
            // await new Promise((resolve) => setTimeout(resolve, 2000))
        }
        catch (error) {
            console.error("Error al procesar:", error);
            alert("Error al procesar la solicitud. Por favor, intenta nuevamente.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const discountedPrice = calculateDiscountedPrice(planData.totalPrice, planData.discount);
    return (_jsx("div", { className: "min-h-screen bg-[#eff6ff] py-8 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-[#42d7c7] mb-8", children: [_jsx("div", { className: "p-6 border-b border-[#eff6ff]", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-[#0c154c] mb-2", children: planData.name }), _jsx("p", { className: "text-gray-600 text-sm", children: planData.description })] }), _jsx("div", { className: "bg-[#0c154c] text-white px-3 py-1 rounded-full text-sm font-medium", children: planData.accessLevel })] }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Precio" }), planData.discount ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-xl font-bold text-[#0c154c]", children: formatCurrency(discountedPrice.toString()) }), _jsx("span", { className: "text-sm line-through text-gray-500", children: formatCurrency(planData.totalPrice) }), _jsxs("span", { className: "bg-[#42d7c7] text-[#0c154c] text-xs font-medium px-2 py-1 rounded-full", children: [planData.discount.value, "% OFF"] })] })) : (_jsx("p", { className: "text-xl font-bold text-[#0c154c]", children: formatCurrency(planData.totalPrice) }))] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Duraci\u00F3n" }), _jsxs("p", { className: "text-lg font-medium text-[#0c154c]", children: [planData.duration, " ", planData.durationType] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Cuotas" }), _jsxs("p", { className: "text-lg font-medium text-[#0c154c]", children: [planData.installments, " cuota", planData.installments > 1 ? "s" : "", " de", " ", formatCurrency(planData.installmentPrice)] })] })] }), planData.discount && (_jsx("div", { className: "mt-4 p-3 bg-[#f0fdfa] border border-[#42d7c7] rounded-md", children: _jsxs("div", { className: "flex items-center", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-[#42d7c7] mr-2", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" }), _jsx("line", { x1: "7", y1: "7", x2: "7.01", y2: "7" })] }), _jsx("p", { className: "text-sm font-medium text-[#0c154c]", children: planData.discount.event })] }) }))] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-[#eff6ff]", children: [_jsxs("div", { className: "p-6 border-b border-[#eff6ff]", children: [_jsx("h2", { className: "text-xl font-semibold text-[#0c154c]", children: "Datos Adicionales" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Completa o verifica tus datos para continuar con la suscripci\u00F3n" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(CustomInput, { name: "name", labelText: "Nombre *", type: "text", placeholder: "Ingresa tu nombre", register: register, error: errors.name?.message, disabled: isSubmitting }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "\u26A0\uFE0F Asegurate de ingresar tu nombre real tal como aparece en tu documento de identidad." })] }), _jsxs("div", { children: [_jsx(CustomInput, { name: "surname", labelText: "Apellido *", type: "text", placeholder: "Ingresa tu apellido", register: register, error: errors.surname?.message, disabled: isSubmitting }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "\u26A0\uFE0F Asegurate de ingresar tu apellido real tal como aparece en tu documento de identidad." })] }), _jsx("div", { className: "md:col-span-2", children: _jsx(CustomInput, { name: "email", labelText: "Email *", type: "email", placeholder: "Ingresa un email v\u00E1lido", register: register, error: errors.email?.message, disabled: isSubmitting }) }), _jsxs("div", { children: [_jsx("label", { htmlFor: "identificationType", className: "block text-sm font-medium text-[#0c154c] mb-2", children: "Tipo de Documento *" }), _jsxs("select", { id: "identificationType", ...register("identificationType", {
                                                        required: "El tipo de documento es requerido",
                                                    }), className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent ${errors.identificationType ? "border-red-500" : "border-gray-300"}`, children: [_jsx("option", { value: "DNI", children: "DNI" }), _jsx("option", { value: "CUIT", children: "CUIT" }), _jsx("option", { value: "CUIL", children: "CUIL" })] }), errors.identificationType && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.identificationType.message })] }), _jsx("div", { children: _jsx(CustomInput, { name: "identificationNumber", labelText: "N\u00FAmero de Documento *", type: "text", placeholder: "Ingresa tu n\u00FAmero de documento", register: register, error: errors.identificationNumber?.message, disabled: isSubmitting }) })] }), _jsx("div", { className: "mt-6 p-4 bg-[#f8f9fa] border border-[#dee2e6] rounded-md", children: _jsxs("p", { className: "text-sm text-gray-700", children: [_jsx("span", { className: "font-medium", children: "\uD83D\uDCCB Record\u00E1:" }), " Todos los datos ingresados deben ser reales y coincidir con tu informaci\u00F3n en Mercado Pago para que la suscripci\u00F3n se procese correctamente. Una vez confirmada la suscripci\u00F3n, estos datos no podr\u00E1n modificarse."] }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-[#eff6ff]", children: [_jsx("button", { type: "button", onClick: () => reset(), className: "px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8]", children: "Restablecer" }), _jsx("button", { type: "submit", onClick: () => handleSubmit(onSubmit)(), disabled: isSubmitting, className: `px-6 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8] ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#1d4ed8] hover:bg-[#0c154c]"}`, children: isSubmitting ? (_jsxs("div", { className: "flex items-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Procesando..."] })) : ("Continuar con la Suscripción") })] })] })] })] }) }));
}
