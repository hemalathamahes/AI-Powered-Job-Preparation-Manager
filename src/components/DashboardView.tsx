import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Calendar,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Play,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { Task, JobApplication, PrepStats, ActiveTab } from '../types';
import { formatDate, formatRelativeDays, getCategoryBadgeClass, getPriorityBadgeClass } from '../utils/format';
import { ApiService } from '../services/api';

interface DashboardViewProps {
  tasks: Task[];
  applications: JobApplication[];
  stats: PrepStats;
  onSelectTab: (tab: ActiveTab) => void;
  onToggleTask: (taskId: string) => void;
  onOpenNewTask: () => void;
  onOpenNewApp: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  applications,
  stats,
  onSelectTab,
  onToggleTask,
  onOpenNewTask,
  onOpenNewApp,
}) => {
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<{
    executiveSummary: string;
    keyWins: string[];
    bottlenecks: string[];
    nextWeekFocus: string;
  } | null>(null);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const urgentTasks = pendingTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');

  // Sorted upcoming interviews
  const upcomingInterviews = applications
    .filter((a) => a.interviewDate && new Date(a.interviewDate) >= new Date())
    .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime());

  const handleGenerateSummary = async () => {
    setAiSummaryLoading(true);
    try {
      const res = await ApiService.getProgressSummary({
        completedTasks: completedTasks.length,
        totalTasks: tasks.length,
        mockSessionsCount: stats.mockInterviewsCount,
        averageMockScore: stats.averageMockScore,
        activeApplications: applications.length,
      });
      setAiSummary(res);
    } catch (e) {
      console.error('Failed to generate summary:', e);
    } finally {
      setAiSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Readiness Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Prep Mode
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Sprint Week 2 of 2
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
              Career Readiness Command Center
            </h1>
            <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              You have {urgentTasks.length} high-priority tasks and {upcomingInterviews.length} upcoming interviews scheduled. Your profile is performing at the top tier.
            </p>
          </div>

          {/* Readiness Score Visual Meter */}
          <div className="flex items-center gap-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-blue-50/50 p-4 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-blue-950/20">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-zinc-200 dark:text-zinc-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-600 transition-all duration-1000 dark:text-indigo-400"
                  strokeDasharray={`${stats.readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-bold text-zinc-900 dark:text-white">
                  {stats.readinessScore}%
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                OVERALL READINESS
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                ATS: 84% • STAR: 8.4/10
              </div>
              <button
                onClick={() => onSelectTab('interviews')}
                className="mt-1 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>Boost score</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Pending Tasks</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400">
              {urgentTasks.length} high priority
            </span>
          </div>
          <button
            onClick={() => onSelectTab('tasks')}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <span>View task board</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Active Applications</span>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {applications.length}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              1 Onsite • 1 Tech
            </span>
          </div>
          <button
            onClick={() => onSelectTab('applications')}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <span>View pipeline</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Mock Interview Avg</span>
            <Play className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {stats.averageMockScore} / 10
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Top 10%
            </span>
          </div>
          <button
            onClick={() => onSelectTab('interviews')}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <span>Start mock session</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Prep Streak</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {stats.streakDays} Days
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Personal best 🔥
            </span>
          </div>
          <button
            onClick={() => onSelectTab('study-plans')}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <span>Review roadmap</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Priority Tasks & Upcoming Milestones */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's High Priority Tasks (2 Cols) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Today's Priority Tasks
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Action items critical for impending interviews
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectTab('tasks')}
                className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                All Tasks ({tasks.length})
              </button>
              <button
                onClick={onOpenNewTask}
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="group flex items-start justify-between rounded-xl border border-zinc-200/80 bg-white p-3.5 transition-all hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-zinc-300 transition-colors hover:border-indigo-600 hover:bg-indigo-50 dark:border-zinc-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40"
                    aria-label={`Mark task ${task.title} as completed`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : null}
                  </button>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">
                      {task.title}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-1 dark:text-zinc-400">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${getCategoryBadgeClass(
                          task.category
                        )}`}
                      >
                        {task.category}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize ${getPriorityBadgeClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {task.estimatedMinutes}m
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0 ml-2">
                  Due {formatDate(task.dueDate)}
                </div>
              </div>
            ))}
          </div>

          {/* AI Progress Summary Section */}
          <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 p-5 dark:border-indigo-900/50 dark:from-zinc-900 dark:via-zinc-950 dark:to-indigo-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    AI Preparation Progress Brief
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Automated executive debrief synthesized from your recent activities
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={aiSummaryLoading}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 shadow-2xs hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-800 dark:bg-zinc-800 dark:text-indigo-300 dark:hover:bg-zinc-700"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${aiSummaryLoading ? 'animate-spin' : ''}`} />
                <span>{aiSummaryLoading ? 'Analyzing...' : 'Generate Brief'}</span>
              </button>
            </div>

            {aiSummary ? (
              <div className="mt-4 space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
                <p className="leading-relaxed bg-white/70 p-3 rounded-xl border border-indigo-100 dark:border-zinc-800 dark:bg-zinc-900/60">
                  {aiSummary.executiveSummary}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      Key Wins:
                    </span>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-emerald-900 dark:text-emerald-200">
                      {aiSummary.keyWins?.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">
                      Next Strategic Focus:
                    </span>
                    <p className="mt-1 text-amber-900 dark:text-amber-200">
                      {aiSummary.nextWeekFocus}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Click "Generate Brief" to let Gemini analyze your task velocity, interview benchmarks, and active application pipeline into an executive recommendation.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Interviews & Quick Prep Actions */}
        <div className="space-y-6">
          {/* Upcoming Interviews Widget */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Upcoming Rounds
              </h2>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {upcomingInterviews.length} Scheduled
              </span>
            </div>

            <div className="space-y-3">
              {upcomingInterviews.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-400">
                  No upcoming interview dates recorded yet.
                </div>
              ) : (
                upcomingInterviews.map((app) => {
                  const rel = formatRelativeDays(app.interviewDate);
                  return (
                    <div
                      key={app.id}
                      className="rounded-xl border border-zinc-200/70 bg-zinc-50/60 p-3 dark:border-zinc-800/70 dark:bg-zinc-900/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: app.logoColor || '#6366f1' }}
                          />
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            {app.company}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            rel.isUrgent
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          {rel.text}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-600 line-clamp-1 dark:text-zinc-400">
                        {app.role}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                        <span>Stage: {app.stage}</span>
                        <button
                          onClick={() => onSelectTab('interviews')}
                          className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          Prep Questions →
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <button
              onClick={onOpenNewApp}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 py-1.5 text-xs font-medium text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Job Application</span>
            </button>
          </div>

          {/* Quick Hub Launchers */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-950">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white pb-3">
              Preparation Hubs
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => onSelectTab('interviews')}
                className="group flex w-full items-center justify-between rounded-xl border border-zinc-100 p-2.5 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-zinc-800/60 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    <Play className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                      Mock Interview Simulator
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      STAR framework grading & timer
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => onSelectTab('resume')}
                className="group flex w-full items-center justify-between rounded-xl border border-zinc-100 p-2.5 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-zinc-800/60 dark:hover:border-emerald-900/50 dark:hover:bg-emerald-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <FileCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                      ATS Resume Scanner
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Keyword matching & STAR rewrites
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-emerald-600" />
              </button>

              <button
                onClick={() => onSelectTab('ai-assistant')}
                className="group flex w-full items-center justify-between rounded-xl border border-zinc-100 p-2.5 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/50 dark:border-zinc-800/60 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                      AI Career Coach
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Personalized daily schedule & drills
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
