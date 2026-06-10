import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'dark';
  height?: number;
}

export default function Logo({ className = '', variant = 'full', height = 36 }: LogoProps) {
  const isDark = variant === 'dark';

  if (variant === 'icon') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Isometric 3D Box (cube wireframe without bottom edges) */}
        <path
          d="M50 24 L76 39 L50 54 L24 39 Z"
          stroke={isDark ? "#FFFFFF" : "#0A1C15"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 39 V51"
          stroke={isDark ? "#FFFFFF" : "#0A1C15"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M76 39 V51"
          stroke={isDark ? "#FFFFFF" : "#0A1C15"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 54 V66"
          stroke={isDark ? "#FFFFFF" : "#0A1C15"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Symmetrical Calyx Leaves underneath (hollow outline) */}
        {/* Left leaf */}
        <path
          d="M50 88 C32 88 14 70 14 50 C28 50 46 72 50 88 Z"
          stroke={isDark ? "#8FB37B" : "#5C834D"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right leaf */}
        <path
          d="M50 88 C68 88 86 70 86 50 C72 50 54 72 50 88 Z"
          stroke={isDark ? "#8FB37B" : "#5C834D"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  // Horizontal full brand logotype
  return (
    <div className={`flex items-center gap-2 select-none ${className}`} style={{ height }}>
      <svg
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Isometric 3D Box (cube wireframe without bottom edges) */}
        <path
          d="M50 24 L76 39 L50 54 L24 39 Z"
          stroke={isDark ? "#FFFFFF" : "#0A1C15"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 39 V51"
          stroke={isDark ? "#FFFFFF" : "#0A1C15"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M76 39 V51"
          stroke={isDark ? "#FFFFFF" : "#0A1C15"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 54 V66"
          stroke={isDark ? "#FFFFFF" : "#0A1C15"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Symmetrical Calyx Leaves underneath (hollow outline) */}
        {/* Left leaf */}
        <path
          d="M50 88 C32 88 14 70 14 50 C28 50 46 72 50 88 Z"
          stroke={isDark ? "#8FB37B" : "#5C834D"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right leaf */}
        <path
          d="M50 88 C68 88 86 70 86 50 C72 50 54 72 50 88 Z"
          stroke={isDark ? "#8FB37B" : "#5C834D"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Elegant Vertical Divider Line from the close-up image */}
      <div className={`h-[55%] w-[1.2px] ml-1.5 mr-3 flex-shrink-0 ${isDark ? "bg-white/25" : "bg-[#0A1C15]/20"}`} />

      <div className="flex flex-col justify-center">
        <div 
          className="font-display font-medium text-[15px] select-none flex items-center"
          style={{ letterSpacing: '0.18em' }}
        >
          {/* C Λ L Y X (Deep Forest Green or White) */}
          <span className={isDark ? "text-white" : "text-[#0A1C15]"} style={{ marginRight: '0.18em' }}>C</span>
          <span className={isDark ? "text-white" : "text-[#0A1C15]"} style={{ marginRight: '0.18em' }}>Λ</span>
          <span className={isDark ? "text-white" : "text-[#0A1C15]"} style={{ marginRight: '0.18em' }}>L</span>
          <span className={isDark ? "text-white" : "text-[#0A1C15]"} style={{ marginRight: '0.18em' }}>Y</span>
          <span className={isDark ? "text-white" : "text-[#0A1C15]"} style={{ marginRight: '0.5em' }}>X</span>
          
          {/* P Λ C K (Leaf Green matched precisely to the leaves as in the new logo) */}
          <span className={isDark ? "text-[#8FB37B]" : "text-[#5C834D]"} style={{ marginRight: '0.18em' }}>P</span>
          <span className={isDark ? "text-[#8FB37B]" : "text-[#5C834D]"} style={{ marginRight: '0.18em' }}>Λ</span>
          <span className={isDark ? "text-[#8FB37B]" : "text-[#5C834D]"} style={{ marginRight: '0.18em' }}>C</span>
          <span className={isDark ? "text-[#8FB37B]" : "text-[#5C834D]"}>K</span>
        </div>
      </div>
    </div>
  );
}
