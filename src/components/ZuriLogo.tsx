import React from 'react';

interface ZuriLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ZuriLogo: React.FC<ZuriLogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: { width: 45, height: 36, fontSize: 'text-sm' },
    md: { width: 150, height: 120, fontSize: 'text-xl' },
    lg: { width: 300, height: 240, fontSize: 'text-3xl' }
  };

  const current = dimensions[size];

  if (size === 'sm') {
    // Mini version for narrow headers
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-8 h-8 drop-shadow">
          <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="#f97316" strokeWidth="6" />
          <polygon points="50,20 75,50 50,80 25,50" fill="none" stroke="#f97316" strokeWidth="3" />
          <line x1="25" y1="50" x2="75" y2="50" stroke="#f97316" strokeWidth="3" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="#f97316" strokeWidth="3" />
        </svg>
        <span className="font-sans font-black tracking-tighter text-orange-500 uppercase text-xl leading-none">
          ZURI
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <svg 
        viewBox="0 0 400 320" 
        style={{ width: current.width, height: current.height }}
        className="drop-shadow-lg"
      >
        {/* Background Space */}
        <rect width="400" height="320" fill="transparent" />

        {/* Outer Orange Diamond */}
        <polygon 
          points="200,10 390,160 200,310 10,160" 
          fill="#081621" 
          stroke="#f97316" 
          strokeWidth="10" 
          strokeLinejoin="round"
        />

        {/* Inner Gem Lattice */}
        <g id="gem-lattice">
          {/* Main diamond outline */}
          <polygon 
            points="200,40 250,75 200,110 150,75" 
            fill="none" 
            stroke="#f97316" 
            strokeWidth="3.5" 
          />
          {/* Inner crystal lines */}
          <line x1="200" y1="40" x2="200" y2="110" stroke="#f97316" strokeWidth="2.5" />
          <line x1="150" y1="75" x2="250" y2="75" stroke="#f97316" strokeWidth="2.5" />
          <line x1="200" y1="40" x2="175" y2="75" stroke="#f97316" strokeWidth="2" />
          <line x1="200" y1="40" x2="225" y2="75" stroke="#f97316" strokeWidth="2" />
          <line x1="200" y1="110" x2="175" y2="75" stroke="#f97316" strokeWidth="2" />
          <line x1="200" y1="110" x2="225" y2="75" stroke="#f97316" strokeWidth="2" />
        </g>

        {/* Dark Banner with orange borders */}
        <g id="banner">
          <rect x="35" y="132" width="330" height="56" fill="#0c2334" />
          <line x1="25" y1="132" x2="375" y2="132" stroke="#f97316" strokeWidth="3" />
          <line x1="25" y1="188" x2="375" y2="188" stroke="#f97316" strokeWidth="3" />
          
          {/* Flaired background accent lines */}
          <line x1="10" y1="132" x2="25" y2="132" stroke="#f97316" strokeWidth="1" strokeDasharray="5,2" />
          <line x1="10" y1="188" x2="25" y2="188" stroke="#f97316" strokeWidth="1" strokeDasharray="5,2" />
          <line x1="375" y1="132" x2="390" y2="132" stroke="#f97316" strokeWidth="1" strokeDasharray="5,2" />
          <line x1="375" y1="188" x2="390" y2="188" stroke="#f97316" strokeWidth="1" strokeDasharray="5,2" />
        </g>

        {/* Text Area */}
        <text 
          x="200" 
          y="170" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="30" 
          fontWeight="900" 
          fill="#f97316" 
          textAnchor="middle" 
          letterSpacing="2.5"
        >
          ZURI SHOPPERS
        </text>

        {/* Est 2024 sub banner */}
        <text 
          x="200" 
          y="222" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="15" 
          fontWeight="bold" 
          fill="#F5F5F5" 
          textAnchor="middle" 
          letterSpacing="4"
        >
          EST. 2024
        </text>

        {/* Small downward accent arrow at the bottom */}
        <polygon 
          points="180,245 220,245 200,268" 
          fill="#FFFFFF" 
          stroke="#f97316" 
          strokeWidth="1.5" 
        />
      </svg>
    </div>
  );
};
