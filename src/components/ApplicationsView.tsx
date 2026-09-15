import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit2,
  Trash2,
  X,
  FileText,
  Mic,
  ChevronRight,
} from 'lucide-react';
import { JobApplication, ApplicationStage, ActiveTab } from '../types';
import { formatDate, formatRelativeDays, getStageBadgeClass } from '../utils/format';

interface ApplicationsViewProps {
  applications: JobApplication[];
  onAddApplication: (app: Omit<JobApplication, 'id'>) => void;
  onUpdateApplication: (app: JobApplication) => void;
  onDeleteApplication: (appId: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
  onPrefillInterviewPrep?: (company: string, role: string) => void;
  onPrefillAtsJob?: (jobDesc: string, role: string) => void;
}

const STAGES: ApplicationStage[] = [
  'Wishlist',
  'Applied',
  'Screening',
  'Technical',
  'Onsite',
  'Offer',
  'Rejected',
];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
  onSelectTab,
  onPrefillInterviewPrep,
  onPrefillAtsJob,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  // Form data for creating or editing application
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: 'Remote',
    workType: 'Remote' as 'Remote' | 'Hybrid' | 'On-site',
    salaryRange: '',
    stage: 'Applied' as ApplicationStage,
    priority: 'High' as 'High' | 'Medium' | 'Low',
    appliedDate: new Date().toISOString().slice(0, 10),
    interviewDate: '',
    jobUrl: '',
    contactName: '',
    contactEmail: '',
    jobDescription: '',
    notes: '',
    logoColor: '#6366f1',
    roundsCompleted: 0,
    totalRounds: 4,
  });

  const handleOpenNew = () => {
    setFormData({
      company: '',
      role: '',
      location: 'Remote',
      workType: 'Remote',
      salaryRange: '$160k - $200k',
      stage: 'Applied',
      priority: 'High',
      appliedDate: new Date().toISOString().slice(0, 10),
      interviewDate: '',
      jobUrl: '',
      contactName: '',
      contactEmail: '',
      jobDescription: '',
      notes: '',
      logoColor: '#6366f1',
      roundsCompleted: 0,
      totalRounds: 4,
    });
    setEditingApp(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (app: JobApplication) => {
    setEditingApp(app);
    setFormData({
      company: app.company,
      role: app.role,
      location: app.location,
      workType: app.workType,
      salaryRange: app.salaryRange || '',
      stage: app.stage,
      priority: app.priority,
      appliedDate: app.appliedDate || '',
      interviewDate: app.interviewDate || '',
      jobUrl: app.jobUrl || '',
      contactName: app.contactName || '',
      contactEmail: app.contactEmail || '',
      jobDescription: app.jobDescription || '',
      notes: app.notes || '',
      logoColor: app.logoColor || '#6366f1',
      roundsCompleted: app.roundsCompleted || 0,
      totalRounds: app.totalRounds || 4,
    });
    setIsNewModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) return;

    if (editingApp) {
      const updated: JobApplication = {
        ...editingApp,
        ...formData,
      };
      onUpdateApplication(updated);
      if (selectedApp?.id === updated.id) {
        setSelectedApp(updated);
      }
    } else {
      onAddApplication(formData);
    }
    setIsNewModalOpen(false);
  };

  const filteredApps = applications.filter((app) => {
    if (selectedStageFilter !== 'all' && app.stage !== selectedStageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        (app.notes && app.notes.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Job Applications Pipeline
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track hiring stages, interview dates, recruiters, and launch targeted AI prep drills.
          </p>
        </div>
        <button
          id="add-application-btn"
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search companies, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-1.5 pl-9 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="all">All Stages ({applications.length})</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s} ({applications.filter((a) => a.stage === s).length})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Showing {filteredApps.length} of {applications.length} active opportunities
        </div>
      </div>

      {/* Pipeline Board (Horizontal Scrollable on Smaller Screens) */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApps = filteredApps.filter((a) => a.stage === stage);
          return (
            <div
              key={stage}
              className="w-72 shrink-0 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-900/30"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {stage}
                </span>
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-zinc-600 shadow-2xs dark:bg-zinc-800 dark:text-zinc-400">
                  {stageApps.length}
                </span>
              </div>

              {/* Application Cards */}
              <div className="space-y-3">
                {stageApps.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-200 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
                    No roles in {stage}
                  </div>
                ) : (
                  stageApps.map((app) => {
                    const rel = formatRelativeDays(app.interviewDate);
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="group relative cursor-pointer rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-xs dark:border-zinc-800/80 dark:bg-zinc-950 dark:hover:border-zinc-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3.5 w-3.5 rounded-md shrink-0"
                              style={{ backgroundColor: app.logoColor || '#6366f1' }}
                            />
                            <h2 className="text-xs font-bold text-zinc-900 dark:text-white">
                              {app.company}
                            </h2>
                          </div>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              app.priority === 'High'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                            }`}
                          >
                            {app.priority}
                          </span>
                        </div>

                        <div className="mt-1.5 text-xs font-medium text-zinc-700 line-clamp-1 dark:text-zinc-300">
                          {app.role}
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {app.workType}
                          </span>
                          {app.salaryRange && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {app.salaryRange.split('+')[0].trim()}
                            </span>
                          )}
                        </div>

                        {app.interviewDate && (
                          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-zinc-50 px-2 py-1 text-[11px] dark:bg-zinc-900">
                            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                              <Calendar className="h-3 w-3 text-indigo-500" />
                              {formatDate(app.interviewDate)}
                            </span>
                            <span
                              className={`font-semibold ${
                                rel.isUrgent
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-zinc-600 dark:text-zinc-400'
                              }`}
                            >
                              {rel.text}
                            </span>
                          </div>
                        )}

                        {/* Round Progress Tracker */}
                        {typeof app.roundsCompleted === 'number' && app.totalRounds && (
                          <div className="mt-2.5">
                            <div className="flex items-center justify-between text-[10px] text-zinc-400">
                              <span>Round {app.roundsCompleted} of {app.totalRounds}</span>
                              <span>{Math.round((app.roundsCompleted / app.totalRounds) * 100)}%</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{
                                  width: `${(app.roundsCompleted / app.totalRounds) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Detail Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedApp(null)}
          />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <span
                  className="h-6 w-6 rounded-lg"
                  style={{ backgroundColor: selectedApp.logoColor || '#6366f1' }}
                />
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {selectedApp.company} - {selectedApp.role}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{selectedApp.location}</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      Stage: {selectedApp.stage}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(selectedApp);
                  }}
                  className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  title="Edit details"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete application for ${selectedApp.company}?`)) {
                      onDeleteApplication(selectedApp.id);
                      setSelectedApp(null);
                    }
                  }}
                  className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-rose-50 hover:text-rose-600 dark:border-zinc-800 dark:text-zinc-300"
                  title="Delete application"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* AI Action Quick Launchers for this Company */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => {
                  if (onPrefillInterviewPrep) {
                    onPrefillInterviewPrep(selectedApp.company, selectedApp.role);
                  }
                  onSelectTab('interviews');
                  setSelectedApp(null);
                }}
                className="flex items-center gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-left transition-colors hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Prep {selectedApp.company} Interview
                  </div>
                  <div className="text-[11px] text-indigo-700 dark:text-indigo-400">
                    Generate tailored questions & mock test
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  if (onPrefillAtsJob && selectedApp.jobDescription) {
                    onPrefillAtsJob(selectedApp.jobDescription, selectedApp.role);
                  }
                  onSelectTab('resume');
                  setSelectedApp(null);
                }}
                className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-left transition-colors hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Scan Resume for this Role
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    ATS score & keyword gap analysis
                  </div>
                </div>
              </button>
            </div>

            {/* Body Info */}
            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-zinc-50 p-3.5 dark:bg-zinc-900/50">
                <div>
                  <span className="text-zinc-400">Salary Target:</span>
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {selectedApp.salaryRange || 'Not specified'}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-400">Interview Date:</span>
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {formatDate(selectedApp.interviewDate)}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-400">Recruiter / Contact:</span>
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {selectedApp.contactName || 'None listed'} ({selectedApp.contactEmail || 'No email'})
                  </div>
                </div>
                <div>
                  <span className="text-zinc-400">Application Link:</span>
                  <div>
                    {selectedApp.jobUrl ? (
                      <a
                        href={selectedApp.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                      >
                        Job Posting <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
              </div>

              {selectedApp.notes && (
                <div>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Interview Notes & Strategy:
                  </span>
                  <p className="mt-1 rounded-xl border border-zinc-200 bg-white p-3 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    {selectedApp.notes}
                  </p>
                </div>
              )}

              {selectedApp.jobDescription && (
                <div>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Job Description:
                  </span>
                  <p className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-3 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    {selectedApp.jobDescription}
                  </p>
                </div>
              )}

              {/* Stage Quick Switcher */}
              <div className="pt-2">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Update Hiring Stage:
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        const updated = { ...selectedApp, stage: s };
                        onUpdateApplication(updated);
                        setSelectedApp(updated);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                        selectedApp.stage === s
                          ? 'bg-indigo-600 text-white'
                          : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New / Edit Application Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsNewModalOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {editingApp ? 'Edit Job Application' : 'Track New Job Application'}
            </h2>
            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Stripe, Figma"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Work Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Remote / SF"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Type
                  </label>
                  <select
                    value={formData.workType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workType: e.target.value as 'Remote' | 'Hybrid' | 'On-site',
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as 'High' | 'Medium' | 'Low' })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) =>
                      setFormData({ ...formData, stage: e.target.value as ApplicationStage })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Next Interview Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.interviewDate ? formData.interviewDate.slice(0, 10) : ''}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  Job Description
                </label>
                <textarea
                  rows={3}
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  placeholder="Paste requirements to enable instant ATS keyword matching..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  Notes & Prep Strategy
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Focus on distributed consensus, Kafka, and Redis caching"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {editingApp ? 'Save Application' : 'Create Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
