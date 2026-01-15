import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeTransition } from '../components/ThemeTransition';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingTheme, setPendingTheme] = useState<Theme | null>(null);
  const [oldThemeForTransition, setOldThemeForTransition] = useState<Theme | null>(null);

  const [theme, setTheme] = useState<Theme>(() => {
    // Verificar localStorage primero
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      // Aplicar inmediatamente al cargar
      const root = document.documentElement;
      if (savedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      return savedTheme;
    }
    // Por defecto, usar tema claro (blanco)
    const initialTheme = 'light';
    // Aplicar inmediatamente
    const root = document.documentElement;
    root.classList.remove('dark');
    return initialTheme;
  });

  // Efecto solo para el tema inicial (no para cambios durante la transición)
  // Los cambios de tema ahora se manejan a través de handleTransitionComplete

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const oldTheme = theme; // Guardar el tema anterior ANTES de cambiarlo
    
    // Guardar el tema anterior para la animación
    setOldThemeForTransition(oldTheme);
    setPendingTheme(newTheme);
    setIsTransitioning(true);
    
    // Aplicar el tema INMEDIATAMENTE para que se vea el cambio debajo de la ola
    // Esto hace que el contenido debajo de la ola muestre el nuevo tema
    const root = document.documentElement;
    const body = document.body;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    
    // Actualizar el estado y localStorage inmediatamente
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleTransitionComplete = () => {
    // Limpiar el estado de transición
    setPendingTheme(null);
    setOldThemeForTransition(null);
    setIsTransitioning(false);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      {pendingTheme && oldThemeForTransition && (
        <ThemeTransition
          isTransitioning={isTransitioning}
          newTheme={pendingTheme}
          oldTheme={oldThemeForTransition}
          onComplete={handleTransitionComplete}
        />
      )}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
