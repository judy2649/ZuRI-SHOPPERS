import React from 'react';

interface ZuriLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ZuriLogo: React.FC<ZuriLogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: { width: 40, height: 32 },
    md: { width: 140, height: 112 },
    lg: { width: 340, height: 272 }
  };

  const current = dimensions[size];

  // A unified SVG vector representing the exact provided Zuri Shoppers Logo
  // It features:
  // - Gold hex code: #C5A059
  // - Premium gold/white geometric shapes over a transparent or dark container
  return (
    <div className={`flex items-center justify-center ${className}`} id={`zuri-logo-${size}`}>
      <svg
        viewBox="0 0 500 400"
        style={{ width: size === 'sm' ? undefined : current.width, height: size === 'sm' ? undefined : current.height }}
        className={`${size === 'sm' ? 'w-10 h-8' : ''} drop-shadow-md`}
      >
        {/* Upper Chevron in Gold (#C5A059) */}
        <polygon 
          points="250,40 425,155 385,155 250,60 115,155 75,155" 
          fill="#C5A059" 
        />

        {/* Lower Chevron in Gold (#C5A059) */}
        <polygon 
          points="250,360 425,245 385,245 250,340 115,245 75,245" 
          fill="#C5A059" 
        />

        {/* Geometric Diamond Prism (3D Gem) */}
        <g id="gem-lattice-crystal">
          {/* Outer Gem Frame */}
          <polygon 
            points="250,85 285,115 250,145 215,115" 
            fill="none" 
            stroke="#C5A059" 
            strokeWidth="2.5" 
          />
          {/* Gem Facets inside */}
          <line x1="215" y1="115" x2="285" y2="115" stroke="#C5A059" strokeWidth="2" />
          <line x1="250" y1="85" x2="250" y2="145" stroke="#C5A059" strokeWidth="2" />
          
          {/* Upper facet triangles */}
          <polygon points="250,85 232,115 250,115" fill="none" stroke="#C5A059" strokeWidth="1.5" />
          <polygon points="250,85 268,115 250,115" fill="none" stroke="#C5A059" strokeWidth="1.5" />
          
          {/* Lower facet triangles */}
          <polygon points="250,145 232,115 250,115" fill="none" stroke="#C5A059" strokeWidth="1.5" />
          <polygon points="250,145 268,115 250,115" fill="none" stroke="#C5A059" strokeWidth="1.5" />
        </g>

        {/* Double flanking borders around ZURI SHOPPERS */}
        {/* Upper bordering line with split center peak */}
        <path 
          d="M 60,172 L 235,172 L 245,169 L 255,169 L 265,172 L 440,172" 
          stroke="#C5A059" 
          strokeWidth="2" 
          fill="none" 
        />
        {/* Lower bordering line with split center inverse peak */}
        <path 
          d="M 60,228 L 235,228 L 245,231 L 255,231 L 265,228 L 440,228" 
          stroke="#C5A059" 
          strokeWidth="2" 
          fill="none" 
        />

        {/* Text Area: ZURI SHOPPERS */}
        <text 
          x="250" 
          y="211" 
          fontFamily="Georgia, Cambria, 'Times New Roman', Times, serif" 
          fontSize="40" 
          fontWeight="900" 
          fill="#FFFFFF" 
          textAnchor="middle" 
          letterSpacing="1"
        >
          ZURI SHOPPERS
        </text>

        {/* EST. 2024 Sub-text */}
        <text 
          x="250" 
          y="266" 
          fontFamily="'Courier New', Courier, monospace" 
          fontSize="17" 
          fontWeight="900" 
          fill="#FFFFFF" 
          textAnchor="middle" 
          letterSpacing="7"
        >
          EST. 2024
        </text>

        {/* Inverted solid White Triangle component */}
        <polygon 
          points="215,285 285,285 250,308" 
          fill="#FFFFFF" 
        />
      </svg>
      
      {/* If size is sm, we append text right after it for high readability */}
      {size === 'sm' && (
        <span className="font-sans font-black tracking-normal text-white uppercase text-xs ml-2">
          Zuri <span className="text-[#C5A059]">Shoppers</span>
        </span>
      )}
    </div>
  );
};
