import { CheckCircle2, Target, Users } from "lucide-react"

export default function RoadmapDescription() {
  const features = [
    "Backend con Node.js y Express: Aprende a crear APIs RESTful, manejar autenticación, middleware y optimizar consultas con PostgreSQL y Sequelize.",
    "Frontend con React o Next.js: Construye interfaces dinámicas y optimizadas para SEO, utilizando SSR (Server-Side Rendering) y CSR (Client-Side Rendering).",
    "Bases de Datos con PostgreSQL: Domina consultas SQL, relaciones, transacciones y la integración con tu backend.",
    "Autenticación y Seguridad: Implementa autenticación con JWT, OAuth y mejores prácticas de seguridad en aplicaciones web.",
    "Despliegue y Escalabilidad: Aprende a desplegar tu aplicación en plataformas como Vercel, Railway o AWS, configurando entornos en producción.",
  ]

  const audience = [
    "Desarrolladores que quieren aprender fullstack desde cero.",
    "Programadores frontend que buscan profundizar en el backend.",
    "Backend developers que quieren mejorar en React o Next.js.",
    "Cualquier persona interesada en crear aplicaciones modernas y escalables.",
  ]
 
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">¿Qué aprenderás?</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Este roadmap está diseñado para guiarte en el camino hacia convertirte en un desarrollador fullstack experto
            en PERN o Next.js. A lo largo del proceso, explorarás:
          </p>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">¿Para quién es este roadmap?</h2>
          </div>
          <ul className="space-y-3">
            {audience.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="text-blue-600"></span>
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center pt-8">
          <p className="text-xl font-semibold text-blue-600">
             ¡Empieza tu viaje hacia el desarrollo fullstack ahora!
          </p>
        </div>
      </div>
    </div>
  )
}

