import { useState } from 'react';
import { Job, COMPANIES, JOB_TYPES } from '../data/jobs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BrowseCardProps {
  job: Job;
  delay: number;
}

export function BrowseCard({ job, delay }: BrowseCardProps) {
  const [open, setOpen] = useState(false);
  const company = COMPANIES[job.company];
  const typeColor = JOB_TYPES[job.type];

  return (
    <div
      className="bg-white rounded-xl border-[1.5px] cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      style={{
        borderColor: open ? company.accent : '#E8E5DE',
        boxShadow: open ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
        animation: `fadeUp 0.3s ease both`,
        animationDelay: `${delay}ms`,
      }}
      onClick={() => setOpen(!open)}
    >
      {/* Type color bar */}
      <div
        className="h-1"
        style={{ backgroundColor: typeColor.bg }}
      />

      {/* Card body */}
      <div className="p-4">
        {/* Company row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 overflow-hidden"
            style={{
              backgroundColor: company.logoBg,
              color: company.logoText,
            }}
          >
            {typeof company.logo === 'string' && company.logo.length > 5 ? (
              <ImageWithFallback src={company.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
            ) : (
              company.logo
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate" style={{ color: '#1A1A2E' }}>
              {job.company}
            </div>
            <div className="text-xs flex items-center gap-1" style={{ color: '#6B7280' }}>
              <span>📍</span>
              <span className="truncate">{job.region}</span>
            </div>
          </div>
          {job.urgent && (
            <span
              className="text-[9px] font-extrabold px-2 py-1 rounded border uppercase tracking-wider flex-shrink-0"
              style={{
                background: '#FEF3C7',
                color: '#92400E',
                borderColor: '#FDE68A',
              }}
            >
              URGENT
            </span>
          )}
        </div>

        {/* Job title */}
        <h3
          className="text-sm font-extrabold mb-2 leading-tight"
          style={{ color: '#1A1A2E' }}
        >
          {job.title}
        </h3>

        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide" style={{ background: '#F5F4F0', color: '#6B7280' }}>
            {job.type}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide"
            style={{
              background: '#F5F4F0',
              color: '#6B7280',
            }}
          >
            {job.level}
          </span>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold" style={{ color: '#059669', fontSize: '13px' }}>
            {job.salary}
          </span>
          <span style={{ color: '#9CA3AF' }}>
            {job.openings} opening{job.openings > 1 ? 's' : ''} · {job.posted}
          </span>
        </div>
      </div>

      {/* Expanded section */}
      {open && (
        <div
          className="border-t-2 border-dashed p-4 pt-3"
          style={{ borderColor: '#E8E5DE' }}
        >
          {/* Skills */}
          <div className="mb-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>
              Required Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold px-2 py-1 rounded border"
                  style={{
                    backgroundColor: typeColor.lightBg,
                    color: typeColor.bg,
                    borderColor: typeColor.bg,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7280' }}>
            {job.desc}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              className="flex-1 py-2.5 rounded-xl font-extrabold text-xs text-white"
              style={{ background: '#1A1A2E' }}
              onClick={(e) => {
                e.stopPropagation();
                alert('Apply feature coming soon!');
              }}
            >
              Apply Now
            </button>
            <button
              className="px-4 py-2.5 rounded-xl font-bold text-xs border-2"
              style={{
                borderColor: '#E8E5DE',
                color: '#6B7280',
              }}
              onClick={(e) => {
                e.stopPropagation();
                alert('Saved!');
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
