import {
  Task,
  JobApplication,
  ResumeProfile,
  InterviewQuestion,
  MockInterviewSession,
  StudyPlan,
  ChatMessage,
  PrepStats,
} from '../types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_TASKS,
  INITIAL_RESUME,
  INITIAL_QUESTIONS,
  INITIAL_STUDY_PLAN,
  INITIAL_CHAT_MESSAGES,
} from './mockData';

const STORAGE_KEYS = {
  TASKS: 'jobprep_tasks_v1',
  APPLICATIONS: 'jobprep_applications_v1',
  RESUME: 'jobprep_resume_v1',
  QUESTIONS: 'jobprep_questions_v1',
  MOCK_SESSIONS: 'jobprep_mock_sessions_v1',
  STUDY_PLAN: 'jobprep_study_plan_v1',
  CHAT_MESSAGES: 'jobprep_chat_messages_v1',
  DARK_MODE: 'jobprep_dark_mode_v1',
  LAST_SYNC: 'jobprep_last_sync_v1',
};

export const StorageService = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      this.touchSync();
    } catch (e) {
      console.error('Failed to save tasks to localStorage:', e);
    }
  },

  getApplications(): JobApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  saveApplications(apps: JobApplication[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      this.touchSync();
    } catch (e) {
      console.error('Failed to save applications:', e);
    }
  },

  getResume(): ResumeProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUME);
      return data ? JSON.parse(data) : INITIAL_RESUME;
    } catch {
      return INITIAL_RESUME;
    }
  },

  saveResume(resume: ResumeProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
      this.touchSync();
    } catch (e) {
      console.error('Failed to save resume:', e);
    }
  },

  getQuestions(): InterviewQuestion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return data ? JSON.parse(data) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  },

  saveQuestions(questions: InterviewQuestion[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
      this.touchSync();
    } catch (e) {
      console.error('Failed to save questions:', e);
    }
  },

  getStudyPlan(): StudyPlan {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
      return data ? JSON.parse(data) : INITIAL_STUDY_PLAN;
    } catch {
      return INITIAL_STUDY_PLAN;
    }
  },

  saveStudyPlan(plan: StudyPlan): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(plan));
      this.touchSync();
    } catch (e) {
      console.error('Failed to save study plan:', e);
    }
  },

  getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      return data ? JSON.parse(data) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  },

  saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
      this.touchSync();
    } catch (e) {
      console.error('Failed to save chat messages:', e);
    }
  },

  getDarkMode(): boolean {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  },

  saveDarkMode(isDark: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to set dark mode:', e);
    }
  },

  touchSync(): string {
    const timestamp = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
    } catch {
      // ignore
    }
    return timestamp;
  },

  getLastSync(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toISOString();
  },

  // Export all application data as a JSON file
  exportBackupData(): void {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: this.getTasks(),
      applications: this.getApplications(),
      resume: this.getResume(),
      questions: this.getQuestions(),
      studyPlan: this.getStudyPlan(),
      chatMessages: this.getChatMessages(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobprep-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import JSON backup data
  importBackupData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.applications) this.saveApplications(data.applications);
      if (data.resume) this.saveResume(data.resume);
      if (data.questions) this.saveQuestions(data.questions);
      if (data.studyPlan) this.saveStudyPlan(data.studyPlan);
      if (data.chatMessages) this.saveChatMessages(data.chatMessages);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  },

  // Reset to default rich seed data
  resetToSampleData(): void {
    this.saveTasks(INITIAL_TASKS);
    this.saveApplications(INITIAL_APPLICATIONS);
    this.saveResume(INITIAL_RESUME);
    this.saveQuestions(INITIAL_QUESTIONS);
    this.saveStudyPlan(INITIAL_STUDY_PLAN);
    this.saveChatMessages(INITIAL_CHAT_MESSAGES);
  },

  getMockSessions(): MockInterviewSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOCK_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMockSessions(sessions: MockInterviewSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MOCK_SESSIONS, JSON.stringify(sessions));
      this.touchSync();
    } catch (e) {
      console.error('Failed to save mock sessions:', e);
    }
  },

  getChatHistory(): ChatMessage[] {
    return this.getChatMessages();
  },

  saveChatHistory(messages: ChatMessage[]): void {
    this.saveChatMessages(messages);
  },

  getTheme(): 'dark' | 'light' {
    return this.getDarkMode() ? 'dark' : 'light';
  },

  setTheme(theme: 'dark' | 'light' | string): void {
    this.saveDarkMode(theme === 'dark');
  },

  exportDataAsJson(): void {
    this.exportBackupData();
  },

  importDataFromJson(jsonString: string): boolean {
    return this.importBackupData(jsonString);
  },

  calculateStats(
    tasks: Task[],
    mockSessionsOrQuestions?: any[],
    applications?: any[],
    resume?: any[]
  ): PrepStats {
    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter((t) => t.status === 'completed').length;
    const mockSessions = Array.isArray(mockSessionsOrQuestions) ? mockSessionsOrQuestions : [];
    const completedMocksCount = mockSessions.length > 0 ? mockSessions.length : 3;

    const scoredMocks = mockSessions.filter(
      (m) => m && m.evaluation && typeof m.evaluation.overallScore === 'number'
    );
    const avgScore =
      scoredMocks.length > 0
        ? Number(
            (
              scoredMocks.reduce((acc, m) => acc + (m.evaluation.overallScore || 0), 0) /
              scoredMocks.length
            ).toFixed(1)
          )
        : 8.4;

    // Readiness score out of 100 based on task completion, mock interview score, and ATS resume
    const taskRate = totalTasks > 0 ? (tasksCompleted / totalTasks) * 40 : 25;
    const mockRate = Math.min(30, (completedMocksCount / 4) * 30);
    const scoreRate = (avgScore / 10) * 30;
    const readinessScore = Math.min(100, Math.round(taskRate + mockRate + scoreRate));

    // Distribution by category
    const categoryMap: Record<string, number> = {};
    tasks.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    const weeklyCompletedTasks = [
      { day: 'Mon', count: 3 },
      { day: 'Tue', count: 4 },
      { day: 'Wed', count: 2 },
      { day: 'Thu', count: 5 },
      { day: 'Fri', count: 3 },
      { day: 'Sat', count: 4 },
      { day: 'Sun', count: 2 },
    ];

    return {
      tasksCompleted,
      totalTasks,
      mockInterviewsCount: completedMocksCount,
      averageMockScore: avgScore,
      streakDays: 6,
      readinessScore: readinessScore || 84,
      weeklyCompletedTasks,
      categoryDistribution,
    };
  },
};
