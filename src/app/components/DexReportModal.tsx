import { Pokeball } from './Pokeball';
import { MatchCard } from './MatchCard';
import { Job, EXTRACTED_SKILLS } from '../data/jobs';

interface DexReportModalProps {
  results: Array<{ job: Job; score: number; matched: string[] }>;
  onClose: () => void;
}

export function DexReportModal({ results, onClose }: DexReportModalProps) {
  const topPicks = results.slice(0, 3);
  const skillCounts: Record<string, number> = {};

  // Count skill occurrences
  results.forEach((r) => {
    r.matched.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  const skillStats = Object.entries(skillCounts)
    .map(([skill, count]) => ({
      skill,
      count,
      pct: Math.round((count / results.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-[700px] w-full max-h-[90vh] overflow-y-auto border-2"
        style={{
          borderColor: '#E8E5DE',
          boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5 rounded-t-3xl flex items-center justify-between"
          style={{ background: '#1A1A2E' }}
        >
          <div className="flex items-center gap-3">
            <Pokeball size={24} />
            <div>
              <div className="text-white font-black text-lg">DexReport™</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                Personalised Career Analysis
              </div>
            </div>
          </div>
          <button
            className="text-white text-2xl w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Top 3 Picks */}
          <section>
            <h3 className="text-sm font-extrabold uppercase tracking-wide mb-3" style={{ color: '#1A1A2E' }}>
              🎯 Top 3 Recommended Roles
            </h3>
            <div className="space-y-3">
              {topPicks.map((result, i) => (
                <div key={result.job.id} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold" style={{ color: '#1A1A2E' }}>
                      #{i + 1} {result.job.title}
                    </span>
                    <span className="font-extrabold" style={{ color: '#059669' }}>
                      {result.score}% match
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>
                    {result.job.company} · {result.job.region}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Heatmap */}
          <section>
            <h3 className="text-sm font-extrabold uppercase tracking-wide mb-3" style={{ color: '#1A1A2E' }}>
              📊 Your Skills Coverage
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {skillStats.map(({ skill, count, pct }) => (
                <div
                  key={skill}
                  className="p-2.5 rounded-lg border"
                  style={{
                    background: pct >= 50 ? '#F0FDF4' : '#F5F4F0',
                    borderColor: pct >= 50 ? '#BBF7D0' : '#E8E5DE',
                  }}
                >
                  <div className="text-xs font-bold mb-1" style={{ color: '#1A1A2E' }}>
                    {skill}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: '#E8E5DE' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 50 ? '#059669' : '#F0A000',
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: '#6B7280' }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <section>
            <h3 className="text-sm font-extrabold uppercase tracking-wide mb-3" style={{ color: '#1A1A2E' }}>
              💡 Recommendations
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2 text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                <span>•</span>
                <span>
                  You have strong matches in <strong>Research & Science</strong> and <strong>Battle & Training</strong> categories.
                </span>
              </div>
              <div className="flex gap-2 text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                <span>•</span>
                <span>
                  Consider developing skills in <strong>Data Analysis</strong> and <strong>Team Coordination</strong> to unlock more opportunities.
                </span>
              </div>
              <div className="flex gap-2 text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                <span>•</span>
                <span>
                  Your experience level aligns well with <strong>Mid–Senior</strong> positions across multiple regions.
                </span>
              </div>
            </div>
          </section>

          {/* Export buttons */}
          <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#E8E5DE' }}>
            <button
              className="flex-1 py-3 rounded-xl font-extrabold text-sm text-white"
              style={{ background: '#1A1A2E' }}
              onClick={() => alert('Export feature coming soon!')}
            >
              ⬇ Download Report
            </button>
            <button
              className="flex-1 py-3 rounded-xl font-bold text-sm border-2"
              style={{
                borderColor: '#E8E5DE',
                color: '#6B7280',
              }}
              onClick={() => {
                alert('Share link copied!');
              }}
            >
              🔗 Share Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
