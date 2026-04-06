import { useState } from 'react';
import { Job, COMPANIES, JOB_TYPES } from '../data/jobs';
import { HPBar } from './HPBar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MatchCardProps {
  job: Job;
  score: number;
  matchedSkills: string[];
  delay: number;
}

export function MatchCard({ job, score, matchedSkills, delay }: MatchCardProps) {
  const [open, setOpen] = useState(false);
  const company = COMPANIES[job.company];

  return (
    <div
      className="bg-white rounded-2xl border-[1.5px] overflow-hidden mb-4 transition-all"
      style={{
        borderColor: '#E8E5DE',
        animation: `fadeUp 0.35s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Company banner */}
      <div
        className="relative min-h-[100px] overflow-hidden"
        style={{ background: company.bannerBg }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at left, ${company.accent}22 0%, transparent 60%)`,
          }}
        />

        {/* Banner content */}
        <div className="relative px-[18px] py-[15px] pr-32">
          {/* Logo row */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black overflow-hidden"
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
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{company.name}</span>
                {company.verified && (
                  <span
                    className="text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.9)',
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    ✓ VERIFIED
                  </span>
                )}
              </div>
              <div
                className="text-[11px] truncate"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {company.tagline}
              </div>
            </div>
          </div>

          {/* Company meta */}
          <div
            className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]"
            style={{ color: 'rgba(255,255,255,0.38)' }}
          >
            <span>📍 HQ: {company.hq}</span>
            <span>🏭 {company.industry}</span>
            <span>👥 {company.size}</span>
            <span>🗓 Est. {company.founded}</span>
          </div>
        </div>
      </div>

      {/* Job body */}
      <div className="px-[18px] py-[15px]">
        {/* Title and salary row */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-base font-extrabold leading-tight" style={{ color: '#1A1A2E' }}>
            {job.title}
          </h3>
          <span
            className="text-sm font-extrabold whitespace-nowrap flex-shrink-0"
            style={{ color: '#059669' }}
          >
            {job.salary}
          </span>
        </div>

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
          {job.urgent && (
            <span
              className="text-[9px] font-extrabold px-2 py-1 rounded border uppercase tracking-wider"
              style={{
                background: '#FEF3C7',
                color: '#92400E',
                borderColor: '#FDE68A',
              }}
            >
              URGENT
            </span>
          )}
          <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ color: '#6B7280', background: '#F5F4F0' }}>
            📍 {job.region}
          </span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ color: '#6B7280', background: '#F5F4F0' }}>
            {job.openings} opening{job.openings > 1 ? 's' : ''}
          </span>
        </div>

        {/* HP bar */}
        <div className="mb-3">
          <HPBar pct={score} />
          <div className="text-right mt-1">
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
              DexMatch System
            </span>
          </div>
        </div>

        {/* Matched skills */}
        <div className="mb-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>
            Skills ({matchedSkills.length}/{job.skills.length} matched)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill, i) => {
              const isMatched = matchedSkills.includes(skill);
              return (
                <span
                  key={i}
                  className="text-[10px] font-bold px-2 py-1 rounded border flex items-center gap-1"
                  style={
                    isMatched
                      ? {
                          backgroundColor: '#F0FDF4',
                          color: '#065F46',
                          borderColor: '#BBF7D0',
                        }
                      : {
                          backgroundColor: '#F5F4F0',
                          color: '#9CA3AF',
                          borderColor: '#E8E5DE',
                        }
                  }
                >
                  {isMatched && <span className="text-green-600">✓</span>}
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* View full report button */}
        <button
          className="w-full py-2.5 rounded-xl font-extrabold text-xs border-2 transition-colors"
          style={{
            borderColor: '#E8E5DE',
            color: '#6B7280',
          }}
          onClick={() => setOpen(!open)}
        >
          {open ? '▲ Hide Details' : '▼ View Full Details'}
        </button>
      </div>

      {/* Expanded section */}
      {open && (
        <div
          className="border-t-2 px-[18px] py-4"
          style={{ borderColor: '#E8E5DE' }}
        >
          {/* Company About */}
          <div className="mb-4">
            <div className="text-xs font-extrabold uppercase tracking-wide mb-2" style={{ color: '#1A1A2E' }}>
              About {company.name}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
              {company.about}
            </p>
          </div>

          {/* Job description */}
          <div className="mb-4 pt-4 border-t" style={{ borderColor: '#E8E5DE' }}>
            <div className="text-xs font-extrabold uppercase tracking-wide mb-2" style={{ color: '#1A1A2E' }}>
              Role Description
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
              {job.desc}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              className="flex-1 py-3 rounded-xl font-extrabold text-sm text-white"
              style={{ background: '#1A1A2E' }}
              onClick={(e) => {
                e.stopPropagation();
                alert('Apply feature coming soon!');
              }}
            >
              Apply Now
            </button>
            <button
              className="px-6 py-3 rounded-xl font-bold text-sm border-2"
              style={{
                borderColor: '#E8E5DE',
                color: '#6B7280',
              }}
              onClick={(e) => {
                e.stopPropagation();
                alert('Saved!');
              }}
            >
              Save Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
