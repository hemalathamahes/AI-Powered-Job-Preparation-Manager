import React from 'react';
import {
  Search,
  Plus,
  Moon,
  Sun,
  CloudCheck,
  Menu,
  X,
  Sparkles,
  Flame,
  Download,
  FolderGit2,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenNewTask: () => void;
  onOpenNewApp: () => void;
  onOpenBackupModal: () => void;
  streakDays: number;
  lastSyncTime: string;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenNewTask,
  onOpenNewApp,
  onOpenBackupModal,
  streakDays,
  lastSyncTime,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle-btn"
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 lg:hidden dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">
                JobPrep AI
              </span>
              <span className="ml-1.5 hidden rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700 sm:inline-block dark:bg-indigo-950/60 dark:text-indigo-300">
                PRO
              </span>
            </div>
          </button>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="hidden max-w-md flex-1 px-6 md:block">
          <button
            id="global-search-trigger-btn"
            onClick={onOpenSearch}
            className="group flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-1.5 text-sm text-zinc-500 transition-all hover:border-zinc-300 hover:bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
              <span>Search tasks, applications, questions, notes...</span>
            </span>
            <kbd className="hidden items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline-flex dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile search button */}
          <button
            onClick={onOpenSearch}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 md:hidden dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Prep Streak badge */}
          <div
            className="hidden items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1 text-xs font-medium text-amber-800 sm:flex dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
            title="Current Daily Preparation Streak"
          >
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span>{streakDays}-day streak</span>
          </div>

          {/* Sync status & Backup trigger */}
          <button
            id="backup-export-btn"
            onClick={onOpenBackupModal}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            title="Cross-platform sync & data backup"
          >
            <CloudCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Sync & Backup</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Quick Add Task */}
          <button
            id="quick-add-task-btn"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden xs:inline">Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
