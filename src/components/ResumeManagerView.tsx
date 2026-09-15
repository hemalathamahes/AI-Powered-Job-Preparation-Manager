import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Award,
  Layers,
  Check,
} from 'lucide-react';
import { ResumeProfile, ResumeBulletImprovement } from '../types';
import { ApiService } from '../services/api';

interface ResumeManagerViewProps {
  resume: ResumeProfile;
  onUpdateResume: (resume: ResumeProfile) => void;
  prefilledJobDesc?: string;
  prefilledRole?: string;
}

export const ResumeManagerView: React.FC<ResumeManagerViewProps> = ({
  resume,
  onUpdateResume,
  prefilledJobDesc = '',
  prefilledRole = '',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'ats'>('profile');
  const [jobDescription, setJobDescription] = useState(prefilledJobDesc);
  const [targetRole, setTargetRole] = useState(prefilledRole || resume.targetRole);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Resume editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedResume, setEditedResume] = useState<ResumeProfile>(resume);

  // Run ATS Scanner
  const handleRunAtsScan = async () => {
    setIsAnalyzing(true);
    try {
      // Assemble clean text of current resume
      const fullText = `
${resume.fullName} - ${resume.targetRole}
${resume.summary}
Skills: ${resume.skills.flatMap((s) => s.list).join(', ')}
Experience:
${resume.experience
  .map((e) => `${e.role} at ${e.company} (${e.duration}):\n${e.bullets.map((b) => `- ${b}`).join('\n')}`)
  .join('\n\n')}
Projects:
${resume.projects.map((p) => `${p.title} (${p.technologies}): ${p.description} Impact: ${p.impact}`).join('\n')}
      `;

      const analysis = await ApiService.analyzeResume({
        resumeText: fullText,
        targetRole: targetRole || resume.targetRole,
        jobDescription: jobDescription,
      });

      const updated = {
        ...resume,
        lastAtsAnalysis: {
          ...analysis,
          analyzedAt: new Date().toISOString(),
        },
      };
      onUpdateResume(updated);
    } catch (e) {
      console.error('Failed to run ATS analysis:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // One-click apply improved bullet
  const handleApplyBullet = (improvement: ResumeBulletImprovement) => {
    const newExperience = resume.experience.map((exp) => {
      const bulletIndex = exp.bullets.findIndex((b) =>
        b.toLowerCase().includes(improvement.original.slice(0, 30).toLowerCase())
      );
      if (bulletIndex !== -1) {
        const newBullets = [...exp.bullets];
        newBullets[bulletIndex] = improvement.improved;
        return { ...exp, bullets: newBullets };
      }
      return exp;
    });

    const updated = { ...resume, experience: newExperience };
    onUpdateResume(updated);
    setEditedResume(updated);
  };

  const handleCopyCleanText = () => {
    const text = `
${resume.fullName}
${resume.email} | ${resume.phone} | ${resume.location}
LinkedIn: ${resume.linkedinUrl} | GitHub: ${resume.githubUrl}

SUMMARY
${resume.summary}

SKILLS
${resume.skills.map((s) => `${s.category}: ${s.list.join(', ')}`).join('\n')}

EXPERIENCE
${resume.experience
  .map(
    (e) => `
${e.role} — ${e.company} (${e.duration})
${e.bullets.map((b) => `• ${b}`).join('\n')}
`
  )
  .join('\n')}

PROJECTS
${resume.projects
  .map(
    (p) => `
${p.title} [${p.technologies}]
${p.description} — Impact: ${p.impact}
`
  )
  .join('\n')}

EDUCATION
${resume.education.map((ed) => `${ed.degree} — ${ed.school} (${ed.year})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Resume Management & ATS Optimizer
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Fine-tune quantified STAR bullets, test keyword density against job descriptions, and maximize interview callbacks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCleanText}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {copiedNotification ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-zinc-400" />
                <span>Copy Plain Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center border-b border-zinc-200 text-sm font-semibold dark:border-zinc-800">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeSubTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Resume Profile</span>
        </button>
        <button
          onClick={() => setActiveSubTab('ats')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeSubTab === 'ats'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
          }`}
        >
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span>AI ATS Scanner & Keyword Gap</span>
          {resume.lastAtsAnalysis && (
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {resume.lastAtsAnalysis.atsScore}%
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: RESUME PROFILE */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          {/* Candidate Card */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {resume.fullName}
                </h2>
                <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {resume.targetRole}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{resume.email}</span>
                  <span>•</span>
                  <span>{resume.phone}</span>
                  <span>•</span>
                  <span>{resume.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubTab('ats')}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Scan with ATS AI</span>
                </button>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Professional Summary
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                {resume.summary}
              </p>
            </div>

            {/* Skills Taxonomy */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Core Technical Competencies
              </h3>
              <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {resume.skills.map((skillGroup, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800/60 dark:bg-zinc-900/40"
                  >
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {skillGroup.category}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {skillGroup.list.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Work Experience (Quantified STAR Bullets)
              </h3>
              <div className="mt-3 space-y-4">
                {resume.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-xl border border-zinc-200/80 bg-zinc-50/40 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {exp.role}
                        </span>
                        <span className="ml-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          @{exp.company}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{exp.duration}</span>
                    </div>

                    <ul className="mt-3 space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Key Technical Projects
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {resume.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-xl border border-zinc-200/80 bg-zinc-50/40 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-900/30"
                  >
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">
                      {proj.title}
                    </div>
                    <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                      {proj.technologies}
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      {proj.description}
                    </p>
                    <div className="mt-2 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      Impact: {proj.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI ATS SCANNER & KEYWORD MATCHER */}
      {activeSubTab === 'ats' && (
        <div className="space-y-6">
          {/* ATS Configuration Card */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
              Target Job Description & Role Optimization
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Paste the job requirements to benchmark keyword presence, quantify business metrics, and generate ATS-passing rewrites.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Paste Target Job Description (Optional but recommended)
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste requirements, responsibilities, and qualifications..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                id="run-ats-analysis-btn"
                onClick={handleRunAtsScan}
                disabled={isAnalyzing}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Scanning Resume ATS...' : 'Run ATS AI Scan'}</span>
              </button>
            </div>
          </div>

          {/* Analysis Results Display */}
          {resume.lastAtsAnalysis && (
            <div className="space-y-5">
              {/* Scorecard Banner */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="flex items-center gap-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50/50 p-4 dark:border-indigo-900/60 dark:from-indigo-950/40 dark:to-blue-950/20">
                  <div className="text-3xl font-black text-indigo-700 dark:text-indigo-300">
                    {resume.lastAtsAnalysis.atsScore}%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">
                      ATS PASS SCORE
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {resume.lastAtsAnalysis.matchRating}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
                  <span className="text-[11px] text-zinc-400">Keyword Density</span>
                  <div className="text-xl font-bold text-zinc-900 dark:text-white">
                    {resume.lastAtsAnalysis.categoryScores?.keywords}%
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${resume.lastAtsAnalysis.categoryScores?.keywords}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
                  <span className="text-[11px] text-zinc-400">Quantified Impact</span>
                  <div className="text-xl font-bold text-zinc-900 dark:text-white">
                    {resume.lastAtsAnalysis.categoryScores?.quantifiedImpact}%
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${resume.lastAtsAnalysis.categoryScores?.quantifiedImpact}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
                  <span className="text-[11px] text-zinc-400">Role Alignment</span>
                  <div className="text-xl font-bold text-zinc-900 dark:text-white">
                    {resume.lastAtsAnalysis.categoryScores?.roleAlignment}%
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${resume.lastAtsAnalysis.categoryScores?.roleAlignment}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Keywords Breakdown (Matched vs Missing) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-2xs dark:border-emerald-900/50 dark:bg-zinc-950">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Matched Keywords Found ({resume.lastAtsAnalysis.matchedKeywords.length})</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {resume.lastAtsAnalysis.matchedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-2xs dark:border-amber-900/50 dark:bg-zinc-950">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Missing Critical Keywords ({resume.lastAtsAnalysis.missingKeywords.length})</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {resume.lastAtsAnalysis.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                      >
                        + Add {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable STAR Bullet Rewrites */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  AI High-Impact STAR Bullet Rewrites
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Rewritten with active leadership verbs and quantifiable impact metrics to impress recruiters.
                </p>

                <div className="mt-4 space-y-4">
                  {resume.lastAtsAnalysis.bulletImprovements.map((imp, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 text-xs dark:border-zinc-800/80 dark:bg-zinc-900/40"
                    >
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            Original Line:
                          </span>
                          <p className="mt-0.5 text-zinc-600 line-through dark:text-zinc-400">
                            "{imp.original}"
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            STAR Optimized Version:
                          </span>
                          <p className="mt-0.5 font-medium text-zinc-900 dark:text-white leading-relaxed">
                            "{imp.improved}"
                          </p>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Why this works: {imp.reason}
                        </p>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleApplyBullet(imp)}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Apply to Resume Profile</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
