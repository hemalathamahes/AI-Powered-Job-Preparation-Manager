import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { DashboardView } from './components/DashboardView';
import { TaskManagementView } from './components/TaskManagementView';
import { ApplicationsView } from './components/ApplicationsView';
import { ResumeManagerView } from './components/ResumeManagerView';
import { InterviewPrepView } from './components/InterviewPrepView';
import { StudyPlansView } from './components/StudyPlansView';
import { AiAssistantView } from './components/AiAssistantView';
import { StorageService } from './services/storage';
import {
  ActiveTab,
  Task,
  JobApplication,
  ResumeProfile,
  InterviewQuestion,
  MockInterviewSession,
  StudyPlan,
  ChatMessage,
  TaskStatus,
} from './types';

export default function App() {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return StorageService.getTheme() === 'dark';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Mobile Drawer
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Global Search Modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Core Data State
  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks());
  const [applications, setApplications] = useState<JobApplication[]>(() =>
    StorageService.getApplications()
  );
  const [resume, setResume] = useState<ResumeProfile>(() => StorageService.getResume());
  const [questions, setQuestions] = useState<InterviewQuestion[]>(() =>
    StorageService.getQuestions()
  );
  const [mockSessions, setMockSessions] = useState<MockInterviewSession[]>(() =>
    StorageService.getMockSessions()
  );
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => StorageService.getStudyPlan());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() =>
    StorageService.getChatHistory()
  );

  // Prefill references when crossing tabs
  const [prefilledInterviewCompany, setPrefilledInterviewCompany] = useState('');
  const [prefilledInterviewRole, setPrefilledInterviewRole] = useState('');
  const [prefilledAtsJobDesc, setPrefilledAtsJobDesc] = useState('');
  const [prefilledAtsRole, setPrefilledAtsRole] = useState('');

  // Sync dark class with document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      StorageService.setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      StorageService.setTheme('light');
    }
  }, [isDark]);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute live statistics dynamically
  const stats = useMemo(() => {
    return StorageService.calculateStats(tasks, mockSessions, applications, resume);
  }, [tasks, mockSessions, applications, resume]);

  // Task Handlers
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: 'task-' + Date.now(),
    };
    const updated = [task, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus: TaskStatus = t.status === 'completed' ? 'todo' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  // Application Handlers
  const handleAddApplication = (newApp: Omit<JobApplication, 'id'>) => {
    const app: JobApplication = {
      ...newApp,
      id: 'app-' + Date.now(),
    };
    const updated = [app, ...applications];
    setApplications(updated);
    StorageService.saveApplications(updated);
  };

  const handleUpdateApplication = (updatedApp: JobApplication) => {
    const updated = applications.map((a) => (a.id === updatedApp.id ? updatedApp : a));
    setApplications(updated);
    StorageService.saveApplications(updated);
  };

  const handleDeleteApplication = (appId: string) => {
    const updated = applications.filter((a) => a.id !== appId);
    setApplications(updated);
    StorageService.saveApplications(updated);
  };

  // Resume Handler
  const handleUpdateResume = (updatedResume: ResumeProfile) => {
    setResume(updatedResume);
    StorageService.saveResume(updatedResume);
  };

  // Interview Questions & Mock Sessions
  const handleAddQuestion = (newQ: Omit<InterviewQuestion, 'id'>) => {
    const q: InterviewQuestion = {
      ...newQ,
      id: 'q-' + Date.now(),
    };
    const updated = [q, ...questions];
    setQuestions(updated);
    StorageService.saveQuestions(updated);
  };

  const handleSaveMockSession = (sessionData: Omit<MockInterviewSession, 'id'>) => {
    const session: MockInterviewSession = {
      ...sessionData,
      id: 'mock-' + Date.now(),
    };
    const updated = [session, ...mockSessions];
    setMockSessions(updated);
    StorageService.saveMockSessions(updated);

    // Also mark associated question as practiced if matched
    const updatedQuestions = questions.map((q) => {
      if (q.question === sessionData.question) {
        return { ...q, practiced: true };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    StorageService.saveQuestions(updatedQuestions);
  };

  // Study Plan Handler
  const handleUpdateStudyPlan = (updatedPlan: StudyPlan) => {
    setStudyPlan(updatedPlan);
    StorageService.saveStudyPlan(updatedPlan);
  };

  const handleImportTasksFromRoadmap = (newTasks: Omit<Task, 'id'>[]) => {
    const formatted = newTasks.map((t, idx) => ({
      ...t,
      id: `task-roadmap-${Date.now()}-${idx}`,
    }));
    const updated = [...formatted, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  // Chatbot Handlers
  const handleSendChatMessage = (userMsg: string, aiMsg: string) => {
    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: userMsg,
      timestamp: new Date().toISOString(),
    };
    const aiMessage: ChatMessage = {
      id: 'msg-' + (Date.now() + 1),
      role: 'assistant',
      content: aiMsg,
      timestamp: new Date().toISOString(),
    };
    const updated = [...chatHistory, userMessage, aiMessage];
    setChatHistory(updated);
    StorageService.saveChatHistory(updated);
  };

  const handleClearChatHistory = () => {
    setChatHistory([]);
    StorageService.saveChatHistory([]);
  };

  // Sync Import Trigger
  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const success = StorageService.importDataFromJson(json);
        if (success) {
          // Reload all state
          setTasks(StorageService.getTasks());
          setApplications(StorageService.getApplications());
          setResume(StorageService.getResume());
          setQuestions(StorageService.getQuestions());
          setMockSessions(StorageService.getMockSessions());
          setStudyPlan(StorageService.getStudyPlan());
          setChatHistory(StorageService.getChatHistory());
        }
      } catch (err) {
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      {/* Top Navigation */}
      <Navbar
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        onExportData={StorageService.exportDataAsJson}
        onImportData={handleImportData}
      />

      {/* Main Structural Frame */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingTasksCount={pendingTasksCount}
          activeAppsCount={applications.length}
          stats={stats}
          targetRole={resume.targetRole}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Primary Content Stage */}
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              applications={applications}
              stats={stats}
              onSelectTab={setActiveTab}
              onToggleTask={handleToggleTask}
              onOpenNewTask={() => setActiveTab('tasks')}
              onOpenNewApp={() => setActiveTab('applications')}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskManagementView
              tasks={tasks}
              applications={applications}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleTask}
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationsView
              applications={applications}
              onAddApplication={handleAddApplication}
              onUpdateApplication={handleUpdateApplication}
              onDeleteApplication={handleDeleteApplication}
              onSelectTab={setActiveTab}
              onPrefillInterviewPrep={(company, role) => {
                setPrefilledInterviewCompany(company);
                setPrefilledInterviewRole(role);
              }}
              onPrefillAtsJob={(jobDesc, role) => {
                setPrefilledAtsJobDesc(jobDesc);
                setPrefilledAtsRole(role);
              }}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeManagerView
              resume={resume}
              onUpdateResume={handleUpdateResume}
              prefilledJobDesc={prefilledAtsJobDesc}
              prefilledRole={prefilledAtsRole}
            />
          )}

          {activeTab === 'interviews' && (
            <InterviewPrepView
              questions={questions}
              mockSessions={mockSessions}
              applications={applications}
              onAddQuestion={handleAddQuestion}
              onSaveMockSession={handleSaveMockSession}
              prefilledCompany={prefilledInterviewCompany}
              prefilledRole={prefilledInterviewRole}
            />
          )}

          {activeTab === 'study-plans' && (
            <StudyPlansView
              studyPlan={studyPlan}
              onUpdateStudyPlan={handleUpdateStudyPlan}
              onImportTasksFromRoadmap={handleImportTasksFromRoadmap}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AiAssistantView
              chatHistory={chatHistory}
              onSendMessage={handleSendChatMessage}
              onClearHistory={handleClearChatHistory}
              stats={stats}
              tasks={tasks}
              applications={applications}
              targetRole={resume.targetRole}
            />
          )}
        </main>
      </div>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        tasks={tasks}
        applications={applications}
        questions={questions}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}
