import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  FileText,
  Mic,
  CalendarRange,
  Bot,
  Sparkles,
  TrendingUp,
  Target,
  ChevronRight,
} from 'lucide-react';
import { ActiveTab, PrepStats } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  activeAppsCount: number;
  stats: PrepStats;
  targetRole: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount,
  activeAppsCount,
  stats,
  targetRole,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Tasks & Priorities',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'applications' as ActiveTab,
      label: 'Job Applications',
      icon: Briefcase,
      badge: activeAppsCount > 0 ? activeAppsCount : null,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      id: 'resume' as ActiveTab,
      label: 'Resume & ATS',
      icon: FileText,
      badge: '84%',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'interviews' as ActiveTab,
      label: 'Interview Prep',
      icon: Mic,
      badge: `${stats.mockInterviewsCount} done`,
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    },
    {
      id: 'study-plans' as ActiveTab,
      label: 'Study Roadmaps',
      icon: CalendarRange,
      badge: '2 Wks',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      id: 'ai-assistant' as ActiveTab,
      label: 'AI Career Coach',
      icon: Bot,
      badge: 'AI',
      badgeColor: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
      highlight: true,
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const content = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* User Target Role Pill */}
        <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Target className="h-3.5 w-3.5 text-indigo-500" />
              Target Objective
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
          </div>
          <div className="mt-1 text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
            {targetRole || 'Senior Full Stack Engineer'}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Preparation Workflows
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/70 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Readiness Metric Card */}
      <div className="rounded-xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50 to-indigo-50/40 p-3.5 dark:border-zinc-800/80 dark:from-zinc-900/60 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Readiness Index
          </span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {stats.readinessScore}%
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
            style={{ width: `${stats.readinessScore}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          Based on completed tasks, ATS match, and STAR mock evaluations.
        </p>
        <button
          onClick={() => handleNavClick('ai-assistant')}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-white py-1.5 text-xs font-semibold text-indigo-600 shadow-2xs transition-colors hover:bg-indigo-50 dark:border-indigo-800/60 dark:bg-zinc-800 dark:text-indigo-300 dark:hover:bg-zinc-700"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Ask AI Career Coach</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:block dark:border-zinc-800 dark:bg-zinc-950">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {content}
        </div>
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl dark:bg-zinc-950">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
