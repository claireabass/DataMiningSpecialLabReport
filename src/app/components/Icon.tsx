// Custom SVG Icon System - DexMatch v3.0
// All icons are geometric, single-color, 16×16 or 20×20 viewBox
// Zero emoji. Zero icon libraries.

interface IconProps {
  size?: number;
  color?: string;
  sw?: number;
}

export const Icon = {
  Location: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5Z"
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke={color} strokeWidth={sw} />
    </svg>
  ),

  Briefcase: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="5" width="13" height="9" rx="1.5" stroke={color} strokeWidth={sw} />
      <path
        d="M5.5 5V3.5A1.5 1.5 0 0 1 7 2h2a1.5 1.5 0 0 1 1.5 1.5V5"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <line x1="1.5" y1="9" x2="14.5" y2="9" stroke={color} strokeWidth={sw} />
    </svg>
  ),

  Users: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke={color} strokeWidth={sw} />
      <path
        d="M1 13.5c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <circle cx="12" cy="5.5" r="2" stroke={color} strokeWidth={sw} />
      <path
        d="M14.5 13c0-1.933-1.119-3.565-2.75-4.3"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  ),

  Calendar: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke={color} strokeWidth={sw} />
      <line x1="1.5" y1="7" x2="14.5" y2="7" stroke={color} strokeWidth={sw} />
      <line x1="5" y1="1.5" x2="5" y2="4.5" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1="11" y1="1.5" x2="11" y2="4.5" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),

  ChevronDown: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  ChevronRight: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Upload: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 11V3M5 6l3-3 3 3" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M2.5 11v1.5A1 1 0 0 0 3.5 13.5h9a1 1 0 0 0 1-1V11"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  ),

  Check: ({ size = 16, color = 'currentColor', sw = 2 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.5 3.5L13 5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Search: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth={sw} />
      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),

  Filter: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="4" x2="14" y2="4" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1="4" y1="8" x2="12" y2="8" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1="6" y1="12" x2="10" y2="12" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),

  Close: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),

  Lightning: ({ size = 16, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M9.5 2L4 9h5l-2.5 5L14 7H9L11.5 2H9.5z" fill={color} />
    </svg>
  ),

  Globe: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth={sw} />
      <ellipse cx="8" cy="8" rx="2.5" ry="6.5" stroke={color} strokeWidth={sw} />
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke={color} strokeWidth={sw} />
    </svg>
  ),

  Pokedex: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth={sw} />
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke={color} strokeWidth={sw} />
      <circle cx="8" cy="8" r="2" stroke={color} strokeWidth={sw} />
      <circle cx="8" cy="8" r="0.75" fill={color} />
    </svg>
  ),

  Sparkle: ({ size = 16, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L9.2 6.8L14.5 8L9.2 9.2L8 14.5L6.8 9.2L1.5 8L6.8 6.8L8 1.5Z" fill={color} />
    </svg>
  ),

  ArrowRight: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Building: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1" stroke={color} strokeWidth={sw} />
      <path d="M5 14V10h6v4" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="5" y="5.5" width="2" height="2" rx="0.5" stroke={color} strokeWidth={sw} />
      <rect x="9" y="5.5" width="2" height="2" rx="0.5" stroke={color} strokeWidth={sw} />
      <line x1="2" y1="8" x2="14" y2="8" stroke={color} strokeWidth={sw} />
    </svg>
  ),

  Tag: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M2.5 2.5h5l6 6a1.5 1.5 0 0 1 0 2.12l-2.88 2.88a1.5 1.5 0 0 1-2.12 0l-6-6V2.5Z"
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <circle cx="6" cy="6" r="1" fill={color} />
    </svg>
  ),

  BarChart: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="9" width="3" height="5" rx="0.5" stroke={color} strokeWidth={sw} />
      <rect x="6.5" y="5" width="3" height="9" rx="0.5" stroke={color} strokeWidth={sw} />
      <rect x="11" y="2" width="3" height="12" rx="0.5" stroke={color} strokeWidth={sw} />
    </svg>
  ),

  Minus: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <line x1="4" y1="8" x2="12" y2="8" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),

  Grid: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke={color} strokeWidth={sw} />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke={color} strokeWidth={sw} />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke={color} strokeWidth={sw} />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke={color} strokeWidth={sw} />
    </svg>
  ),

  List: ({ size = 16, color = 'currentColor', sw = 1.5 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="3" cy="4" r="1" fill={color} />
      <circle cx="3" cy="8" r="1" fill={color} />
      <circle cx="3" cy="12" r="1" fill={color} />
      <line x1="6" y1="4" x2="14" y2="4" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1="6" y1="8" x2="14" y2="8" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1="6" y1="12" x2="14" y2="12" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
};
