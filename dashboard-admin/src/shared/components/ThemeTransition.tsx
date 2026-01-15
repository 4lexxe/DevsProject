import { useEffect, useState } from 'react';

interface ThemeTransitionProps {
  isTransitioning: boolean;
  newTheme: 'light' | 'dark';
  oldTheme?: 'light' | 'dark';
  onComplete: () => void;
}

export const ThemeTransition: React.FC<ThemeTransitionProps> = ({
  isTransitioning,
  newTheme,
  oldTheme,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      // Aplicar clase al HTML para sincronizar colores
      const root = document.documentElement;
      root.setAttribute('data-theme-transition', newTheme);
      
      // Mostrar inmediatamente
      setIsVisible(true);
      
      // Completar la animación después de 500ms
      const timer = setTimeout(() => {
        setIsVisible(false);
        root.removeAttribute('data-theme-transition');
        onComplete();
      }, 500);
      
      return () => {
        clearTimeout(timer);
        root.removeAttribute('data-theme-transition');
      };
    } else {
      setIsVisible(false);
      document.documentElement.removeAttribute('data-theme-transition');
    }
  }, [isTransitioning, newTheme, onComplete]);

  return (
    <>
      {isVisible && (
        <div 
          className="theme-transition-overlay"
          data-theme={newTheme}
          onAnimationEnd={() => {
            if (!isTransitioning) {
              setIsVisible(false);
            }
          }}
        />
      )}
    </>
  );
};
