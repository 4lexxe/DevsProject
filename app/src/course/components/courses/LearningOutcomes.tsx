import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface LearningOutcomesProps {
  outcomes: string[];
}

const LearningOutcomes: React.FC<LearningOutcomesProps> = ({ outcomes }) => {
  const [showAll, setShowAll] = useState(false); // Estado para controlar si se muestra todo el contenido
  const maxVisibleItemsMobile = 6; // Número máximo de elementos a mostrar inicialmente en dispositivos móviles

  // Dividir los resultados en dos partes: visibles y ocultos
  const visibleOutcomes = outcomes.slice(0, showAll ? outcomes.length : maxVisibleItemsMobile);
  const hiddenOutcomes = outcomes.slice(maxVisibleItemsMobile);

  // Detectar el modo (móvil o PC) usando useEffect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowAll(true); // En modo PC, mostrar todo el contenido
      } else {
        setShowAll(false); // En modo móvil, ocultar el contenido adicional
      }
    };

    // Ejecutar al cargar el componente
    handleResize();

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Limpiar el listener al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#1a1f36]">Lo que aprenderás</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Contenido visible */}
        {visibleOutcomes.map((outcome, index) => (
          <div key={index} className="flex items-start space-x-3 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <p className="text-[#1a1f36] text-sm word-break break-all leading-relaxed min-w-0 flex-1">{outcome}</p>
          </div>
        ))}

        {/* Botón "Ver más" para dispositivos móviles */}
        {!showAll && hiddenOutcomes.length > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 text-sm font-medium hover:underline focus:outline-none block lg:hidden"
          >
            Ver más
          </button>
        )}
        {/* Contenido oculto (solo visible cuando se hace clic en "Ver más") */}
        {showAll &&
          hiddenOutcomes.map((outcome, index) => (
            <div key={index + maxVisibleItemsMobile} className="flex items-start space-x-3 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-[#1a1f36] text-sm word-break break-all leading-relaxed min-w-0 flex-1">{outcome}</p>
            </div>
          ))}
                  {/* Botón "Cerrar" para dispositivos móviles */}
        {showAll && hiddenOutcomes.length > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="text-red-600 text-sm font-medium hover:underline focus:outline-none block lg:hidden"
          >
            Cerrar
          </button>
        )}
      </div>
    </section>
  );
};

export default LearningOutcomes;