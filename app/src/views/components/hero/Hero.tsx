import React, { useEffect, useState } from 'react';
import CarouselButton from './CarouselButton';
import HeroContent from './HeroContent';
import { getHeaderSections } from '../../../services/headerSectionServices';

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
        setHeaderSections(sections);
      } catch (error) {
        console.error('Error al obtener las secciones de encabezado:', error);
      }
    };

    fetchHeaderSections();
  }, []);

  useEffect(() => {
    // Create the interval
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headerSections.length);
    }, 5000);

    // Clear interval on cleanup
    return () => clearInterval(interval);
  }, [currentIndex, headerSections.length]); // Reset interval when currentIndex changes

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + headerSections.length) % headerSections.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % headerSections.length);
  };

  if (headerSections.length === 0) {
    return (
      <div className="relative flex items-center justify-center px-6 py-16">
        {/* Background with grain effect for loading state */}
        <div className="absolute inset-0 bg-gray-800" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="absolute inset-0 grain-overlay" />
        
        {/* Loading text with animation */}
        <div className="relative z-10">
          <div className="loading-text">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center px-6 py-16">
      {/* Imagen de fondo con transición suave */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${headerSections[currentIndex].image})` }}
      />
      
      {/* Superposición oscura con desenfoque */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Superposición de grano con animación de opacidad */}
      <div className="absolute inset-0 grain-overlay" />

      {/* Botón de navegación izquierda */}
      <CarouselButton direction="left" onClick={handlePrev} className="absolute left-4 z-10" />

      {/* Contenido principal del hero */}
      <div className="relative z-10 hero-section">
        <HeroContent headerSection={headerSections[currentIndex]} />
      </div>

      {/* Botón de navegación derecha */}
      <CarouselButton direction="right" onClick={handleNext} className="absolute right-4 z-10" />
    </div>
  );
}