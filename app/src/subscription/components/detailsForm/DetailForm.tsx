"use client"
import { useForm } from "react-hook-form"
import { useState } from "react"
import CustomInput from "@/shared/components/inputs/CustomInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema } from "@/subscription/validations/userSchema"
import { editUser } from "@/subscription/services/userService"
import api from "@/shared/api/axios"

interface DetailFormProps {
  userData: {
    id: string;
    name: string;
    surname: string;
    email: string;
    identificationNumber: string;
    identificationType: "CUIT" | "CUIL" | "DNI";
  };
  planData: {
    id: number;
    name: string;
    description: string;
    installments: number;
    installmentPrice: string;
    discount?: {
      value: number;
      event: string;
    };
    totalPrice: string;
    duration: number;
    durationType: string;
    accessLevel: "Básico" | "Estándar" | "Premium";
  };
}
export default function SubscriptionFormPage({ userData, planData }: DetailFormProps){
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DetailFormProps["userData"]>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      identificationNumber: userData.identificationNumber,
      identificationType: userData.identificationType,
    },
    mode: "onChange", // Validación en tiempo real
  })

  const formatCurrency = (amount: string): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(amount))
  }

  const calculateDiscountedPrice = (price: string, discount?: { value: number }): number => {
    const originalPrice = Number(price)
    if (discount) {
      return originalPrice - (originalPrice * discount.value) / 100
    }
    return originalPrice
  }
  
  const onSubmit = async (data: DetailFormProps["userData"]) => {
    setIsSubmitting(true)
    console.log("Datos del usuario:", data)
    try {
      // Editar usuario con los datos del formulario
      const response = await editUser(userData.id, {userId: userData.id, ...data});
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
          } else {
            throw new Error(subscriptionResponse.data.message || "Error al crear la suscripción");
          }

        } catch (subscriptionError: any) {
          console.error("Error al crear la suscripción:", subscriptionError);
          const errorMessage = subscriptionError.response?.data?.message || subscriptionError.message || "Error desconocido";
          alert(`Usuario actualizado, pero hubo un error al crear la suscripción: ${errorMessage}`);
        }
      } else {
        throw new Error(response.message || "Error al actualizar el usuario");
      }

      // Simular llamada a API (remover esta línea si no es necesaria)
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error("Error al procesar:", error)
      alert("Error al procesar la solicitud. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const discountedPrice = calculateDiscountedPrice(planData.totalPrice, planData.discount)

  return (
    <div className="min-h-screen bg-[#eff6ff] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Información del Plan */}
        <div className="bg-white rounded-lg shadow-sm border border-[#42d7c7] mb-8">
          <div className="p-6 border-b border-[#eff6ff]">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[#0c154c] mb-2">{planData.name}</h1>
                <p className="text-gray-600 text-sm">{planData.description}</p>
              </div>
              <div className="bg-[#0c154c] text-white px-3 py-1 rounded-full text-sm font-medium">
                {planData.accessLevel}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Precio</p>
                {planData.discount ? (
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-[#0c154c]">{formatCurrency(discountedPrice.toString())}</p>
                    <span className="text-sm line-through text-gray-500">{formatCurrency(planData.totalPrice)}</span>
                    <span className="bg-[#42d7c7] text-[#0c154c] text-xs font-medium px-2 py-1 rounded-full">
                      {planData.discount.value}% OFF
                    </span>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-[#0c154c]">{formatCurrency(planData.totalPrice)}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Duración</p>
                <p className="text-lg font-medium text-[#0c154c]">
                  {planData.duration} {planData.durationType}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Cuotas</p>
                <p className="text-lg font-medium text-[#0c154c]">
                  {planData.installments} cuota{planData.installments > 1 ? "s" : ""} de{" "}
                  {formatCurrency(planData.installmentPrice)}
                </p>
              </div>
            </div>

            {planData.discount && (
              <div className="mt-4 p-3 bg-[#f0fdfa] border border-[#42d7c7] rounded-md">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#42d7c7] mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                  <p className="text-sm font-medium text-[#0c154c]">{planData.discount.event}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formulario de Datos Adicionales */}
        <div className="bg-white rounded-lg shadow-sm border border-[#eff6ff]">
          <div className="p-6 border-b border-[#eff6ff]">
            <h2 className="text-xl font-semibold text-[#0c154c]">Datos Adicionales</h2>
            <p className="text-sm text-gray-600 mt-1">
              Completa o verifica tus datos para continuar con la suscripción
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Nombre */}
              <div>
                <CustomInput
                  name="name"
                  labelText="Nombre *"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  register={register}
                  error={errors.name?.message}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Asegurate de ingresar tu nombre real tal como aparece en tu documento de identidad.
                </p>
              </div>


              {/* Apellido */}
              <div>
                <CustomInput
                  name="surname"
                  labelText="Apellido *"
                  type="text"
                  placeholder="Ingresa tu apellido"
                  register={register}
                  error={errors.surname?.message}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Asegurate de ingresar tu apellido real tal como aparece en tu documento de identidad.
                </p>
              </div>

               {/* Email */}
              <div className="md:col-span-2">
                <CustomInput
                  name="email"
                  labelText="Email *"
                  type="email"
                  placeholder="Ingresa un email válido"
                  register={register}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                />
              </div>

              {/* type de Documento */}
              <div>
                <label htmlFor="identificationType" className="block text-sm font-medium text-[#0c154c] mb-2">
                  Tipo de Documento *
                </label>
                <select
                  id="identificationType"
                  {...register("identificationType", {
                    required: "El tipo de documento es requerido",
                  })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent ${
                    errors.identificationType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="DNI">DNI</option>
                  <option value="CUIT">CUIT</option>
                  <option value="CUIL">CUIL</option>
                </select>
                {errors.identificationType && <p className="text-red-500 text-sm mt-1">{errors.identificationType.message}</p>}
              </div>


              {/* Número de Documento */}
              <div>
                <CustomInput
                  name="identificationNumber"
                  labelText="Número de Documento *"
                  type="text"
                  placeholder="Ingresa tu número de documento"
                  register={register}
                  error={errors.identificationNumber?.message}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Texto aclaratorio final */}
            <div className="mt-6 p-4 bg-[#f8f9fa] border border-[#dee2e6] rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-medium">📋 Recordá:</span> Todos los datos ingresados deben ser reales y coincidir
                con tu información en Mercado Pago para que la suscripción se procese correctamente. Una vez confirmada
                la suscripción, estos datos no podrán modificarse.
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-[#eff6ff]">
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8]"
              >
                Restablecer
              </button>
              <button
                type="submit"
                onClick={() => handleSubmit(onSubmit)()}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8] ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#1d4ed8] hover:bg-[#0c154c]"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </div>
                ) : (
                  "Continuar con la Suscripción"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
