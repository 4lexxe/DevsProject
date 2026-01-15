import React from 'react';

interface FontelloIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}

/**
 * Componente para usar iconos de Fontello
 * 
 * Para usar Fontello:
 * 1. Ve a https://fontello.com/
 * 2. Selecciona los iconos que necesitas
 * 3. Descarga el paquete
 * 4. Copia los archivos de fuente a public/fonts/fontello/
 * 5. Importa el CSS en tu aplicación (ej: en main.tsx o App.tsx)
 *    import '../public/fonts/fontello/css/fontello.css';
 * 
 * Uso:
 * <FontelloIcon name="icon-user" className="text-blue-500" />
 */
const FontelloIcon: React.FC<FontelloIconProps> = ({ 
  name, 
  className = '', 
  style,
  fallback 
}) => {
  // Verificar si Fontello está cargado
  const isFontelloLoaded = typeof document !== 'undefined' && 
    document.querySelector('link[href*="fontello"]') !== null;

  if (!isFontelloLoaded && fallback) {
    return <>{fallback}</>;
  }

  return (
    <i 
      className={`${name} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default FontelloIcon;
