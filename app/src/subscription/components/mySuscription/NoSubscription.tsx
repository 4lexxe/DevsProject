import {Link} from "react-router-dom"

export default function NoSubscription() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-4xl">
      <div className="bg-white rounded-lg border border-[#eff6ff] shadow-sm p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-[#eff6ff] p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#1d4ed8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#0c154c] mb-4">No tienes una suscripción activa</h2>

        <p className="text-gray-600 mb-8">
          Suscríbete a uno de nuestros planes para acceder a todas las funcionalidades premium y mejorar tu experiencia.
        </p>

        <Link
          to="/plans"
          className="inline-flex items-center px-6 py-3 bg-[#1d4ed8] border border-transparent rounded-md text-base font-medium text-white hover:bg-[#0c154c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Ver planes disponibles
        </Link>
      </div>
    </div>
  )
}

