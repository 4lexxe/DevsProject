import FeatureCard from './FeatureCard';

const features = [
  {
    id: 1,
    title: 'Organiza Tus Materias',
    description: 'Accede a tus cursos, materiales y recursos en un solo lugar.',
  },
  {
    id: 2,
    title: 'Comunidad Activa',
    description: 'Encuentra apuntes compartidos por estudiantes de todo el país.',
  },
  {
    id: 3,
    title: 'Compra y Venta de Materiales',
    description: 'Vende o compra libros, apuntes y herramientas que necesitas.',
  },
];

export default function Features() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 bg-[D1D1D1]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-black">
          Diseñado Para Estudiantes Como Tú
        </h2>
        <p className="mb-8 sm:mb-12 text-sm sm:text-base text-black/80">
          Desde organizar tus materias hasta conectarte con otros estudiantes, 
          nuestra plataforma tiene todo lo que necesitas para avanzar en tu aprendizaje.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

