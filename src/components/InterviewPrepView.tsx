import React, { useState, useEffect } from 'react';
import {
  Mic,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Filter,
  Search,
  Plus,
  ArrowRight,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import {
  InterviewQuestion,
  MockInterviewSession,
  JobApplication,
  StarEvaluation,
} from '../types';
import { ApiService } from '../services/api';

interface InterviewPrepViewProps {
  questions: InterviewQuestion[];
  mockSessions: MockInterviewSession[];
  applications: JobApplication[];
  onAddQuestion: (q: Omit<InterviewQuestion, 'id'>) => void;
  onSaveMockSession: (session: Omit<MockInterviewSession, 'id'>) => void;
  prefilledCompany?: string;
  prefilledRole?: string;
}

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({
  questions,
  mockSessions,
  applications,
  onAddQuestion,
  onSaveMockSession,
  prefilledCompany = '',
  prefilledRole = '',
}) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'bank' | 'history'>('simulator');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Mock Simulation State
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion>(
    questions[0] || {
      id: 'default',
      category: 'Behavioral',
      difficulty: 'Medium',
      question: 'Tell me about a time you resolved a major production outage under severe pressure.',
      roleTarget: 'Senior Engineer',
      tips: ['Use the STAR framework', 'Quantify time to mitigate and root cause'],
      practiced: false,
    }
  );

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // User answer input
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<StarEvaluation | null>(null);

  // Question generator modal/form
  const [genCompany, setGenCompany] = useState(prefilledCompany || 'Stripe');
  const [genRole, setGenRole] = useState(prefilledRole || 'Senior Frontend Engineer');
  const [genCategory, setGenCategory] = useState<string>('Behavioral');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartSimulation = (q: InterviewQuestion) => {
    setCurrentQuestion(q);
    setUserAnswer('');
    setEvaluationResult(null);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setActiveTab('simulator');
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  // Submit answer for AI grading
  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setIsTimerRunning(false);

    try {
      const evaluation = await ApiService.evaluateAnswer({
        question: currentQuestion.question,
        category: currentQuestion.category,
        userAnswer: userAnswer,
        targetRole: genRole,
        company: currentQuestion.company,
      });

      setEvaluationResult(evaluation);

      // Save to mock sessions history
      onSaveMockSession({
        date: new Date().toISOString(),
        company: currentQuestion.company || 'General Mock',
        role: currentQuestion.roleTarget || 'Software Engineer',
        question: currentQuestion.question,
        category: currentQuestion.category,
        userAnswer: userAnswer,
        evaluation: evaluation,
        durationMinutes: Math.max(1, Math.round(timerSeconds / 60)),
      });
    } catch (e) {
      console.error('Failed to evaluate answer:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Generate new questions with AI
  const handleGenerateQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const generated = await ApiService.generateInterviewQuestions({
        company: genCompany,
        role: genRole,
        category: genCategory,
        count: 4,
      });

      generated.forEach((g) => {
        onAddQuestion({
          category: g.category as any,
          difficulty: (g.difficulty as any) || 'Medium',
          question: g.question,
          company: genCompany,
          roleTarget: genRole,
          tips: g.tips || ['Explain trade-offs clearly'],
          practiced: false,
        });
      });

      // Switch to first generated question
      if (generated.length > 0) {
        setCurrentQuestion({
          id: 'temp-' + Date.now(),
          category: generated[0].category as any,
          difficulty: (generated[0].difficulty as any) || 'Medium',
          question: generated[0].question,
          company: genCompany,
          roleTarget: genRole,
          tips: generated[0].tips || [],
          practiced: false,
        });
        setActiveTab('simulator');
      }
    } catch (e) {
      console.error('Failed to generate questions:', e);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Filtering questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const match =
        q.question.toLowerCase().includes(query) ||
        (q.company && q.company.toLowerCase().includes(query));
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
            Interview Preparation & Mock Simulator
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Practice real behavioral & technical questions under timed conditions with AI STAR feedback.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'simulator'
                ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Mic className="h-3.5 w-3.5 text-indigo-500" />
            <span>Active Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'bank'
                ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Question Bank ({questions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Mock History ({mockSessions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Simulator Window (2 cols) */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
              {/* Question Meta & Timer */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {currentQuestion.category}
                  </span>
                  <span className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                    {currentQuestion.difficulty}
                  </span>
                  {currentQuestion.company && (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                      @{currentQuestion.company}
                    </span>
                  )}
                </div>

                {/* Stopwatch Timer Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-mono font-bold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{formatTimer(timerSeconds)}</span>
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400"
                    title={isTimerRunning ? 'Pause' : 'Start'}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleResetTimer}
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400"
                    title="Reset"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="mt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Target Question:
                </span>
                <h2 className="mt-1 text-base font-bold text-zinc-900 dark:text-white sm:text-lg">
                  "{currentQuestion.question}"
                </h2>

                {currentQuestion.tips && currentQuestion.tips.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Tips:</span>
                    {currentQuestion.tips.map((t, idx) => (
                      <span key={idx} className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Answer Input Textarea */}
              <div className="mt-5">
                <div className="flex items-center justify-between pb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Your Response (STAR Framework recommended)
                  </label>
                  <span className="text-xs text-zinc-400">
                    {userAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Situation: When I was leading the checkout migration at...
Task: I was responsible for achieving zero downtime while...
Action: I implemented idempotency keys with Redis and a shadow routing phase...
Result: Successfully reduced payment failures by 42% with $1.2M added volume..."
                  className="w-full rounded-xl border border-zinc-300 bg-white p-3.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    const nextIndex =
                      (questions.findIndex((q) => q.id === currentQuestion.id) + 1) %
                      questions.length;
                    handleStartSimulation(questions[nextIndex]);
                  }}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Skip to Next Question →
                </button>

                <button
                  id="evaluate-mock-answer-btn"
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Sparkles className={`h-4 w-4 ${isEvaluating ? 'animate-spin' : ''}`} />
                  <span>{isEvaluating ? 'Grading with AI...' : 'Submit & Grade Answer'}</span>
                </button>
              </div>
            </div>

            {/* AI Grading Results Display */}
            {evaluationResult && (
              <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-2xs dark:border-indigo-900/60 dark:bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-base">
                      {evaluationResult.overallScore}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                        AI STAR Framework Evaluation
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Evaluated against Top Tech Senior Hiring standards
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Strong Hire Rating
                  </span>
                </div>

                {/* STAR Category Breakdown */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(evaluationResult.starBreakdown).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 text-center dark:border-zinc-800/60 dark:bg-zinc-900/40"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {key}
                      </span>
                      <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                        {value} / 10
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strengths & Improvements */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      Key Strengths:
                    </span>
                    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-emerald-900 dark:text-emerald-200">
                      {evaluationResult.strengths?.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 text-xs dark:border-amber-900/40 dark:bg-amber-950/20">
                    <span className="font-bold text-amber-800 dark:text-amber-300">
                      Improvement Recommendations:
                    </span>
                    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-amber-900 dark:text-amber-200">
                      {evaluationResult.improvements?.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Benchmark Answer */}
                {evaluationResult.idealAnswerOutline && (
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      Gold-Standard Model Response Outline:
                    </span>
                    <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                      {evaluationResult.idealAnswerOutline}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: AI Question Generator for Target Company */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  Generate Company Questions
                </h3>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Generate real interview questions frequently asked by recruiters at specific firms.
              </p>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Company
                  </label>
                  <input
                    type="text"
                    value={genCompany}
                    onChange={(e) => setGenCompany(e.target.value)}
                    placeholder="Stripe, Figma, Meta"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Role
                  </label>
                  <input
                    type="text"
                    value={genRole}
                    onChange={(e) => setGenRole(e.target.value)}
                    placeholder="Senior Full Stack Engineer"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Interview Type
                  </label>
                  <select
                    value={genCategory}
                    onChange={(e) => setGenCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  >
                    <option value="Behavioral">Behavioral (Leadership & Conflict)</option>
                    <option value="System Design">System Design & Scalability</option>
                    <option value="Coding">Coding & Architecture</option>
                    <option value="Situational">Situational & Culture</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateQuestions}
                  disabled={isGeneratingQuestions}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isGeneratingQuestions ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingQuestions ? 'Generating...' : 'Generate 4 Questions'}</span>
                </button>
              </div>
            </div>

            {/* Quick Practice List */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white pb-2">
                Quick Drill Questions
              </h3>
              <div className="space-y-2">
                {questions.slice(0, 4).map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleStartSimulation(q)}
                    className="group flex w-full items-start justify-between rounded-xl border border-zinc-100 p-2.5 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-zinc-800/60 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/20"
                  >
                    <div className="space-y-1 pr-2">
                      <span className="text-xs font-semibold text-zinc-800 line-clamp-2 dark:text-zinc-200">
                        {q.question}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                        <span>{q.category}</span>
                        <span>•</span>
                        <span>{q.difficulty}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION BANK */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search questions or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white py-1.5 pl-9 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">All Categories</option>
              <option value="Behavioral">Behavioral</option>
              <option value="System Design">System Design</option>
              <option value="Coding">Coding</option>
              <option value="Situational">Situational</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs transition-all hover:border-indigo-300 dark:border-zinc-800/80 dark:bg-zinc-950"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {q.category}
                    </span>
                    <span className="text-xs text-zinc-400">{q.difficulty}</span>
                  </div>
                  <h3 className="mt-2 text-xs font-bold text-zinc-900 dark:text-white">
                    {q.question}
                  </h3>
                  {q.company && (
                    <div className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      Asked by: {q.company}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-900">
                  <span className="text-[11px] text-zinc-400">
                    {q.practiced ? '✓ Practiced' : 'Pending practice'}
                  </span>
                  <button
                    onClick={() => handleStartSimulation(q)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    <span>Practice with Timer</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MOCK HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {mockSessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-xs text-zinc-400">
              No mock sessions completed yet. Practice a question in the Simulator to record your performance history.
            </div>
          ) : (
            mockSessions.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">
                      {s.evaluation.overallScore}/10
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        {s.question}
                      </h4>
                      <div className="text-[11px] text-zinc-400">
                        {s.company} • {s.category} • {s.durationMinutes} min session
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {new Date(s.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Top Strength:
                  </span>{' '}
                  {s.evaluation.strengths?.[0] || 'Clear delivery'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
