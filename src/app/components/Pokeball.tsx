interface PokeballProps {
  size?: number;
  spinning?: boolean;
  className?: string;
}

export function Pokeball({ size = 28, spinning = false, className = '' }: PokeballProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={spinning ? { animation: 'spin 1s linear infinite' } : {}}
    >
      {/* Red top half */}
      <circle cx="20" cy="20" r="18" fill="#E8341A" />
      
      {/* White bottom half (clipped) */}
      <path
        d="M 2 20 A 18 18 0 0 0 38 20 L 38 38 A 18 18 0 0 1 2 38 Z"
        fill="#FFFFFF"
      />
      
      {/* Center band */}
      <rect x="2" y="18" width="36" height="4" fill="#0F1224" />
      
      {/* Center button outer */}
      <circle cx="20" cy="20" r="6" fill="#FFFFFF" stroke="#0F1224" strokeWidth="2" />
      
      {/* Center button inner */}
      <circle cx="20" cy="20" r="3" fill="#0F1224" />
    </svg>
  );
}