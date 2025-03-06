import React, { useEffect, useState } from 'react';
import CarouselButton from './CarouselButton';
import HeroContent from './HeroContent';
import { getHeaderSections } from '../../services/headerSectionServices';

interface HeaderSection {
  image: string;
  title: string;
  slogan: string;
  about: string;
  buttonName: string;
  buttonLink: string;
}

export default function Hero() {
  const [headerSections, setHeaderSections] = useState<HeaderSection[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHeaderSections = async () => {
      try {
        const sections = await getHeaderSections();
        if(sections) setHeaderSections(sections);
        else return
      } catch (error) {
        console.error('Error al obtener las secciones de encabezado:', error);
      }
    };

    fetchHeaderSections();
  }, []);

  useEffect(() => {
    if (headerSections.length === 0) return; // 🔹 Evita cálculos si no hay datos
  
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headerSections.length);
    }, 5000);
  
    return () => clearInterval(interval);
  }, [currentIndex, headerSections.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + headerSections.length) % headerSections.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % headerSections.length);
  };

  if (headerSections.length === 0) {
    return (
      <div className="relative h-[450px] sm:h-[525px] md:h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-800" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="absolute inset-0 grain-overlay" />
        
        <div className="relative z-10">
          <div className="loading-text">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[450px] sm:h-[525px] md:h-[600px] w-full overflow-hidden">
      {/* Contenedor principal con altura fija */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Imagen de fondo con transición suave */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${headerSections[currentIndex].image})` }}
        />
        
        {/* Superposición oscura con desenfoque */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Superposición de grano con animación de opacidad */}
        <div className="absolute inset-0 grain-overlay" />

        {/* Contenedor del contenido con padding consistente */}
        <div className="relative z-10 w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Botones de navegación */}
            <CarouselButton 
              direction="left" 
              onClick={handlePrev} 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10" 
            />
            
            {/* Contenido principal del hero */}
            <div className="relative z-10">
              <HeroContent headerSection={headerSections[currentIndex]} />
            </div>

            <CarouselButton 
              direction="right" 
              onClick={handleNext} 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}