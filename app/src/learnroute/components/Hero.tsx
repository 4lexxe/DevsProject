import { RocketIcon } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mx-auto">
            <RocketIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          🚀 Domina el Desarrollo Fullstack con PERN / Next.js
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Aprende paso a paso cómo construir aplicaciones web modernas, escalables y eficientes con tecnologías como
          PostgreSQL, Express, React y Node.js (PERN) o Next.js. Desde los fundamentos hasta arquitecturas avanzadas,
          ¡conviértete en un desarrollador fullstack listo para cualquier desafío!
        </p>
      </div>
    </div>
  )
}

