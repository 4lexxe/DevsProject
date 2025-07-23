
import api from "@/shared/api/axios";
import { useState } from 'react';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { useParams } from "react-router-dom";
import { useAuth } from "@/user/contexts/AuthContext";

const public_key = import.meta.env.VITE_PUBLIC_KEY || "";

// Inicializar MercadoPago con configuración de idioma español
initMercadoPago(public_key, {
  locale: 'es-AR', // Español Argentina
  advancedFraudPrevention: true, // Habilitar prevención de fraude avanzada
});

export default function CardFormPage() {
  //Correpondiente al id del plan seleccionado
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  

  // Configuración de inicialización del brick
  const initialization = {
    amount: 2000, // Monto a cobrar en centavos
  };

  // Configuración de personalización para suscripciones
  const customization = {
    paymentMethods: {
      maxInstallments: 1, // Solo pago de contado
      creditCard: "all",
      debitCard: "all",
    },
    visual: {
      style: {
        theme: 'default'
      },
      // Forzar que aparezca el campo CVV
      hideFormTitle: false,
    },
    // Configuración específica para tokens de suscripción
    callbacks: {
      onFormMounted: (error: any) => {
        if (error) console.error('Error mounting form:', error);
        console.log('Form mounted for subscription');
      }
    }
  };

  // Callback cuando el brick está listo
  const onReady = () => {
    setError("");
    console.log("CardPayment brick está listo");
  };

  // Callback cuando se envía el formulario
  const onSubmit = async (formData: any) => {
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Datos del formulario:", formData);
      
      /* const paymentData = {
        token: formData.token,
        issuer_id: formData.issuer_id,
        payment_method_id: formData.payment_method_id,
        transaction_amount: formData.transaction_amount,
        installments: formData.installments || 1,
        payer: {
          email: formData.payer?.email || "test@mercadopago.com",
          identification: formData.payer?.identification
        }
      }; */

      /* const response = await api.post("/suscriptions", {formData, planId: id, userId: user?.id}); */
      const response = await api.post("/mercadopago/checkout", {formData, planId: id, userId: user?.id});
      
      console.log("Respuesta del backend:", response.data);
      setPaymentResult(response.data);
      
    } catch (error: any) {
      console.error("Error al procesar el pago:", error);
      const errorMessage = error.response?.data?.message || "Error al procesar el pago";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback para manejar errores
  const onError = (error: any) => {
    console.error("Error en CardPayment brick:", error);
    setError("Error en el formulario de pago. Por favor, intente nuevamente.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Procesar Pago
          </h1>
          <p className="text-gray-600">
            Complete los datos de su tarjeta para procesar el pago
          </p>
        </div>

        {/* Información del pago */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">Monto a pagar:</span>
            <span className="text-blue-900 font-bold text-xl">
              ${(initialization.amount / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Formulario de pago */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          {public_key ? (
            <CardPayment
              initialization={initialization}
              customization={customization}
              onReady={onReady}
              onSubmit={onSubmit}
              onError={onError}
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-red-600 font-medium">
                ❌ Error de configuración: PUBLIC_KEY no está definido
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Verifique la configuración de las variables de entorno
              </p>
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800 font-medium">
                Procesando pago...
              </span>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <span className="text-red-800 font-medium">Error:</span>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success result */}
        {paymentResult && paymentResult.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">✅</span>
              <span className="text-green-800 font-medium">¡Pago exitoso!</span>
            </div>
            <div className="text-green-700 text-sm ml-8">
              <p><strong>ID de pago:</strong> {paymentResult.id}</p>
              <p><strong>Estado:</strong> {paymentResult.status}</p>
              <p><strong>Monto:</strong> ${paymentResult.transaction_amount}</p>
              {paymentResult.payment_method_id && (
                <p><strong>Método de pago:</strong> {paymentResult.payment_method_id}</p>
              )}
            </div>
          </div>
        )}

        {/* Rejected payment */}
        {paymentResult && paymentResult.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">❌</span>
              <span className="text-red-800 font-medium">Pago rechazado</span>
            </div>
            <div className="text-red-700 text-sm ml-8">
              <p><strong>Motivo:</strong> {paymentResult.status_detail}</p>
              <p className="mt-2">Por favor, verifique los datos de su tarjeta e intente nuevamente.</p>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="text-center text-gray-500 text-sm mt-8 space-y-2">
          <p>🔒 Pagos seguros procesados por MercadoPago</p>
          <p>Sus datos están protegidos con encriptación SSL</p>
          <div className="flex justify-center space-x-6 mt-4">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">💳 Visa</span>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">💳 Mastercard</span>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">💳 American Express</span>
          </div>
        </div>
      </div>
    </div>
  );
}


