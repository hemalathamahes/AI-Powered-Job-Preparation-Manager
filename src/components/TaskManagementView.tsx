import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Kanban,
  List as ListIcon,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  MoreVertical,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  ArrowRight,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Task, TaskCategory, TaskPriority, TaskStatus, JobApplication } from '../types';
import { formatDate, getCategoryBadgeClass, getPriorityBadgeClass } from '../utils/format';
import { ApiService } from '../services/api';

interface TaskManagementViewProps {
  tasks: Task[];
  applications: JobApplication[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

export const TaskManagementView: React.FC<TaskManagementViewProps> = ({
  tasks,
  applications,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleStatus,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // AI Prioritization state
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [aiPrioritizeResult, setAiPrioritizeResult] = useState<{
    topFocusToday: string[];
    rationale: string;
    strategicAdvice: string;
  } | null>(null);

  // Form state for creating / editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Coding' as TaskCategory,
    priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus,
    dueDate: new Date().toISOString().slice(0, 10),
    estimatedMinutes: 45,
    applicationId: '',
    tags: '',
    notes: '',
  });

  const categories: TaskCategory[] = [
    'Coding',
    'System Design',
    'Behavioral',
    'Resume',
    'Mock Interview',
    'Company Research',
    'Application',
  ];

  const handleOpenNew = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Coding',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date().toISOString().slice(0, 10),
      estimatedMinutes: 45,
      applicationId: '',
      tags: '',
      notes: '',
    });
    setEditingTask(null);
    setIsNewTaskOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      estimatedMinutes: task.estimatedMinutes,
      applicationId: task.applicationId || '',
      tags: task.tags.join(', '),
      notes: task.notes || '',
    });
    setIsNewTaskOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        estimatedMinutes: Number(formData.estimatedMinutes) || 30,
        applicationId: formData.applicationId || undefined,
        tags: tagsArray,
        notes: formData.notes,
      });
    } else {
      onAddTask({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        estimatedMinutes: Number(formData.estimatedMinutes) || 30,
        applicationId: formData.applicationId || undefined,
        tags: tagsArray,
        notes: formData.notes,
      });
    }
    setIsNewTaskOpen(false);
  };

  const handleRunAiPrioritize = async () => {
    setIsPrioritizing(true);
    try {
      const res = await ApiService.prioritizeTasks(tasks, applications);
      setAiPrioritizeResult(res);
    } catch (e) {
      console.error('Failed to run AI prioritize:', e);
    } finally {
      setIsPrioritizing(false);
    }
  };

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title and AI Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Task Management & Priorities
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Organize study sprints, track interview prep milestones, and drill high-priority objectives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Prioritize Button */}
          <button
            id="ai-prioritize-tasks-btn"
            onClick={handleRunAiPrioritize}
            disabled={isPrioritizing}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-2xs transition-all hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
          >
            <Sparkles className={`h-4 w-4 ${isPrioritizing ? 'animate-spin' : ''}`} />
            <span>{isPrioritizing ? 'Analyzing Pipeline...' : 'AI Prioritize'}</span>
          </button>

          {/* New Task Button */}
          <button
            id="create-task-btn"
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* AI Prioritization Recommendation Banner */}
      {aiPrioritizeResult && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  AI Prioritization Strategy
                </div>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  {aiPrioritizeResult.strategicAdvice}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Rationale: {aiPrioritizeResult.rationale}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAiPrioritizeResult(null)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Filter & View Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-1.5 pl-9 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* View Switcher (Kanban vs List) */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span>Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <ListIcon className="h-3.5 w-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Task Views */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Column: To Do */}
          <TaskColumn
            title="To Do"
            count={todoTasks.length}
            tasks={todoTasks}
            status="todo"
            topFocusIds={aiPrioritizeResult?.topFocusToday}
            onToggleStatus={onToggleStatus}
            onEdit={handleOpenEdit}
            onDelete={onDeleteTask}
            onMoveStatus={(task, newStatus) => onUpdateTask({ ...task, status: newStatus })}
          />

          {/* Column: In Progress */}
          <TaskColumn
            title="In Progress"
            count={inProgressTasks.length}
            tasks={inProgressTasks}
            status="in_progress"
            topFocusIds={aiPrioritizeResult?.topFocusToday}
            onToggleStatus={onToggleStatus}
            onEdit={handleOpenEdit}
            onDelete={onDeleteTask}
            onMoveStatus={(task, newStatus) => onUpdateTask({ ...task, status: newStatus })}
          />

          {/* Column: Done */}
          <TaskColumn
            title="Completed"
            count={completedTasks.length}
            tasks={completedTasks}
            status="completed"
            topFocusIds={aiPrioritizeResult?.topFocusToday}
            onToggleStatus={onToggleStatus}
            onEdit={handleOpenEdit}
            onDelete={onDeleteTask}
            onMoveStatus={(task, newStatus) => onUpdateTask({ ...task, status: newStatus })}
          />
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                No tasks match your selected filters.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className="text-zinc-400 hover:text-emerald-600"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            task.status === 'completed'
                              ? 'line-through text-zinc-400 dark:text-zinc-600'
                              : 'text-zinc-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                        {aiPrioritizeResult?.topFocusToday?.includes(task.id) && (
                          <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            ★ Top Focus
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${getCategoryBadgeClass(
                            task.category
                          )}`}
                        >
                          {task.category}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-medium capitalize ${getPriorityBadgeClass(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Due {formatDate(task.dueDate)}
                        </span>
                        <span className="text-[11px] text-zinc-400">• {task.estimatedMinutes}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* New / Edit Task Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsNewTaskOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {editingTask ? 'Edit Preparation Task' : 'Create New Preparation Task'}
            </h2>
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master Stripe Webhook Idempotency pattern"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Description & Key Requirements
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specific patterns to cover, edge cases to practice..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as TaskCategory })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as TaskPriority })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Estimated Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={formData.estimatedMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedMinutes: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Associated Job Application (Optional)
                </label>
                <select
                  value={formData.applicationId}
                  onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                >
                  <option value="">None (General Preparation)</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.company} - {app.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Algorithms, Redis, Idempotency"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface TaskColumnProps {
  title: string;
  count: number;
  tasks: Task[];
  status: TaskStatus;
  topFocusIds?: string[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveStatus: (task: Task, newStatus: TaskStatus) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  count,
  tasks,
  status,
  topFocusIds,
  onToggleStatus,
  onEdit,
  onDelete,
  onMoveStatus,
}) => {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              status === 'todo'
                ? 'bg-amber-500'
                : status === 'in_progress'
                ? 'bg-indigo-500'
                : 'bg-emerald-500'
            }`}
          />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {title}
          </h2>
        </div>
        <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-zinc-600 shadow-2xs dark:bg-zinc-800 dark:text-zinc-400">
          {count}
        </span>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 py-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
            No tasks in this lane
          </div>
        ) : (
          tasks.map((task) => {
            const isTopFocus = topFocusIds?.includes(task.id);
            return (
              <div
                key={task.id}
                className={`relative rounded-xl border bg-white p-3.5 shadow-2xs transition-all hover:border-zinc-300 hover:shadow-xs dark:bg-zinc-950 ${
                  isTopFocus
                    ? 'border-indigo-400 ring-1 ring-indigo-400/50 dark:border-indigo-600'
                    : 'border-zinc-200/80 dark:border-zinc-800/80'
                }`}
              >
                {isTopFocus && (
                  <div className="mb-2 flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Recommended Focus Today</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-900 line-clamp-2 dark:text-white">
                    {task.title}
                  </span>
                  <button
                    onClick={() => onEdit(task)}
                    className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {task.description && (
                  <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2 dark:text-zinc-400">
                    {task.description}
                  </p>
                )}

                {/* Tags & Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${getCategoryBadgeClass(
                      task.category
                    )}`}
                  >
                    {task.category}
                  </span>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium capitalize ${getPriorityBadgeClass(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {task.estimatedMinutes}m
                  </span>
                </div>

                {/* Bottom Bar with Due Date & Lane Transition */}
                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px] dark:border-zinc-900">
                  <span className="text-zinc-400">Due {formatDate(task.dueDate)}</span>
                  <div className="flex items-center gap-1">
                    {status !== 'todo' && (
                      <button
                        onClick={() => onMoveStatus(task, 'todo')}
                        className="rounded px-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="Move to To Do"
                      >
                        ← To Do
                      </button>
                    )}
                    {status !== 'in_progress' && (
                      <button
                        onClick={() => onMoveStatus(task, 'in_progress')}
                        className="rounded px-1 text-[10px] font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                        title="Move to In Progress"
                      >
                        ⚡ Active
                      </button>
                    )}
                    {status !== 'completed' && (
                      <button
                        onClick={() => onMoveStatus(task, 'completed')}
                        className="rounded px-1 text-[10px] font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        title="Mark Completed"
                      >
                        ✓ Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
