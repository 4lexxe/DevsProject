import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WaveDivider from '@/shared/components/WaveDivider';
import FontelloIcon from '@/shared/components/icons/FontelloIcon';

const features = [
  {
    id: 1,
    title: 'Organiza Tus Materias',
    description: 'Accede a tus cursos, materiales y recursos en un solo lugar.',
    icon: 'icon-folder',
  },
  {
    id: 2,
    title: 'Comunidad Activa',
    description: 'Encuentra apuntes compartidos por estudiantes de todo el país.',
    icon: 'icon-users',
  },
  {
    id: 3,
    title: 'Compra y Venta de Materiales',
    description: 'Vende o compra libros, apuntes y herramientas que necesitas.',
    icon: 'icon-basket',
  },
  {
    id: 4,
    title: 'Aprendizaje Personalizado',
    description: 'Rutas de aprendizaje adaptadas a tu nivel y objetivos.',
    icon: 'icon-book',
  },
  {
    id: 5,
    title: 'Contenido Actualizado',
    description: 'Materiales y cursos actualizados constantemente por expertos.',
    icon: 'icon-update',
  },
  {
    id: 6,
    title: 'Soporte 24/7',
    description: 'Asistencia técnica y académica disponible en todo momento.',
    icon: 'icon-help',
  },
  {
    id: 7,
    title: 'Certificados Válidos',
    description: 'Obtén certificaciones reconocidas al completar tus cursos.',
    icon: 'icon-certificate',
  },
  {
    id: 8,
    title: 'Acceso Móvil',
    description: 'Estudia desde cualquier dispositivo, en cualquier momento.',
    icon: 'icon-mobile',
  },
  {
    id: 9,
    title: 'Foros de Discusión',
    description: 'Interactúa con otros estudiantes y resuelve dudas en comunidad.',
    icon: 'icon-chat',
  },
  {
    id: 10,
    title: 'Proyectos Prácticos',
    description: 'Aplica lo aprendido con proyectos reales y casos de estudio.',
    icon: 'icon-code',
  },
  {
    id: 11,
    title: 'Mentorías Personalizadas',
    description: 'Recibe guía de mentores expertos en tu área de interés.',
    icon: 'icon-graduation-cap',
  },
  {
    id: 12,
    title: 'Biblioteca Digital',
    description: 'Accede a miles de recursos, libros y materiales de estudio.',
    icon: 'icon-library',
  },
  {
    id: 13,
    title: 'Gamificación',
    description: 'Aprende de forma divertida con logros, badges y rankings.',
    icon: 'icon-trophy',
  },
];

// Iconos SVG de fallback para cada característica
const getFallbackIcon = (id: number) => {
  const icons: { [key: number]: JSX.Element } = {
    1: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
    2: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    3: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
    4: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    5: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    6: <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />,
    7: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    8: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    9: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    10: <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    11: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    12: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    13: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
  };
  return icons[id] || icons[1];
};

export default function Features() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < features.length - slidesToShow) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Volver al inicio
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(features.length - slidesToShow); // Ir al final
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const maxSlides = Math.max(0, features.length - slidesToShow);

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < features.length - slidesToShow) {
          return prevIndex + 1;
        } else {
          return 0; // Volver al inicio
        }
      });
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [slidesToShow]);

  return (
    <section className="relative bg-gray-50 py-20 sm:py-24 lg:py-28 overflow-hidden">
      {/* Wave divider superior */}
      <WaveDivider position="top" color="#ffffff" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-gray-900 mb-4 tracking-tight">
            Nuestras Características
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto"></div>
        </motion.div>

        {/* Carrusel */}
        <div className="relative">
          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 lg:p-3 transition-all duration-200 -translate-x-1/2"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 lg:p-3 transition-all duration-200 translate-x-1/2"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
          </button>

          {/* Contenedor del carrusel */}
          <div className="overflow-hidden relative">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
              }}
            >
              {features.map((feature) => (
                <div 
                  key={feature.id} 
                  className={`flex-none px-3 sm:px-4 ${
                    slidesToShow === 1 ? 'w-full' : 
                    slidesToShow === 2 ? 'w-1/2' : 'w-1/3'
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="group relative flex flex-col items-center text-center h-full"
                  >
                    {/* Icon Container - Minimalista */}
                    <div className="mb-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-gray-400 group-hover:text-gray-700 transition-colors duration-500">
                        <FontelloIcon 
                          name={feature.icon} 
                          className="text-5xl sm:text-6xl"
                          fallback={
                            <svg 
                              className="w-16 h-16 sm:w-20 sm:h-20 text-current"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              strokeWidth={1}
                            >
                              {getFallbackIcon(feature.id)}
                            </svg>
                          }
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-4 group-hover:text-gray-800 transition-colors tracking-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xs mx-auto font-light">
                      {feature.description}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de puntos */}
          {features.length > slidesToShow && (
            <div className="flex justify-center mt-8 sm:mt-10 space-x-2">
              {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-gray-700 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wave divider inferior */}
      <WaveDivider position="bottom" color="#ffffff" />
    </section>
  );
}
