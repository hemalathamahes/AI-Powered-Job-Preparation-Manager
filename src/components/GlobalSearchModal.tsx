import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  CheckSquare,
  Briefcase,
  Mic,
  FileText,
  CalendarRange,
  ArrowRight,
} from 'lucide-react';
import { Task, JobApplication, InterviewQuestion, ActiveTab } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  applications: JobApplication[];
  questions: InterviewQuestion[];
  onSelectTab: (tab: ActiveTab) => void;
}

type SearchCategory = 'all' | 'tasks' | 'jobs' | 'questions' | 'resume';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  applications,
  questions,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const items: {
      id: string;
      title: string;
      subtitle: string;
      type: 'task' | 'job' | 'question' | 'resume';
      tab: ActiveTab;
    }[] = [];

    // Search tasks
    if (category === 'all' || category === 'tasks') {
      tasks.forEach((t) => {
        if (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
        ) {
          items.push({
            id: t.id,
            title: t.title,
            subtitle: `${t.category} • ${t.priority.toUpperCase()} priority • Due ${t.dueDate}`,
            type: 'task',
            tab: 'tasks',
          });
        }
      });
    }

    // Search applications
    if (category === 'all' || category === 'jobs') {
      applications.forEach((a) => {
        if (
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          (a.notes && a.notes.toLowerCase().includes(q))
        ) {
          items.push({
            id: a.id,
            title: `${a.company} - ${a.role}`,
            subtitle: `Stage: ${a.stage} • ${a.location} • ${a.workType}`,
            type: 'job',
            tab: 'applications',
          });
        }
      });
    }

    // Search questions
    if (category === 'all' || category === 'questions') {
      questions.forEach((qu) => {
        if (
          qu.question.toLowerCase().includes(q) ||
          qu.category.toLowerCase().includes(q) ||
          (qu.company && qu.company.toLowerCase().includes(q))
        ) {
          items.push({
            id: qu.id,
            title: qu.question,
            subtitle: `${qu.category} (${qu.difficulty}) • ${qu.company || 'General'}`,
            type: 'question',
            tab: 'interviews',
          });
        }
      });
    }

    return items.slice(0, 15);
  }, [query, category, tasks, applications, questions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, companies, questions, notes..."
            className="ml-3 flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-white dark:placeholder-zinc-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-lg border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            ESC
          </button>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50/50 px-4 py-2 text-xs dark:border-zinc-800/60 dark:bg-zinc-900/30">
          {(['all', 'tasks', 'jobs', 'questions'] as SearchCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-2.5 py-1 font-medium capitalize transition-colors ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Type keywords above to instantly search across all preparation assets.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.tab);
                    onClose();
                  }}
                  className="group flex w-full items-center justify-between rounded-xl p-2.5 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {item.type === 'task' && <CheckSquare className="h-4 w-4 text-blue-500" />}
                      {item.type === 'job' && <Briefcase className="h-4 w-4 text-indigo-500" />}
                      {item.type === 'question' && <Mic className="h-4 w-4 text-purple-500" />}
                      {item.type === 'resume' && <FileText className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-900 line-clamp-1 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-zinc-500 line-clamp-1 dark:text-zinc-400">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
