interface HPBarProps {
  pct: number;
  label?: string;
}

export function HPBar({ pct, label = 'Match Score' }: HPBarProps) {
  const color = pct >= 80 ? '#3BB53B' : pct >= 50 ? '#F0A000' : '#E3350D';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-600" style={{ fontSize: '11px' }}>
        {label}
      </span>
      <div className="flex-1 relative">
        <div
          className="h-[7px] rounded border"
          style={{
            background: '#E8E5DE',
            borderColor: '#D4D0C8',
          }}
        >
          <div
            className="h-full rounded transition-all duration-1000 ease-out"
            style={{
              width: `${pct}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
      <span
        className="text-xs font-extrabold"
        style={{
          color,
          fontSize: '12px',
          fontWeight: 800,
        }}
      >
        {pct}%
      </span>
    </div>
  );
}
