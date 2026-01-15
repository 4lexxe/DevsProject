import React from 'react';

interface WaveDividerProps {
  position?: 'top' | 'bottom';
  color?: string;
  className?: string;
}

/**
 * Componente de onda SVG para separar secciones
 * Diseño minimalista inspirado en freefrontend
 */
const WaveDivider: React.FC<WaveDividerProps> = ({ 
  position = 'bottom', 
  color = '#ffffff',
  className = '' 
}) => {
  const wavePath = position === 'bottom' 
    ? "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z"
    : "M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,208C672,224,768,224,864,208C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,0L0,0Z";

  return (
    <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${className}`}>
      <svg 
        viewBox="0 0 1440 320" 
        preserveAspectRatio="none"
        className="w-full h-20 sm:h-24 md:h-32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d={wavePath}
          fill={color}
          className="transition-colors duration-300"
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
