import React, { useState } from 'react';
import {
  CalendarRange,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Plus,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { StudyPlan, Task } from '../types';
import { ApiService } from '../services/api';

interface StudyPlansViewProps {
  studyPlan: StudyPlan;
  onUpdateStudyPlan: (plan: StudyPlan) => void;
  onImportTasksFromRoadmap: (newTasks: Omit<Task, 'id'>[]) => void;
}

export const StudyPlansView: React.FC<StudyPlansViewProps> = ({
  studyPlan,
  onUpdateStudyPlan,
  onImportTasksFromRoadmap,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState(studyPlan.targetRole);
  const [durationWeeks, setDurationWeeks] = useState(studyPlan.durationWeeks);
  const [dailyHours, setDailyHours] = useState(studyPlan.dailyHours);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [importedNotification, setImportedNotification] = useState(false);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
    );
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const generated = await ApiService.generateStudyPlan({
        targetRole,
        durationWeeks,
        dailyHours,
        focusAreas: ['Coding Patterns', 'Distributed System Design', 'STAR Behavioral Stories'],
      });

      const updated: StudyPlan = {
        id: 'plan-' + Date.now(),
        title: generated.title,
        targetRole,
        durationWeeks,
        dailyHours,
        createdAt: new Date().toISOString(),
        weeks: generated.weeks,
      };

      onUpdateStudyPlan(updated);
      setExpandedWeeks([1]);
    } catch (e) {
      console.error('Failed to generate study plan:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert roadmap items into real interactive tasks on the Kanban board!
  const handleExportToTasks = () => {
    const newTasks: Omit<Task, 'id'>[] = [];
    studyPlan.weeks.forEach((week, wIdx) => {
      week.days.forEach((day, dIdx) => {
        day.tasks.forEach((taskTitle) => {
          // Compute a reasonable due date
          const date = new Date();
          date.setDate(date.getDate() + wIdx * 7 + dIdx);

          newTasks.push({
            title: `[W${week.weekNumber}] ${taskTitle}`,
            description: `Study Sprint Milestone: ${day.focus}`,
            category:
              day.focus.toLowerCase().includes('coding') || day.focus.toLowerCase().includes('algorithm')
                ? 'Coding'
                : day.focus.toLowerCase().includes('design')
                ? 'System Design'
                : day.focus.toLowerCase().includes('star') || day.focus.toLowerCase().includes('behavioral')
                ? 'Behavioral'
                : 'Company Research',
            priority: wIdx === 0 ? 'high' : 'medium',
            status: 'todo',
            dueDate: date.toISOString().slice(0, 10),
            estimatedMinutes: Math.round((studyPlan.dailyHours * 60) / day.tasks.length),
            tags: ['Roadmap', `Week${week.weekNumber}`],
          });
        });
      });
    });

    onImportTasksFromRoadmap(newTasks);
    setImportedNotification(true);
    setTimeout(() => setImportedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            AI Study Roadmaps & Preparation Sprints
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Structured daily curriculums calibrated to your target roles, daily time budget, and interview rounds.
          </p>
        </div>

        <button
          id="sync-roadmap-tasks-btn"
          onClick={handleExportToTasks}
          className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
        >
          <CheckCircle2 className="h-4 w-4 text-indigo-500" />
          <span>{importedNotification ? 'Added to Task Board!' : 'Sync Roadmap into Tasks'}</span>
        </button>
      </div>

      {/* Generator Form Banner */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
          Customize Preparation Sprint Parameters
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Target Role Objective
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Duration
            </label>
            <select
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value={1}>1 Week (Emergency Sprint)</option>
              <option value={2}>2 Weeks (Standard Sprint)</option>
              <option value={4}>4 Weeks (Comprehensive)</option>
              <option value={8}>8 Weeks (Full Mastery)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Daily Hours
            </label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value={1}>1 hour / day</option>
              <option value={2}>2 hours / day</option>
              <option value={3}>3 hours / day</option>
              <option value={4}>4+ hours / day</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            id="generate-study-plan-btn"
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Sprint...' : 'Generate AI Study Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Roadmap Week Accordions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            {studyPlan.title} ({studyPlan.durationWeeks} Weeks • {studyPlan.dailyHours}h/day)
          </h3>
          <span className="text-xs text-zinc-400">
            {studyPlan.weeks.length} Weeks Curriculum
          </span>
        </div>

        {studyPlan.weeks.map((week) => {
          const isExpanded = expandedWeeks.includes(week.weekNumber);
          return (
            <div
              key={week.weekNumber}
              className="rounded-2xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden dark:border-zinc-800/80 dark:bg-zinc-950"
            >
              {/* Week Header */}
              <button
                onClick={() => toggleWeek(week.weekNumber)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                    W{week.weekNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      {week.theme}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{week.objective}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-zinc-400" />
                )}
              </button>

              {/* Day-by-Day breakdown */}
              {isExpanded && (
                <div className="border-t border-zinc-100 p-4 space-y-3 dark:border-zinc-900">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {week.days.map((day) => (
                      <div
                        key={day.dayNumber}
                        className="rounded-xl border border-zinc-200/70 bg-zinc-50/50 p-3.5 text-xs dark:border-zinc-800/70 dark:bg-zinc-900/40"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200/60 dark:border-zinc-800/60">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            Day {day.dayNumber}
                          </span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {day.focus}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1.5">
                          {day.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-1.5 text-zinc-600 dark:text-zinc-400">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                              <span className="leading-tight">{task}</span>
                            </div>
                          ))}
                        </div>

                        {day.resources && day.resources.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-zinc-200/40 dark:border-zinc-800/40 text-[10px] text-zinc-400">
                            <span className="font-semibold text-zinc-500">Topics:</span>{' '}
                            {day.resources.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
