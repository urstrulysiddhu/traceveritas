import React from 'react';

export const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-[0.05] bg-canvas">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="network-pattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
            {/* Horizontal and vertical structural lines */}
            <line x1="0" y1="100" x2="400" y2="100" stroke="#3B1118" strokeWidth="1" className="animate-pulse-slow" />
            <line x1="0" y1="300" x2="400" y2="300" stroke="#6E1F2A" strokeWidth="1" />
            <line x1="150" y1="0" x2="150" y2="400" stroke="#315C7D" strokeWidth="1" />
            <line x1="350" y1="0" x2="350" y2="400" stroke="#171719" strokeWidth="1" className="animate-pulse-slow" />
            
            {/* Connecting diagonals */}
            <line x1="150" y1="100" x2="350" y2="300" stroke="#6E1F2A" strokeWidth="0.5" />
            <line x1="350" y1="100" x2="150" y2="300" stroke="#315C7D" strokeWidth="0.5" />
            
            {/* Nodes */}
            <rect x="146" y="96" width="8" height="8" fill="#3B1118" />
            <rect x="346" y="96" width="8" height="8" fill="#6E1F2A" />
            <rect x="146" y="296" width="8" height="8" fill="#315C7D" />
            <rect x="346" y="296" width="8" height="8" fill="#171719" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#network-pattern)" className="animate-pan-slow" />
      </svg>
    </div>
  );
};
