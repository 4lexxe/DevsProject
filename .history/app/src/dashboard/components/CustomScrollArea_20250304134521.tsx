import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './sidebarStyles.css';

interface CustomScrollAreaProps {
  children: ReactNode;
  className?: string;
  buttonSize?: number;
}

const CustomScrollArea: React.FC<CustomScrollAreaProps> = ({ 
  children, 
  className = '', 
  buttonSize = 24 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [trackVisible, setTrackVisible] = useState(false);

  // Calcular las dimensiones del thumb basado en el contenido
  const updateThumbPosition = useCallback(() => {
    if (!scrollContainerRef.current || !thumbRef.current || !trackRef.current) return;

    const { scrollHeight, clientHeight, scrollTop } = scrollContainerRef.current;
    const trackHeight = trackRef.current.clientHeight;
    
    // No mostrar el thumb si no hay scroll necesario
    if (scrollHeight <= clientHeight) {
      setTrackVisible(false);
      return;
    }

    setTrackVisible(true);
    
    // Calcular alto proporcional del thumb
    const calculatedThumbHeight = Math.max(
      30,
      (clientHeight / scrollHeight) * trackHeight
    );
    setThumbHeight(calculatedThumbHeight);
    
    // Calcular posición del thumb
    const thumbTopPos = (scrollTop / (scrollHeight - clientHeight)) * 
      (trackHeight - calculatedThumbHeight);
    setThumbTop(thumbTopPos);
    
    // Actualizar estados para botones
    setCanScrollUp(scrollTop > 10);
    setCanScrollDown(scrollHeight - scrollTop - clientHeight > 10);
  }, []);

  // Inicializar y actualizar cuando cambie el contenido
  useEffect(() => {
    updateThumbPosition();
    
    // Verificar si necesitamos botones de scroll
    const checkScrollNeeded = () => {
      if (!scrollContainerRef.current) return;
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowButtons(scrollHeight > clientHeight + 20);
      updateThumbPosition();
    };
    
    checkScrollNeeded();
    window.addEventListener('resize', checkScrollNeeded);
    
    return () => {
      window.removeEventListener('resize', checkScrollNeeded);
    };
  }, [children, updateThumbPosition]);

  // Manejar scroll
  const handleScroll = useCallback(() => {
    updateThumbPosition();
  }, [updateThumbPosition]);

  // Funciones de scroll
  const scrollUp = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ top: -120, behavior: 'smooth' });
  };
  
  const scrollDown = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ top: 120, behavior: 'smooth' });
  };

  // Funciones para arrastrar el thumb
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || !trackRef.current) return;
    
    const { top: trackTop } = trackRef.current.getBoundingClientRect();
    const { clientY } = e;
    const targetY = clientY - trackTop;
    
    const { scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrollRatio = (scrollHeight - clientHeight) / (trackRef.current.clientHeight - thumbHeight);
    
    scrollContainerRef.current.scrollTop = (targetY - thumbHeight / 2) * scrollRatio;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current || !trackRef.current) return;
      
      const { top: trackTop } = trackRef.current.getBoundingClientRect();
      const { clientY } = e;
      let targetY = clientY - trackTop;

      // Limitar el movimiento dentro del track
      const maxTop = trackRef.current.clientHeight - thumbHeight;
      targetY = Math.max(0, Math.min(targetY, maxTop));
      
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollRatio = (scrollHeight - clientHeight) / maxTop;
      
      scrollContainerRef.current.scrollTop = targetY * scrollRatio;
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, thumbHeight]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  return (
    <div className="relative flex-grow h-full">
      {/* Botón para scroll hacia arriba */}
      {showButtons && canScrollUp && (
        <button
          onClick={scrollUp}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Scroll up"
        >
          <ChevronUp size={16} className="text-gray-500" />
        </button>
      )}
      
      <div
        ref={scrollContainerRef}
        className={`custom-scrollbar w-full h-full ${className}`}
        onScroll={handleScroll}
      >
        {children}
        
        {/* Fade effects */}
        {canScrollUp && <div className="fade-top"></div>}
        {canScrollDown && <div className="fade-bottom"></div>}
        
        {/* Custom scrollbar track and thumb */}
        {trackVisible && (
          <div 
            ref={trackRef} 
            className="custom-scrollbar-track" 
            onClick={handleTrackClick}
          >
            <div
              ref={thumbRef}
              className="custom-scrollbar-thumb"
              style={{ 
                height: `${thumbHeight}px`, 
                top: `${thumbTop}px`,
                opacity: isDragging ? 1 : undefined
              }}
              onMouseDown={handleThumbMouseDown}
            />
          </div>
        )}
      </div>

      {/* Botón para scroll hacia abajo */}
      {showButtons && canScrollDown && (
        <button
          onClick={scrollDown}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default CustomScrollArea;
