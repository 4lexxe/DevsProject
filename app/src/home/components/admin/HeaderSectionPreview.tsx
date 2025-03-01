import React, { useState } from 'react';
import { HeaderSection } from '../../services/headerSectionServices';
import { ExternalLink, Maximize2, Minimize2, AlertCircle } from 'lucide-react';

interface HeaderSectionPreviewProps {
  headerSection: HeaderSection;
}

const HeaderSectionPreview: React.FC<HeaderSectionPreviewProps> = ({ headerSection }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="space-y-4">
      {/* Mensaje de advertencia si hay error en la imagen */}
      {imageError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              No se pudo cargar la imagen. Verifica que la URL sea correcta y accesible.
            </p>
          </div>
        </div>
      )}
      
      <div className={`relative rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''
      }`}>
        {/* Botón para alternar pantalla completa */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          title={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
        
        <div className={`relative overflow-hidden ${isFullscreen ? 'h-screen' : 'h-[350px] sm:h-[400px]'}`}>
          {/* Imagen de fondo */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{ 
              backgroundImage: headerSection.image && !imageError ? `url(${headerSection.image})` : 'none',
              backgroundColor: headerSection.image && !imageError ? 'transparent' : '#1a202c'
            }}
          >
            {/* Imagen oculta para detectar errores */}
            <img 
              src={headerSection.image} 
              alt="" 
              className="hidden" 
              onError={handleImageError}
            />
          </div>
          
          {/* Superposición oscura con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1px]" />
          
          {/* Contenido */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-md">
              {headerSection.title || 'Título de la Sección'}
            </h1>
            
            <div className="relative inline-block mb-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFFF]" />
              <h2 className="pl-3 text-lg sm:text-xl text-[#00D7FF] text-left drop-shadow-md">
                {headerSection.slogan || 'Slogan de la Sección'}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-white/90 max-w-md mb-6 drop-shadow-md">
              {headerSection.about || 'Descripción de la sección que aparecerá aquí...'}
            </p>

            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
              {headerSection.buttonName || 'Botón de Acción'}
            </button>
          </div>
        </div>
        
        {/* Información adicional */}
        {!isFullscreen && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <ExternalLink size={16} className="mr-2 text-gray-400 flex-shrink-0" />
              <span className="font-medium mr-1 whitespace-nowrap">Enlace:</span>
              <span className="text-blue-600 truncate hover:underline">
                {headerSection.buttonLink || '/ruta-ejemplo'}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay para pantalla completa */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
};

export default HeaderSectionPreview;