import { JOB_TYPES, JobType } from '../data/jobs';

interface TypeBadgeProps {
  type: JobType;
  size?: 'small' | 'normal';
}

export function TypeBadge({ type, size = 'normal' }: TypeBadgeProps) {
  const config = JOB_TYPES[type];
  const isSmall = size === 'small';

  return (
    <span
      className="inline-flex items-center gap-1 rounded whitespace-nowrap uppercase"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        padding: isSmall ? '2px 7px' : '3px 9px',
        fontSize: isSmall ? '10px' : '11px',
        fontWeight: 700,
        letterSpacing: '0.3px',
      }}
    >
      <span>{config.icon}</span>
      <span>{type}</span>
    </span>
  );
}
