import { AcademicCapIcon, UsersIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const features = [
  {
    id: 1,
    title: 'Organiza Tus Materias',
    description: 'Accede a tus cursos, materiales y recursos en un solo lugar.',
    icon: <AcademicCapIcon className="h-6 w-6 text-blue-500 mx-auto" />,
  },
  {
    id: 2,
    title: 'Comunidad Activa',
    description: 'Encuentra apuntes compartidos por estudiantes de todo el país.',
    icon: <UsersIcon className="h-6 w-6 text-blue-500 mx-auto" />,
  },
  {
    id: 3,
    title: 'Compra y Venta de Materiales',
    description: 'Vende o compra libros, apuntes y herramientas que necesitas.',
    icon: <ShoppingCartIcon className="h-6 w-6 text-blue-500 mx-auto" />,
  },
];

export default function Features() {
  return (
    <section className="px-2 sm:px-4 py-6 sm:py-8 bg-[#FFFF]">
      <div className="max-w-3xl mx-auto text-center">
        {/* Título y Descripción */}
        <h2 className="mb-2 text-lg sm:text-xl font-bold text-black">
          Diseñado Para Estudiantes Como Tú
        </h2>
        <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-black/80">
          Desde organizar tus materias hasta conectarte con otros estudiantes, 
          nuestra plataforma tiene todo lo que necesitas para avanzar en tu aprendizaje.
        </p>

        {/* Contenedor de las características */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              {/* Ícono */}
              <div className="flex justify-center mb-2">{feature.icon}</div>
              {/* Título */}
              <h3 className="text-base sm:text-lg font-semibold text-black text-center">
                {feature.title}
              </h3>
              {/* Descripción */}
              <p className="mt-1 text-xs sm:text-sm text-black/80 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}