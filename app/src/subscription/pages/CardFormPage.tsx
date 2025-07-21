
import api from "@/shared/api/axios";

const public_key = import.meta.env.VITE_PUBLIC_KEY || "";


import { useEffect } from 'react';

export function useMercadoPago(src: string) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src]);
}


export default function CardFormPage() {
  useMercadoPago("https://sdk.mercadopago.com/js/v2");

  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.getElementById("cardPaymentBrick_container");
      if (
        typeof window.MercadoPago === "function" &&
        container &&
        public_key
      ) {
        clearInterval(interval);
        const mp = new window.MercadoPago(public_key, {
          locale: "es-AR",
        });

        const bricksBuilder = mp.bricks();

        bricksBuilder
          .create("cardPayment", "cardPaymentBrick_container", {
            initialization: {
              amount: 2000, // 💰 Monto que quieres cobrar
            },
            callbacks: {
              onReady: () => {}, // Callback requerido por el brick
              onSubmit: async (cardFormData: any) => {
                console.log("Datos del formulario de tarjeta:", cardFormData);
                try {
                  const response = await api.post("/mercadopago/checkout", {
                    token: cardFormData.token,
                    paymentMethodId: cardFormData.paymentMethodId,
                    issuerId: cardFormData.issuerId,
                    amount: 2000,
                    email: "test@mail.com", // o tu email dinámico
                  });
                  console.log("Respuesta del backend:", response.data);
                } catch (error) {
                  console.error("Error al enviar al backend:", error);
                }
                return Promise.resolve();
              },
              onError: (error: any) => {
                console.error("Error en Brick:", error);
              },
            },
          })
          .catch((err: any) => {
            console.error("Error al crear el brick:", err);
          });
      } else if (!public_key) {
        clearInterval(interval);
        console.error("Mercado Pago PUBLIC_KEY no está definido");
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div id="cardPaymentBrick_container"></div>
        </div>
      </div>
    </div>
  );
};
