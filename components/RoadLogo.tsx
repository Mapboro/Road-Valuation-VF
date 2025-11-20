import React from 'react';

export const RoadColors = {
  primary: '#3730A3', // Road Corporate Violet (Indigo 800)
  accent: '#4F46E5',  // Digital Violet (Indigo 600)
  dark: '#0F172A',    // Slate 900 - Texto oscuro
  light: '#F8FAFC',   // Slate 50 - Fondos claros
  white: '#FFFFFF'
};

interface RoadLogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon';
  theme?: 'light' | 'dark' | 'white';
  className?: string;
  width?: number;
}

export const RoadLogo: React.FC<RoadLogoProps> = ({ 
  variant = 'horizontal', 
  theme = 'light', 
  className = '',
  width
}) => {
  const textFill = theme === 'white' ? '#FFFFFF' : (theme === 'dark' ? '#FFFFFF' : RoadColors.dark);
  
  // Dimensiones ajustadas específicamente para el logotipo de texto
  const viewBoxWidth = 160; 
  const viewBoxHeight = 42;

  // Ancho de renderizado por defecto
  const finalWidth = width || 160;

  return (
    <svg 
      width={finalWidth} 
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Road Valuation Logo"
      style={{ overflow: 'visible' }}
    >
      {/* LOGOTIPO TIPOGRÁFICO EXCLUSIVAMENTE */}
      
      {/* "Road" - Tipografía Sans Serif Geométrica, Peso Bold */}
      <text 
        x="0" 
        y="20" 
        fontFamily="'Inter', 'Helvetica Neue', sans-serif" 
        fontWeight="800" 
        fontSize="24" 
        fill={textFill}
        letterSpacing="-0.02em"
        textAnchor="start"
        dominantBaseline="middle"
      >
        Road
      </text>
      
      {/* "VALUATION" - Uppercase, Light/Regular, Tracking muy amplio */}
      <text 
        x="2" // Ligero offset visual para alinear con la R de Road
        y="38" 
        fontFamily="'Inter', 'Helvetica Neue', sans-serif" 
        fontWeight="500" 
        fontSize="10.5" 
        fill={textFill}
        fillOpacity={theme === 'dark' || theme === 'white' ? 0.8 : 0.6} 
        letterSpacing="0.38em" 
        textAnchor="start"
        dominantBaseline="middle"
        style={{ textTransform: 'uppercase' }}
      >
        Valuation
      </text>
    </svg>
  );
};

export default RoadLogo;