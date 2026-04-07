import { useState, useRef, useMemo } from 'react';
import { Icon } from './components/Icon';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
const dexMatchLogo = '';
import {
  JOBS,
  COMPANIES,
  JOB_TYPES,
  EXTRACTED_SKILLS,
  DISPLAY_OPENINGS,
  UNIQUE_REGIONS,
  UNIQUE_COMPANIES,
  Job,
  JobType,
} from './data/jobs';

type Phase = 'idle' | 'uploaded' | 'analyzing' | 'done';
type View = 'landing' | 'browse' | 'companies';

const ANALYSIS_STEPS = ['Scanning…', 'Matching…', 'Done'];

// ─── Match Quality Label Helper ───────────────────────────────────────────────
const getMatchLabel = (score: number): { label: string; color: string; bg: string } => {
  if (score >= 90) return { label: 'Perfect Match', color: 'var(--green)', bg: 'var(--green-bg)' };
  if (score >= 75) return { label: 'Great Match', color: 'var(--green)', bg: 'var(--green-bg)' };
  if (score >= 60) return { label: 'Good Match', color: 'var(--amber)', bg: 'var(--amber-bg)' };
  if (score >= 45) return { label: 'Okay Match', color: 'var(--amber)', bg: 'var(--amber-bg)' };
  if (score >= 30) return { label: 'Fair Match', color: '#D97706', bg: '#FEF3C7' };
  return { label: 'Not a Good Match', color: 'var(--red)', bg: 'var(--red-bg)' };
};

// ─── Per-company strengths ────────────────────────────────────────────────────
const getCompanyStrengths = (companyName: string, jobs: Job[], matched: string[]) => {
  const companyJobs = jobs.filter((j) => j.company === companyName);
  const allSkills = new Set<string>();
  companyJobs.forEach((job) => job.skills.forEach((s) => allSkills.add(s)));

  const matchedSkills = Array.from(allSkills).filter((s) => matched.includes(s));
  const totalSkills = allSkills.size;
  const matchPct = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 0;
  const hasUrgent = companyJobs.some((j) => j.urgent);

  const strengths: { title: string; desc: string; impact: string }[] = [];

  if (matchedSkills.length >= 3) {
    strengths.push({
      title: 'Strong Skill Alignment',
      desc: `You have ${matchedSkills.length}/${totalSkills} required skills: ${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? ' and more' : ''}.`,
      impact: 'high',
    });
  } else if (matchedSkills.length > 0) {
    strengths.push({
      title: 'Relevant Background',
      desc: `Your ${matchedSkills.join(', ')} skills directly apply to ${companyName} roles.`,
      impact: 'medium',
    });
  }

  if (matchPct >= 60) {
    strengths.push({
      title: 'Highly Competitive Profile',
      desc: `${matchPct}% skill coverage puts your profile in the top candidate bracket for this organisation.`,
      impact: 'high',
    });
  }

  if (hasUrgent && matchedSkills.length > 0) {
    strengths.push({
      title: 'Urgent Opening Match',
      desc: `${companyName} has urgent roles that match your profile — apply now for priority review.`,
      impact: 'high',
    });
  }

  if (companyJobs.length > 1 && matchedSkills.length > 0) {
    strengths.push({
      title: 'Multiple Role Opportunities',
      desc: `You are eligible for ${companyJobs.length} different positions, maximising your chances of placement.`,
      impact: 'medium',
    });
  }

  return strengths;
};

// ─── Per-company improvements ─────────────────────────────────────────────────
const getCompanyImprovements = (companyName: string, jobs: Job[], matched: string[]) => {
  const companyJobs = jobs.filter((j) => j.company === companyName);
  const allSkills = new Set<string>();
  companyJobs.forEach((job) => job.skills.forEach((s) => allSkills.add(s)));

  const missingSkills = Array.from(allSkills).filter((s) => !matched.includes(s));
  const matchedSkills = Array.from(allSkills).filter((s) => matched.includes(s));

  const suggestions: { title: string; desc: string; impact: string }[] = [];

  if (missingSkills.length > 0) {
    suggestions.push({
      title: `Add ${companyName}-Specific Skills`,
      desc: `Target: ${missingSkills.slice(0, 3).join(', ')}. These appear in most ${companyName} listings.`,
      impact: 'high',
    });
  }

  if (matchedSkills.length > 0 && matchedSkills.length < allSkills.size / 2) {
    suggestions.push({
      title: 'Demonstrate Skill Depth',
      desc: `You have ${matchedSkills.length} matching skills. Showcase projects that feature ${matchedSkills.slice(0, 2).join(' and ')}.`,
      impact: 'medium',
    });
  }

  return suggestions;
};

// ─── General improvement suggestions ─────────────────────────────────────────
const getImprovementSuggestions = (allJobs: Job[], matched: string[]) => {
  const skillCounts = new Map<string, number>();
  allJobs.forEach((job) =>
    job.skills.forEach((skill) => {
      if (!matched.includes(skill)) {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      }
    })
  );

  const topMissing = Array.from(skillCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((e) => e[0]);

  const suggestions: { type: string; title: string; desc: string; impact: string }[] = [];

  if (topMissing.length > 0) {
    suggestions.push({
      type: 'skills',
      title: 'Add High-Demand Skills',
      desc: `Consider adding ${topMissing.slice(0, 3).join(', ')} to your profile. These appear in ${skillCounts.get(topMissing[0])}+ job listings.`,
      impact: 'high',
    });
  }

  if (matched.length < 5) {
    suggestions.push({
      type: 'experience',
      title: 'Expand Your Skill Set',
      desc: 'Your CV shows a limited range of technical skills. Add concrete competencies with certifications and examples.',
      impact: 'high',
    });
  }

  suggestions.push({
    type: 'formatting',
    title: 'Improve CV Structure',
    desc: 'Use clear headers like "Skills", "Experience", and "Education". List skills as bullet points for better extraction.',
    impact: 'medium',
  });

  suggestions.push({
    type: 'keywords',
    title: 'Use Industry Keywords',
    desc: 'Include specific job titles, tools, and technologies relevant to your target field to increase match accuracy.',
    impact: 'medium',
  });

  return suggestions;
};

// ─── Company insights ─────────────────────────────────────────────────────────
const getCompanyInsights = (results: Array<{ job: Job; score: number; matched: string[] }>) => {
  const companyScores = new Map<
    string,
    { total: number; count: number; jobs: Array<{ job: Job; score: number; matched: string[] }> }
  >();

  results.forEach((r) => {
    const existing = companyScores.get(r.job.company) || { total: 0, count: 0, jobs: [] };
    companyScores.set(r.job.company, {
      total: existing.total + r.score,
      count: existing.count + 1,
      jobs: [...existing.jobs, r],
    });
  });

  return Array.from(companyScores.entries())
    .map(([company, data]) => ({
      company,
      avgScore: Math.round(data.total / data.count),
      jobCount: data.count,
      jobs: data.jobs,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);
};

// ─── Result type ─────────────────────────────────────────────────────────────
type AnalysisResult = {
  job: Job;
  score: number;
  matched: string[];
  verdict?: { tier: string; badge: string; flavour_text: string };
};

const BACKEND_URL = 'http://localhost:8000';

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [phase, setPhase] = useState<Phase>('idle');
  const [file, setFile] = useState<string | null>(null);
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [analyseError, setAnalyseError] = useState<string | null>(null);
  const [sort, setSort] = useState<'match' | 'salary' | 'date'>('date');
  const [filterRegion, setFilterRegion] = useState('All Regions');
  const [filterType, setFilterType] = useState('All Categories');
  const [filterLevel, setFilterLevel] = useState('All Levels');
  const [filterSalary, setFilterSalary] = useState('Any Salary');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgent, setFilterUrgent] = useState(false);
  const fRef = useRef<HTMLInputElement>(null);

  const accept = (f: File) => { setFile(f.name); setFileObj(f); setPhase('uploaded'); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) accept(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) accept(f);
  };

  const analyse = async () => {
    if (!fileObj) return;
    setPhase('analyzing');
    setStep(0);
    setAnalyseError(null);
    setCurrentView('browse');

    // Advance the step indicator while the request is in flight
    const stepTimer = setInterval(() => {
      setStep((s) => (s < ANALYSIS_STEPS.length - 2 ? s + 1 : s));
    }, 800);

    try {
      const payload = JOBS.map((j) => ({
        id:     j.id,
        desc:   j.desc,
        skills: j.skills,
        level:  j.level,
      }));

      const form = new FormData();
      form.append('file', fileObj);
      form.append('jobs', JSON.stringify(payload));

      const res = await fetch(`${BACKEND_URL}/analyze`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      // Build a lookup from jobId → backend result
      const byId = new Map<number, { score: number; matched_skills: string[]; verdict?: AnalysisResult['verdict'] }>();
      for (const r of data.results) {
        byId.set(r.jobId, { score: r.score, matched_skills: r.matched_skills, verdict: r.verdict });
      }

      const scored: AnalysisResult[] = JOBS.map((job) => {
        const hit = byId.get(job.id);
        return {
          job,
          score:   hit ? hit.score          : 0,
          matched: hit ? hit.matched_skills  : [],
          verdict: hit?.verdict,
        };
      }).sort((a, b) => b.score - a.score);

      clearInterval(stepTimer);
      setStep(ANALYSIS_STEPS.length - 1);
      setResults(scored);
      setPhase('done');
      setSort('match');
    } catch (err) {
      clearInterval(stepTimer);
      const msg = err instanceof Error ? err.message : String(err);
      setAnalyseError(msg);
      setPhase('uploaded'); // allow retry
    }
  };

  const reset = () => {
    setPhase('idle'); setFile(null); setFileObj(null); setStep(0);
    setResults([]); setAnalyseError(null);
    setSort('date'); setFilterRegion('All Regions'); setFilterType('All Categories');
    setFilterLevel('All Levels'); setFilterSalary('Any Salary');
    setFilterUrgent(false);
    setSelectedJobId(null); setShowAnalysis(false);
  };

  const displayedJobs = useMemo(() => {
    const list = phase === 'done' ? results : JOBS.map((job) => ({ job, score: 0, matched: [] }));
    return list
      .filter((r) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          r.job.title.toLowerCase().includes(q) ||
          r.job.company.toLowerCase().includes(q) ||
          r.job.region.toLowerCase().includes(q) ||
          r.job.macro.toLowerCase().includes(q) ||
          r.job.type.toLowerCase().includes(q) ||
          r.job.skills.some((s) => s.toLowerCase().includes(q)) ||
          r.job.desc.toLowerCase().includes(q)
        );
      })
      .filter((r) => filterRegion === 'All Regions' || r.job.macro === filterRegion)
      .filter((r) => filterType === 'All Categories' || r.job.type === filterType)
      .filter((r) => filterLevel === 'All Levels' || r.job.level === filterLevel)
      .filter((r) => !filterUrgent || r.job.urgent)
      .filter((r) => {
        if (filterSalary === 'Any Salary') return true;
        const v = parseFloat(r.job.salary.replace(/[^\d.]/g, ''));
        if (filterSalary === '₱2M+') return v >= 2;
        if (filterSalary === '₱4M+') return v >= 4;
        if (filterSalary === '₱6M+') return v >= 6;
        if (filterSalary === '₱8M+') return v >= 8;
        return true;
      });
  }, [results, phase, filterRegion, filterType, filterLevel, filterSalary, searchQuery, filterUrgent]);

  const sortedJobs = useMemo(() => {
    const list = [...displayedJobs];
    if (sort === 'match' && phase === 'done') list.sort((a, b) => b.score - a.score);
    if (sort === 'salary') list.sort((a, b) => parseFloat(b.job.salary.replace(/[^\d.]/g, '')) - parseFloat(a.job.salary.replace(/[^\d.]/g, '')));
    if (sort === 'date') list.sort((a, b) => new Date(b.job.posted).getTime() - new Date(a.job.posted).getTime());
    return list;
  }, [displayedJobs, sort, phase]);

  const strongMatches = results.filter((r) => r.score >= 80).length;
  const selectedJob = sortedJobs.find((r) => r.job.id === selectedJobId);
  const allLevels = [...new Set(JOBS.map((j) => j.level))];
  const pct = step === 0 ? 0 : step === 1 ? 50 : 100;
  const companyInsights = phase === 'done' ? getCompanyInsights(results) : [];
  const suggestions = phase === 'done' ? getImprovementSuggestions(JOBS, EXTRACTED_SKILLS) : [];

  const handleShareAnalysis = () => {
    const txt = `My DexMatch Profile Analysis:\n✅ ${EXTRACTED_SKILLS.length} skills detected\n🎯 ${strongMatches} strong matches\n🏢 Top company: ${companyInsights[0]?.company || 'N/A'}\n\nFind your match at DexMatch!`;
    if (navigator.share) { navigator.share({ title: 'DexMatch Analysis', text: txt }); }
    else { navigator.clipboard.writeText(txt); alert('Analysis copied to clipboard!'); }
  };

  const handleDownloadReport = () => {
    let r = `DEXMATCH PROFILE ANALYSIS REPORT\nGenerated: ${new Date().toLocaleDateString()}\n\n${'='.repeat(50)}\n\n`;
    r += `OVERVIEW\n${'-'.repeat(50)}\nSkills Detected: ${EXTRACTED_SKILLS.length}\nPositions Analyzed: ${results.length}\nStrong Matches (80%+): ${strongMatches}\n\n`;
    r += `YOUR SKILLSET\n${'-'.repeat(50)}\n${EXTRACTED_SKILLS.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`;
    r += `TOP COMPANY MATCHES\n${'-'.repeat(50)}\n`;
    companyInsights.forEach((ins, i) => {
      r += `${i + 1}. ${ins.company} — ${ins.avgScore}% avg match (${ins.jobCount} positions)\n`;
      const strengths = getCompanyStrengths(ins.company, JOBS, EXTRACTED_SKILLS);
      if (strengths.length) {
        r += `   STRENGTHS:\n${strengths.map((s) => `   • ${s.title}: ${s.desc}`).join('\n')}\n`;
      }
      const improvements = getCompanyImprovements(ins.company, JOBS, EXTRACTED_SKILLS);
      if (improvements.length) {
        r += `   IMPROVEMENTS:\n${improvements.map((s) => `   • ${s.title}: ${s.desc}`).join('\n')}\n`;
      }
      r += '\n';
    });
    r += `GENERAL POINTS FOR IMPROVEMENT\n${'-'.repeat(50)}\n`;
    suggestions.forEach((s, i) => { r += `${i + 1}. ${s.title} [${s.impact.toUpperCase()} IMPACT]\n   ${s.desc}\n\n`; });

    const blob = new Blob([r], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DexMatch-Analysis-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Navigation */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between gap-8 px-8 border-b"
        style={{ height: '64px', background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--s1)' }}
      >
        <button onClick={() => setCurrentView('landing')} className="flex items-center gap-3 shrink-0">
          <img src={dexMatchLogo} alt="DexMatch Logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
          <div className="flex flex-col items-start">
            <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'DM Sans', color: 'var(--t1)', lineHeight: 1.1 }}>DexMatch</div>
            <div style={{ fontSize: '10px', color: 'var(--t4)', letterSpacing: '0.3px' }}>Career Network</div>
          </div>
        </button>

        {currentView !== 'landing' && (
          <div className="flex-1 max-w-[400px] mx-auto relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon.Search size={14} color="var(--t3)" />
            </div>
            <input
              type="text"
              placeholder="Search roles, companies, skills, regions…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[40px] px-3 pl-9 rounded-lg text-sm outline-none border"
              style={{ background: 'var(--surface)', borderColor: searchQuery ? 'var(--red)' : 'var(--border)', color: 'var(--t1)' }}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <Icon.Close size={12} color="var(--t3)" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-6">
          <button
            onClick={() => { setCurrentView('browse'); setSelectedJobId(null); }}
            style={{ fontSize: '14px', fontWeight: 500, color: currentView === 'browse' ? 'var(--red)' : 'var(--t2)' }}
          >Browse Jobs</button>
          <button
            onClick={() => setCurrentView('companies')}
            style={{ fontSize: '14px', fontWeight: 500, color: currentView === 'companies' ? 'var(--red)' : 'var(--t2)' }}
          >Companies</button>
          {phase === 'done' && (
            <button
              onClick={() => setShowAnalysis(true)}
              className="flex items-center gap-2"
              style={{ fontSize: '14px', fontWeight: 500, color: 'var(--red)' }}
            >
              <Icon.BarChart size={14} color="var(--red)" />
              My Analysis
            </button>
          )}
          <div className="w-px h-5" style={{ background: 'var(--border)' }} />
          <button
            className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
            style={{ background: 'var(--red)' }}
            onClick={() => { setCurrentView('browse'); setTimeout(() => fRef.current?.click(), 100); }}
          >Get Started</button>
        </div>
      </header>

      {/* Main Content */}
      {currentView === 'landing' ? (
        <LandingPage
          onGetStarted={() => setCurrentView('browse')}
          onUploadCV={() => { setCurrentView('browse'); setTimeout(() => fRef.current?.click(), 100); }}
        />
      ) : currentView === 'companies' ? (
        <CompaniesView
          onBrowseCompany={(company) => {
            setSearchQuery(company);
            setCurrentView('browse');
          }}
        />
      ) : (
        <>
          {showAnalysis && phase === 'done' && (
            <AnalysisModal
              onClose={() => setShowAnalysis(false)}
              results={results}
              companyInsights={companyInsights}
              suggestions={suggestions}
              strongMatches={strongMatches}
              onShare={handleShareAnalysis}
              onDownloadReport={handleDownloadReport}
            />
          )}
          {selectedJob && (
            <JobDetailOverlay result={selectedJob} showScore={phase === 'done'} onClose={() => setSelectedJobId(null)} />
          )}
          <div className="max-w-[1600px] mx-auto px-8 py-8">
            <div className="mb-8">
              <ProfileAnalyzer
                phase={phase} file={file} drag={drag} step={step} pct={pct}
                results={results} strongMatches={strongMatches} fRef={fRef}
                handleFileChange={handleFileChange} handleDrop={handleDrop}
                setDrag={setDrag} analyse={analyse} reset={reset}
                analyseError={analyseError}
                onShowAnalysis={() => setShowAnalysis(true)}
              />
            </div>
            <JobsSection
              sortedJobs={sortedJobs} selectedJobId={selectedJobId} setSelectedJobId={setSelectedJobId}
              showScore={phase === 'done'} sort={sort} setSort={setSort} phase={phase}
              filterRegion={filterRegion} setFilterRegion={setFilterRegion}
              filterType={filterType} setFilterType={setFilterType}
              filterLevel={filterLevel} setFilterLevel={setFilterLevel}
              filterSalary={filterSalary} setFilterSalary={setFilterSalary}
              filterUrgent={filterUrgent} setFilterUrgent={setFilterUrgent}
              allLevels={allLevels}
              searchQuery={searchQuery}
            />
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes progressFill { from { width:0; } }
      `}</style>
    </div>
  );
}

// ─── Half Circle Step Indicator ──────────────────────────────────────────────
function HalfCircleStep({ label }: { label: string }) {
  return (
    <div className="flex justify-center mb-5">
      <div className="relative flex items-end justify-center" style={{ width: '80px', height: '40px' }}>
        {/* Outer navy arc */}
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path d="M2 40 A38 38 0 0 1 78 40 Z" fill="#1A1E35" />
        </svg>
        {/* Inner red fill */}
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path d="M7 40 A33 33 0 0 1 73 40 Z" fill="#D93922" />
        </svg>
        {/* Step label */}
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
          <text x="40" y="34" textAnchor="middle" fontSize="15" fontWeight="900" fill="white" fontFamily="DM Mono, monospace">{label}</text>
        </svg>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onGetStarted, onUploadCV }: { onGetStarted: () => void; onUploadCV: () => void }) {
  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, #1A1E35 100%)',
          paddingTop: '110px',
          paddingBottom: '130px',
        }}
      >
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute', top: '10%', right: '-80px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(217,57,34,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(232,184,75,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div className="max-w-[1200px] mx-auto px-8 relative z-10">
          <div className="text-center max-w-[860px] mx-auto">
            <h1
              className="mb-6"
              style={{ fontSize: '58px', fontWeight: 900, lineHeight: 1.08, color: 'white', letterSpacing: '-0.02em' }}
            >
              Find Your Perfect<br />Career Match
            </h1>

            <p
              style={{ fontSize: '19px', lineHeight: 1.65, color: 'rgba(255,255,255,0.72)', maxWidth: '640px', margin: '0 auto 48px' }}
            >
              Upload your CV and let DexMatch connect you with the best opportunities across{' '}
              <strong style={{ color: 'var(--gold)' }}>leading companies</strong> in the network
            </p>

            <div className="flex gap-4 justify-center mb-20">
              <button
                onClick={onUploadCV}
                className="px-10 py-5 rounded-xl font-bold text-lg text-white flex items-center gap-3 transition-all hover:shadow-lg"
                style={{ background: 'var(--red)' }}
              >
                <Icon.Upload size={20} color="white" />
                Upload CV &amp; Get Matched
              </button>
              <button
                onClick={onGetStarted}
                className="px-10 py-5 rounded-xl font-bold text-lg transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.18)', color: 'white' }}
              >
                Browse {DISPLAY_OPENINGS} Jobs
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-8 max-w-[580px] mx-auto">
              {[
                { num: UNIQUE_COMPANIES, label: 'Partner Companies' },
                { num: UNIQUE_REGIONS.length, label: 'Regions' },
                { num: DISPLAY_OPENINGS, label: 'Open Positions' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '40px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '-0.02em' }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-8" style={{ background: 'var(--surface)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2
              className="mb-4"
              style={{ fontSize: '42px', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em' }}
            >
              How DexMatch Works
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--t3)', maxWidth: '560px', margin: '0 auto' }}>
              Our platform analyses your profile and matches you with the perfect opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Icon.Upload,
                step: '01',
                title: 'Upload Your Profile',
                desc: 'Upload your CV in PDF, DOCX, or TXT format. Our system extracts your skills, experience, and qualifications instantly.',
              },
              {
                icon: Icon.Sparkle,
                step: '02',
                title: 'Get Instant Analysis',
                desc: 'Receive personalised match scores for every position. See detailed insights on company fit and skill alignment.',
              },
              {
                icon: Icon.Briefcase,
                step: '03',
                title: 'Apply with Confidence',
                desc: 'Review improvement suggestions and strengths analysis per company, then apply to your top matches.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border transition-all hover:shadow-xl"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                {/* Half-circle step number */}
                <HalfCircleStep label={item.step} />

                <div className="mb-4 flex justify-center">
                  <item.icon size={36} color="var(--red)" />
                </div>

                <h3 className="mb-3 text-center" style={{ fontSize: '21px', fontWeight: 700, color: 'var(--t1)' }}>
                  {item.title}
                </h3>
                <p className="text-center" style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--t3)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-28 px-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1A1E35 100%)' }}
      >
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(217,57,34,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <div className="max-w-[760px] mx-auto relative z-10">
          <h2
            className="mb-5"
            style={{ fontSize: '46px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}
          >
            Ready to Find Your Dream Career?
          </h2>
          <p className="mb-10" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            Join thousands of professionals who found their perfect role through DexMatch
          </p>
          <button
            onClick={onUploadCV}
            className="px-12 py-5 rounded-xl font-bold text-lg text-white inline-flex items-center gap-3 transition-all hover:shadow-lg"
            style={{ background: 'var(--red)' }}
          >
            <Icon.Upload size={22} color="white" />
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Profile Analyzer ─────────────────────────────────────────────────────────
function ProfileAnalyzer({ phase, file, drag, step, pct, results, strongMatches, fRef, handleFileChange, handleDrop, setDrag, analyse, reset, analyseError, onShowAnalysis }: any) {
  const STEPS = ['Scanning…', 'Matching…', 'Done'];

  return (
    <div
      className="rounded-2xl border p-8"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--s2)' }}
    >
      <div className="max-w-[1000px] mx-auto">
        {analyseError && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
            style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid var(--red)' }}
          >
            <span style={{ fontWeight: 700 }}>Backend error:</span>
            <span>{analyseError} — make sure the Python server is running (<code>uvicorn main:app --reload</code>)</span>
          </div>
        )}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--t1)' }}>Profile Analyzer</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--t3)', maxWidth: '580px', margin: '0 auto' }}>
            {phase === 'done'
              ? `Analysis complete! ${strongMatches} strong matches found across ${DISPLAY_OPENINGS} open positions`
              : 'Upload your CV and DexMatch will match you with the best opportunities'}
          </p>
        </div>

        {phase === 'analyzing' ? (
          <div className="py-8">
            <div className="h-3 rounded-full overflow-hidden mb-4" style={{ background: 'var(--border)' }}>
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--red), var(--gold))', animation: 'progressFill 0.8s ease-out' }}
              />
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>{STEPS[step]}</div>
              <div style={{ fontSize: '13px', color: 'var(--t3)' }}>Analysing your profile and matching with opportunities…</div>
            </div>
          </div>
        ) : phase === 'done' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { val: EXTRACTED_SKILLS.length, label: 'Skills Detected', color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green)' },
                { val: DISPLAY_OPENINGS, label: 'Positions Available', color: 'var(--amber)', bg: 'var(--amber-bg)', border: 'var(--amber)' },
                { val: strongMatches, label: 'Strong Matches', color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green)' },
              ].map((stat, i) => (
                <div key={i} className="p-5 rounded-xl text-center" style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '32px', fontWeight: 700, color: stat.color }}>{stat.val}</div>
                  <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onShowAnalysis}
                className="px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-md"
                style={{ background: 'var(--red)', color: 'white' }}
              >
                <Icon.BarChart size={16} color="white" />
                View Full Analysis
              </button>
              <button
                onClick={reset}
                className="px-8 py-3 rounded-lg border font-semibold transition-all"
                style={{ borderColor: 'var(--border)', color: 'var(--t2)' }}
              >
                Upload New CV
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              className="border-2 border-dashed rounded-xl p-16 cursor-pointer transition-all mb-4"
              style={{
                borderColor: drag ? 'var(--red)' : phase === 'uploaded' ? 'var(--green)' : 'var(--border-2)',
                background: drag ? 'color-mix(in srgb, var(--red) 4%, var(--surface))' : phase === 'uploaded' ? 'var(--green-bg)' : 'var(--surface-2)',
              }}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => fRef.current?.click()}
            >
              <input ref={fRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileChange} />
              {phase === 'uploaded' ? (
                <div className="flex flex-col items-center">
                  <Icon.Check size={44} color="var(--green)" />
                  <div className="mt-4" style={{ fontSize: '17px', fontWeight: 700, color: 'var(--green)' }}>{file}</div>
                  <div className="mt-2" style={{ fontSize: '13px', color: 'var(--t3)' }}>Click to replace or drag another file</div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-2"
                    style={{ background: 'color-mix(in srgb, var(--red) 10%, var(--surface-2))' }}>
                    <Icon.Upload size={36} color="var(--red)" />
                  </div>
                  <div className="mt-3" style={{ fontSize: '19px', fontWeight: 700, color: 'var(--t1)' }}>Drop your CV here</div>
                  <div className="mt-2" style={{ fontSize: '13px', color: 'var(--t3)' }}>Supports PDF, DOCX, and TXT formats</div>
                  <div className="mt-4 px-4 py-1.5 rounded-full" style={{ background: 'var(--red-bg)', fontSize: '11px', color: 'var(--red)', fontWeight: 600 }}>
                    {DISPLAY_OPENINGS} positions available to match
                  </div>
                </div>
              )}
            </div>
            <button
              className="w-full h-14 rounded-lg font-bold text-base transition-all"
              style={{
                background: phase === 'uploaded' ? 'var(--red)' : 'var(--surface-2)',
                color: phase === 'uploaded' ? 'white' : 'var(--t4)',
                cursor: phase === 'uploaded' ? 'pointer' : 'not-allowed',
              }}
              disabled={phase !== 'uploaded'}
              onClick={analyse}
            >
              Analyse Profile &amp; Find Matches
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Analysis Modal ───────────────────────────────────────────────────────────
function AnalysisModal({ onClose, results, companyInsights, suggestions, strongMatches, onShare, onDownloadReport }: any) {
  const [activeTab, setActiveTab] = useState<'companies' | 'general'>('companies');

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.55)', animation: 'fadeIn 0.2s ease' }}
      onClick={onClose}
    >
      <div className="min-h-screen px-4 py-8">
        <div
          className="max-w-[1060px] mx-auto rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface)', boxShadow: 'var(--s4)', animation: 'slideDown 0.3s ease' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-6 border-b flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1A1E35 100%)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <Icon.BarChart size={22} color="var(--red)" />
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>Your Profile Analysis</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onDownloadReport}
                className="px-4 py-2 rounded-lg border font-semibold flex items-center gap-2 transition-all hover:bg-white hover:bg-opacity-10"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '13px' }}
              >
                <Icon.Upload size={13} color="currentColor" />
                Download Report
              </button>
              <button
                onClick={onShare}
                className="px-4 py-2 rounded-lg border font-semibold flex items-center gap-2 transition-all hover:bg-white hover:bg-opacity-10"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '13px' }}
              >
                <Icon.Globe size={13} color="currentColor" />
                Share
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white hover:bg-opacity-10"
              >
                <Icon.Close size={16} color="white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[calc(100vh-180px)] overflow-y-auto">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { val: EXTRACTED_SKILLS.length, label: 'Skills Detected', color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green)' },
                { val: DISPLAY_OPENINGS, label: 'Positions Available', color: 'var(--amber)', bg: 'var(--amber-bg)', border: 'var(--amber)' },
                { val: strongMatches, label: 'Strong Matches (80%+)', color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green)' },
              ].map((s, i) => (
                <div key={i} className="p-5 rounded-xl" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '34px', fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '13px', color: 'var(--t2)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Skillset */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)' }}>
                <Icon.Tag size={16} color="var(--green)" />
                Your Skillset
              </h3>
              <div className="flex flex-wrap gap-2">
                {EXTRACTED_SKILLS.map((skill: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
                    style={{ background: 'var(--green-bg)', color: 'var(--green)', fontSize: '12px', fontWeight: 600 }}
                  >
                    <Icon.Check size={11} color="var(--green)" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
              {[
                { key: 'companies', label: 'Company Breakdown' },
                { key: 'general', label: 'General Improvements' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className="px-5 py-3 text-sm font-semibold transition-all"
                  style={{
                    color: activeTab === tab.key ? 'var(--red)' : 'var(--t3)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--red)' : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Company Breakdown */}
            {activeTab === 'companies' && (
              <div className="space-y-5">
                {companyInsights.map((insight: any, i: number) => {
                  const company = COMPANIES[insight.company];
                  const strengths = getCompanyStrengths(insight.company, JOBS, EXTRACTED_SKILLS);
                  const improvements = getCompanyImprovements(insight.company, JOBS, EXTRACTED_SKILLS);
                  const matchInfo = getMatchLabel(insight.avgScore);
                  const scoreColor = matchInfo.color;
                  const scoreBg = matchInfo.bg;

                  return (
                    <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      {/* Company header */}
                      <div className="p-5 flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shrink-0 overflow-hidden"
                            style={{ background: company.logoBg, color: company.logoText }}
                          >
                            {typeof company.logo === 'string' && company.logo.length > 5 ? (
                              <img src={company.logo} alt={company.logoText} className="w-full h-full object-cover" />
                            ) : (
                              company.logo
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>{insight.company}</div>
                            <div style={{ fontSize: '12px', color: 'var(--t3)' }}>
                              {insight.jobCount} position{insight.jobCount > 1 ? 's' : ''} available · {company.industry}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div
                            className="px-4 py-2 rounded-xl"
                            style={{ background: scoreBg, color: scoreColor, fontFamily: 'DM Mono', fontSize: '20px', fontWeight: 700 }}
                          >
                            {insight.avgScore}%
                          </div>
                          <div
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ background: scoreBg, color: scoreColor }}
                          >
                            {matchInfo.label}
                          </div>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div style={{ height: '4px', background: 'var(--border)' }}>
                        <div style={{ height: '100%', width: `${insight.avgScore}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`, transition: 'width 0.6s ease' }} />
                      </div>

                      {/* Two-column breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Strengths */}
                        <div className="p-5 border-r border-b md:border-b-0" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-2 mb-3">
                            <Icon.Check size={14} color="var(--green)" />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>
                              Why You're a Strong Match
                            </span>
                          </div>
                          {strengths.length > 0 ? (
                            <div className="space-y-2.5">
                              {strengths.map((s: any, j: number) => (
                                <div key={j} className="flex items-start gap-2">
                                  <div
                                    className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--green-bg)' }}
                                  >
                                    <Icon.Check size={9} color="var(--green)" />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--t1)' }}>{s.title}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--t3)', lineHeight: 1.5 }}>{s.desc}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: 'var(--t4)', fontStyle: 'italic' }}>
                              Upload a CV with relevant skills to see strengths.
                            </div>
                          )}
                        </div>

                        {/* Improvements */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Icon.Lightning size={14} color="var(--amber)" />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--amber)' }}>
                              Points of Improvement
                            </span>
                          </div>
                          {improvements.length > 0 ? (
                            <div className="space-y-2.5">
                              {improvements.map((imp: any, j: number) => (
                                <div key={j} className="flex items-start gap-2">
                                  <div
                                    className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--amber-bg)' }}
                                  >
                                    <Icon.Lightning size={9} color="var(--amber)" />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--t1)' }}>{imp.title}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--t3)', lineHeight: 1.5 }}>{imp.desc}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: 'var(--t4)', fontStyle: 'italic' }}>
                              Great news — no major skill gaps detected for this company!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab: General Improvements */}
            {activeTab === 'general' && (
              <div className="space-y-3">
                {suggestions.map((sug: any, i: number) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>{sug.title}</span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={{
                          background: sug.impact === 'high' ? 'var(--red-bg)' : sug.impact === 'medium' ? 'var(--amber-bg)' : 'var(--surface)',
                          color: sug.impact === 'high' ? 'var(--red)' : sug.impact === 'medium' ? 'var(--amber)' : 'var(--t3)',
                        }}
                      >
                        {sug.impact} impact
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--t3)', lineHeight: 1.65 }}>{sug.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Jobs Section ─────────────────────────────────────────────────────────────
function JobsSection({ sortedJobs, selectedJobId, setSelectedJobId, showScore, sort, setSort, phase, filterRegion, setFilterRegion, filterType, setFilterType, filterLevel, setFilterLevel, filterSalary, setFilterSalary, filterUrgent, setFilterUrgent, allLevels, searchQuery }: any) {
  return (
    <div>
      <div className="mb-6 p-6 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--t1)' }}>
              {sortedJobs.length} Position{sortedJobs.length !== 1 ? 's' : ''} Available
              {searchQuery && <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--t3)' }}> for "{searchQuery}"</span>}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--t3)' }}>
              {phase === 'done' ? 'Sorted by best match' : 'Browse all opportunities'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '11px', color: 'var(--t4)' }}>Sort by:</span>
            <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              {[
                { key: 'match', label: 'Best Match', disabled: phase !== 'done' },
                { key: 'salary', label: 'Salary', disabled: false },
                { key: 'date', label: 'Date', disabled: false },
              ].map((s) => (
                <button
                  key={s.key}
                  className="px-4 py-2 text-xs font-semibold transition-all"
                  style={{
                    background: sort === s.key ? 'var(--navy)' : 'var(--surface)',
                    color: sort === s.key ? 'white' : s.disabled ? 'var(--t4)' : 'var(--t3)',
                    cursor: s.disabled ? 'not-allowed' : 'pointer',
                    opacity: s.disabled ? 0.5 : 1,
                  }}
                  onClick={() => !s.disabled && setSort(s.key)}
                  disabled={s.disabled}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Icon.Filter size={13} color="var(--t3)" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Filters</span>
          </div>
          {[
            { value: filterRegion, onChange: setFilterRegion, options: ['All Regions', ...UNIQUE_REGIONS] },
            { value: filterType, onChange: setFilterType, options: ['All Categories', ...Object.keys(JOB_TYPES)] },
            { value: filterLevel, onChange: setFilterLevel, options: ['All Levels', ...allLevels] },
            { value: filterSalary, onChange: setFilterSalary, options: ['Any Salary', '₱2M+', '₱4M+', '₱6M+', '₱8M+'] },
          ].map((sel, i) => (
            <select
              key={i}
              className="h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--t2)' }}
              value={sel.value}
              onChange={(e) => sel.onChange(e.target.value)}
            >
              {sel.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
          {/* Urgent-only toggle */}
          <button
            onClick={() => setFilterUrgent(!filterUrgent)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all"
            style={{
              background: filterUrgent ? 'var(--red)' : 'var(--surface)',
              borderColor: filterUrgent ? 'var(--red)' : 'var(--border)',
              color: filterUrgent ? 'white' : 'var(--t3)',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            <Icon.Lightning size={11} color={filterUrgent ? 'white' : 'var(--t3)'} />
            Urgent Hire
          </button>

          {(filterRegion !== 'All Regions' || filterType !== 'All Categories' || filterLevel !== 'All Levels' || filterSalary !== 'Any Salary' || filterUrgent) && (
            <button
              onClick={() => { setFilterRegion('All Regions'); setFilterType('All Categories'); setFilterLevel('All Levels'); setFilterSalary('Any Salary'); setFilterUrgent(false); }}
              style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 600 }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedJobs.map((result: any) => (
          <JobCard
            key={result.job.id}
            result={result}
            selected={selectedJobId === result.job.id}
            onClick={() => setSelectedJobId(result.job.id)}
            showScore={showScore}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ result, selected, onClick, showScore }: { result: { job: Job; score: number; matched: string[] }; selected: boolean; onClick: () => void; showScore: boolean }) {
  const { job, score } = result;
  const company = COMPANIES[job.company];
  const typeInfo = JOB_TYPES[job.type as JobType];

  // Industry-coded left border for normal cards; full box highlight for urgent
  const urgentStyle = job.urgent
    ? {
        border: '2px solid var(--red)',
        background: selected
          ? 'color-mix(in srgb, var(--red) 6%, var(--surface))'
          : 'color-mix(in srgb, var(--red) 3%, var(--surface))',
        boxShadow: '0 4px 16px rgba(217,57,34,0.14)',
      }
    : {
        borderTop: `1px solid ${selected ? 'var(--navy)' : 'var(--border)'}`,
        borderRight: `1px solid ${selected ? 'var(--navy)' : 'var(--border)'}`,
        borderBottom: `1px solid ${selected ? 'var(--navy)' : 'var(--border)'}`,
        borderLeft: `3px solid ${typeInfo.barColor}`,
        background: selected ? 'color-mix(in srgb, var(--navy) 3%, var(--surface))' : 'var(--surface)',
        boxShadow: selected ? 'var(--s2)' : 'none',
      };

  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl transition-all hover:shadow-lg w-full overflow-hidden flex flex-col"
      style={urgentStyle}
    >
      {/* Urgent banner */}
      {job.urgent && (
        <div
          className="px-3 py-1.5 flex items-center gap-1.5"
          style={{ background: 'var(--red)' }}
        >
          <Icon.Lightning size={10} color="white" />
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'white', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            Urgent Hire
          </span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Company row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black overflow-hidden shrink-0"
              style={{ background: company.logoBg, color: company.logoText }}
            >
              {typeof company.logo === 'string' && company.logo.length > 5 ? (
                <img src={company.logo} alt={company.logoText} className="w-full h-full object-cover" />
              ) : (
                company.logo
              )}
            </div>
            <div className="min-w-0">
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t2)' }} className="truncate">{job.company}</div>
              <div style={{ fontSize: '10px', color: 'var(--t4)' }}>{job.region}</div>
            </div>
          </div>
          {showScore && (() => {
            const ml = getMatchLabel(score);
            return (
              <div className="flex flex-col items-end gap-0.5 shrink-0 ml-1">
                <div
                  className="px-2 py-0.5 rounded-md text-xs font-bold"
                  style={{ fontFamily: 'DM Mono', background: ml.bg, color: ml.color }}
                >
                  {score}%
                </div>
                <div
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap"
                  style={{ background: ml.bg, color: ml.color }}
                >
                  {ml.label}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Industry type badge */}
        <div className="mb-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ background: typeInfo.bg, color: typeInfo.color, border: `1px solid ${typeInfo.barColor}33` }}
          >
            {job.type}
          </span>
        </div>

        {/* Job title */}
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)', marginBottom: '6px', lineHeight: 1.3 }}>
          {job.title}
        </h3>

        {/* Description excerpt */}
        <p
          style={{
            fontSize: '11px', color: 'var(--t3)', lineHeight: 1.6, marginBottom: '10px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          } as React.CSSProperties}
        >
          {job.desc}
        </p>

        {/* Salary + level */}
        <div className="flex items-center gap-1.5 mb-3" style={{ fontSize: '11px' }}>
          <span style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--t1)' }}>{job.salary}</span>
          <span style={{ color: 'var(--t4)' }}>·</span>
          <span style={{ color: 'var(--t3)' }}>{job.level}</span>
        </div>

        {/* Keyword chips */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {job.skills.slice(0, 3).map((skill: string, i: number) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-[10px] font-semibold"
              style={{ background: typeInfo.bg, color: typeInfo.color, border: `1px solid ${typeInfo.barColor}22` }}
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-semibold"
              style={{ background: 'var(--surface-2)', color: 'var(--t3)', border: '1px solid var(--border)' }}
            >
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Job Detail Helpers ────────────────────────────────────────────────────────
const TYPE_RESPONSIBILITIES: Record<string, string[]> = {
  'Research & Science': [
    'Design and execute field research protocols to gather comprehensive species and behavioural data',
    'Analyse datasets using statistical modelling, bioinformatics, and laboratory analysis tools',
    'Collaborate with cross-regional research teams on multi-year longitudinal studies',
    'Prepare peer-reviewed papers, technical reports, and policy submissions',
    'Maintain detailed laboratory records, field documentation, and specimen logs',
    'Present findings at regional conferences, symposiums, and internal knowledge sessions',
  ],
  'Battle & Training': [
    'Develop advanced battle strategies and optimised team compositions for competitive scenarios',
    'Train and mentor trainers of varying skill levels in type mechanics and move optimisation',
    'Evaluate challenger and student performance; deliver structured, data-driven feedback',
    'Maintain Pokémon team health, conditioning, and battle-readiness at all times',
    'Coordinate with League officials on scheduling, rules, and regulatory compliance',
    'Represent the organisation in sanctioned battles, exhibitions, and public media events',
  ],
  'Engineering & Tech': [
    'Architect, develop, and maintain technical systems, platforms, and core infrastructure',
    'Collaborate with cross-functional product and research teams on roadmap delivery',
    'Produce comprehensive technical documentation, system specifications, and runbooks',
    'Conduct thorough testing, debugging, and quality assurance on all deliverables',
    'Monitor system uptime and resolve incidents within defined service-level agreements',
    'Mentor junior engineers and lead team knowledge-sharing and code-review sessions',
  ],
  'Performance & Arts': [
    'Choreograph, direct, and produce seasonal Pokémon Contest and Showcase performances',
    'Mentor coordinators and stylists in move aesthetics, staging, and performance technique',
    'Design, source, and manage costumes, accessories, and stage production elements',
    'Coordinate rehearsal schedules, technical production logistics, and live event execution',
    'Evaluate contestant and performer presentations; provide expert, constructive feedback',
    'Cultivate partnerships with sponsors, broadcast media, and regional event organisations',
  ],
  'Healthcare & Welfare': [
    'Deliver direct clinical care and treatment for injured, ill, or distressed Pokémon',
    'Conduct routine health assessments and maintain detailed, up-to-date medical records',
    'Coordinate with specialist teams on complex diagnostic and multi-disciplinary treatment cases',
    'Supervise and train junior healthcare staff, interns, and Chansey assistants',
    'Develop and implement structured wellbeing programmes for both Trainers and Pokémon',
    'Liaise with regional health authorities to ensure ongoing regulatory compliance',
  ],
  'Conservation & Welfare': [
    'Monitor, assess, and actively manage wild Pokémon habitats and surrounding ecosystems',
    'Design and implement conservation, rehabilitation, and rewilding programmes',
    'Conduct environmental impact assessments, biodiversity surveys, and ecological audits',
    'Engage regional communities through conservation education and public outreach initiatives',
    'Produce quarterly research reports and policy briefings for environmental stakeholders',
    'Lead emergency wildlife response operations during ecological and habitat crisis events',
  ],
  'Law Enforcement & Patrol': [
    'Conduct regular patrols of assigned zones and respond promptly to all incidents',
    'Investigate illegal Pokémon capture, trafficking, and poaching operations',
    'Coordinate multi-unit responses to large-scale ecological and public safety emergencies',
    'Maintain accurate, detailed incident logs and submit formal reports to regional authorities',
    'Build positive, trust-based relationships with local communities and Trainer associations',
    'Train new recruits in field protocols, crisis response, and Capture Styler operation',
  ],
  'Media & Communications': [
    'Produce and host broadcast segments, podcasts, and live event commentary',
    'Research, script, and edit content for multiple platforms and diverse audience segments',
    'Conduct compelling interviews with Gym Leaders, Elite Four members, and top-tier Trainers',
    'Manage social media channels, community engagement, and regional digital strategy',
    'Collaborate with technical production teams on broadcast quality and delivery standards',
    'Track audience metrics and adapt content strategy based on performance analytics',
  ],
};

const LEVEL_REQUIREMENTS: Record<string, string[]> = {
  'Entry': [
    'Pokémon Trainer Certificate or equivalent foundational qualification',
    '0–1 year of relevant experience in a supervised or academic setting',
    'Strong foundational knowledge of Pokémon species, types, and core mechanics',
    'Excellent written and verbal communication skills, with a collaborative mindset',
    'Willingness to work flexible hours including field, shift-based, and outdoor environments',
  ],
  'Entry-Mid': [
    'Relevant diploma, degree, or equivalent professional certification',
    '1–3 years of hands-on experience in a related role or industry',
    'Demonstrated ability to operate independently in fast-paced, dynamic environments',
    'Solid written and verbal communication skills across standard professional contexts',
    'Proficiency in core technical or specialist tools relevant to the role',
  ],
  'Mid': [
    "Bachelor's degree or equivalent in a relevant professional or scientific field",
    '3–5 years of professional experience with a clear and measurable track record',
    'Demonstrated project ownership, initiative, and cross-functional collaboration skills',
    'Strong analytical, problem-solving, and evidence-based decision-making capabilities',
    'Experience mentoring junior team members and contributing positively to team growth',
  ],
  'Mid-Senior': [
    "Advanced degree, professional licence, or equivalent industry certifications preferred",
    '5–7 years of progressive experience in a closely related discipline or sector',
    'Proven ability to lead projects end-to-end from initiation through delivery and review',
    'Strong stakeholder management skills and executive-level communication capabilities',
    'Demonstrated track record of developing and retaining high-performing team members',
  ],
  'Senior': [
    "Bachelor's or Master's degree in a relevant technical or professional discipline",
    '7+ years of senior-level experience with measurable leadership and business impact',
    'Deep subject matter expertise with recognised credibility across the industry',
    'Strategic planning capability with a record of large-scale, complex project success',
    'Strong cross-organisational influence and executive stakeholder management skills',
  ],
  'Executive': [
    "Master's degree, PhD, or equivalent elite-level professional qualification required",
    '10+ years of executive, championship-level, or C-suite experience',
    'Exceptional leadership record with documented, transformational organisational impact',
    'Established professional network across regional Pokémon League and industry bodies',
    'Outstanding public representation, media presence, and strategic communication skills',
  ],
};

// ─── Job Detail Overlay ───────────────────────────────────────────────────────
function JobDetailOverlay({ result, showScore, onClose }: { result: { job: Job; score: number; matched: string[] }; showScore: boolean; onClose: () => void }) {
  const { job, score, matched } = result;
  const company = COMPANIES[job.company];
  const typeInfo = JOB_TYPES[job.type as JobType];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.5)', animation: 'fadeIn 0.2s ease' }}
      onClick={onClose}
    >
      <div className="min-h-screen px-4 py-8">
        <div
          className="max-w-[900px] mx-auto rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface)', boxShadow: 'var(--s4)', animation: 'slideDown 0.3s ease' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b" style={{ background: company.bannerBg, borderColor: 'var(--border)' }}>
            <button
              onClick={onClose}
              className="absolute right-6 top-6 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Icon.Close size={16} color="white" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-black shrink-0 overflow-hidden"
                style={{ background: company.logoBg, color: company.logoText }}
              >
                {typeof company.logo === 'string' && company.logo.length > 5 ? (
                  <img src={company.logo} alt={company.logoText} className="w-full h-full object-cover" />
                ) : (
                  company.logo
                )}
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{job.title}</h2>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <span>{job.company}</span>
                  <span>·</span>
                  <span>{job.region}</span>
                  <span>·</span>
                  <span style={{ fontFamily: 'DM Mono' }}>{job.salary}</span>
                </div>
                {job.urgent && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: 'var(--red)', fontSize: '11px', fontWeight: 700, color: 'white' }}>
                    <Icon.Lightning size={10} color="white" />
                    Urgent Hire
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="flex gap-3 mb-6">
              <button className="flex-1 h-12 rounded-lg font-bold" style={{ background: 'var(--red)', color: 'white' }}>
                Apply Now
              </button>
              <button className="px-5 h-12 rounded-lg font-semibold border" style={{ borderColor: 'var(--border)', color: 'var(--t2)' }}>
                Save Role
              </button>
            </div>

            {/* Meta */}
            <div className="mb-5 flex items-center gap-2 flex-wrap">
              <span
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: typeInfo.bg, color: typeInfo.color }}
              >
                {job.type}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--t4)' }}>· {job.level} · Posted {job.posted}</span>
            </div>

            {/* ── Skills & Keywords — always visible ── */}
            <div className="mb-6 p-5 rounded-xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon.Tag size={14} color={typeInfo.color} />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>Skills &amp; Keywords</h3>
              </div>

              {/* Industry label */}
              <div className="mb-3">
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Industry
                </span>
                <div className="mt-1.5">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold"
                    style={{ background: typeInfo.bg, color: typeInfo.color, border: `1px solid ${typeInfo.barColor}33` }}>
                    {job.type}
                  </span>
                </div>
              </div>

              {/* Key skills */}
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Required Skills
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {job.skills.map((skill: string, i: number) => {
                    const isMatched = showScore && matched.includes(skill);
                    return (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1"
                        style={{
                          background: isMatched ? 'var(--green-bg)' : typeInfo.bg,
                          color: isMatched ? 'var(--green)' : typeInfo.color,
                          border: `1px solid ${isMatched ? 'var(--green)' : typeInfo.barColor}33`,
                        }}
                      >
                        {isMatched && <Icon.Check size={9} color="var(--green)" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Match score — only when analysis done */}
            {showScore && (() => {
              const ml = getMatchLabel(score);
              return (
                <div className="mb-6 p-5 rounded-xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>Match Score</span>
                      <div className="mt-1">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: ml.bg, color: ml.color }}
                        >
                          {ml.label}
                        </span>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1.5 rounded-lg font-bold"
                      style={{ fontFamily: 'DM Mono', fontSize: '22px', background: ml.bg, color: ml.color }}
                    >
                      {score}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${score}%`, background: ml.color }} />
                  </div>
                  <p className="mt-3" style={{ fontSize: '12px', color: 'var(--t3)' }}>
                    {matched.length} of {job.skills.length} required skills matched from your CV
                  </p>
                </div>
              );
            })()}

            {/* Role Overview */}
            <div className="mb-6 p-5 rounded-xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon.Briefcase size={14} color="var(--navy)" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>Role Overview</h3>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--t2)' }}>{job.desc}</p>
            </div>

            {/* Key Responsibilities */}
            <div className="mb-6 p-5 rounded-xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon.List size={14} color="var(--red)" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>Key Responsibilities</h3>
              </div>
              <ul className="space-y-2.5">
                {(TYPE_RESPONSIBILITIES[job.type] || []).map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="mt-1.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--red-bg)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)' }} />
                    </div>
                    <span style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--t2)' }}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="mb-6 p-5 rounded-xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon.Check size={14} color="var(--green)" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>Requirements</h3>
              </div>
              <ul className="space-y-2.5">
                {(LEVEL_REQUIREMENTS[job.level] || LEVEL_REQUIREMENTS['Mid']).map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--green-bg)' }}
                    >
                      <Icon.Check size={9} color="var(--green)" />
                    </div>
                    <span style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--t2)' }}>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Company */}
            <div className="mb-6 p-5 rounded-xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon.Building size={14} color="var(--t3)" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>About {job.company}</h3>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--t2)' }}>{company.about}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Companies View ───────────────────────────────────────────────────────────
function CompaniesView({ onBrowseCompany }: { onBrowseCompany: (company: string) => void }) {
  const [previewCompany, setPreviewCompany] = useState<string | null>(null);

  const previewData = previewCompany ? {
    company: COMPANIES[previewCompany],
    jobs: JOBS.filter((j) => j.company === previewCompany),
    totalOpenings: JOBS.filter((j) => j.company === previewCompany).reduce((sum, j) => sum + j.openings, 0),
  } : null;

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--t1)', marginBottom: '6px' }}>Partner Companies</h1>
        <p style={{ fontSize: '15px', color: 'var(--t3)' }}>
          {UNIQUE_COMPANIES} leading organisations hiring through DexMatch — click any card to preview open roles
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(COMPANIES).map(([name, company]) => {
          const jobCount = JOBS.filter((j) => j.company === name).reduce((sum, j) => sum + j.openings, 0);
          return (
            <button
              key={name}
              onClick={() => setPreviewCompany(name)}
              className="p-5 rounded-xl border transition-all hover:shadow-lg text-left w-full"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-black mb-3 shrink-0 overflow-hidden"
                style={{ background: company.logoBg, color: company.logoText }}
              >
                {typeof company.logo === 'string' && company.logo.length > 5 ? (
                  <ImageWithFallback src={company.logo} alt={company.logoText} className="w-full h-full object-cover" />
                ) : (
                  company.logo
                )}
              </div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)', marginBottom: '4px' }}>{name}</h3>
              <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '12px', minHeight: '30px', lineHeight: 1.5 }}>
                {company.tagline}
              </p>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '10px', color: 'var(--t4)' }}>{company.industry}</span>
                <span
                  className="px-2 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: jobCount > 0 ? 'var(--green-bg)' : 'var(--surface-2)', color: jobCount > 0 ? 'var(--green)' : 'var(--t4)' }}
                >
                  {jobCount} {jobCount === 1 ? 'opening' : 'openings'}
                </span>
              </div>
              {/* Preview cue */}
              <div className="mt-3 flex items-center gap-1" style={{ fontSize: '10px', color: 'var(--red)', fontWeight: 600 }}>
                <Icon.Search size={10} color="var(--red)" />
                View open roles
              </div>
            </button>
          );
        })}
      </div>

      {/* Company Preview Modal */}
      {previewCompany && previewData && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.55)', animation: 'fadeIn 0.2s ease' }}
          onClick={() => setPreviewCompany(null)}
        >
          <div className="min-h-screen px-4 py-12 flex items-start justify-center">
            <div
              className="w-full max-w-[680px] rounded-2xl overflow-hidden"
              style={{ background: 'var(--surface)', boxShadow: 'var(--s4)', animation: 'slideDown 0.3s ease' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header — company banner */}
              <div
                className="p-6 border-b relative"
                style={{ background: previewData.company.bannerBg, borderColor: 'var(--border)' }}
              >
                <button
                  onClick={() => setPreviewCompany(null)}
                  className="absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <Icon.Close size={15} color="white" />
                </button>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-black shrink-0 overflow-hidden"
                    style={{ background: previewData.company.logoBg, color: previewData.company.logoText }}
                  >
                    {typeof previewData.company.logo === 'string' && previewData.company.logo.length > 5 ? (
                      <img src={previewData.company.logo} alt={previewData.company.logoText} className="w-full h-full object-cover" />
                    ) : (
                      previewData.company.logo
                    )}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '3px' }}>{previewCompany}</h2>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{previewData.company.industry}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{previewData.company.tagline}</div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="px-6 pt-5 pb-2">
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--t3)' }}>{previewData.company.about}</p>
              </div>

              {/* Job listing preview */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between mb-3 mt-4">
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>
                    Open Roles
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
                  >
                    {previewData.totalOpenings} {previewData.totalOpenings === 1 ? 'opening' : 'openings'}
                  </span>
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {previewData.jobs.map((job) => {
                    const typeInfo = JOB_TYPES[job.type as JobType];
                    return (
                      <div
                        key={job.id}
                        className="flex items-center justify-between px-4 py-3 rounded-xl border"
                        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', borderLeft: `3px solid ${typeInfo.barColor}` }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }} className="truncate">
                              {job.title}
                            </span>
                            {job.urgent && (
                              <span
                                className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                                style={{ background: 'var(--red)', color: 'white' }}
                              >
                                <Icon.Lightning size={8} color="white" />
                                Urgent
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold"
                              style={{ background: typeInfo.bg, color: typeInfo.color }}
                            >
                              {job.type}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--t4)' }}>{job.level} · {job.region}</span>
                          </div>
                        </div>
                        <div className="ml-3 shrink-0 text-right">
                          <div style={{ fontFamily: 'DM Mono', fontSize: '11px', fontWeight: 700, color: 'var(--t1)' }}>
                            {job.salary}
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--t4)', marginTop: '2px' }}>
                            {job.openings} {job.openings === 1 ? 'opening' : 'openings'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Footer */}
              <div className="px-6 pb-6 pt-2 flex gap-3">
                <button
                  onClick={() => { setPreviewCompany(null); onBrowseCompany(previewCompany); }}
                  className="flex-1 h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-md"
                  style={{ background: 'var(--red)', color: 'white', fontSize: '14px' }}
                >
                  <Icon.Briefcase size={15} color="white" />
                  Browse All Jobs from {previewCompany}
                </button>
                <button
                  onClick={() => setPreviewCompany(null)}
                  className="px-5 h-11 rounded-xl border font-semibold"
                  style={{ borderColor: 'var(--border)', color: 'var(--t2)', fontSize: '13px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
