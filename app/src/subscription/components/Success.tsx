"use client"
import { CheckCircle } from "lucide-react"

interface SubscriptionSuccessProps {
  userName?: string
  planName?: string
  nextBillingDate?: string
  amount?: string
}

export default function SubscriptionSuccess({
  userName = "Usuario",
  planName = "Premium",
  nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  amount = "$9.99",
}: SubscriptionSuccessProps) {
  return (
    <div className="min-h-screen  from-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-[#eff6ff] rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-[#42d7c7]" />
          </div>

          <h1 className="text-2xl font-bold text-[#0c154c] mb-2">¡Agradecemos tu suscripción!</h1>

          <p className="text-[#1d4ed8] mb-6">
            Hola {userName}, tu suscripción al plan {planName} ha sido procesada con éxito.
          </p>

          <div className="bg-[#eff6ff] rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{planName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Próximo cobro:</span>
              <span className="font-medium">{nextBillingDate}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Hemos enviado un correo electrónico con los detalles de tu suscripción.
          </p>

          <div className="flex flex-col gap-3">
            <button
              className="w-full py-3 px-4 bg-[#1d4ed8] hover:bg-[#0c154c] text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              onClick={() => (window.location.href = "/")}
            >
              <span>Volver al Inicio</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

