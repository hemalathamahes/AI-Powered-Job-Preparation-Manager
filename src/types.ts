export type TaskCategory =
  | 'Coding'
  | 'System Design'
  | 'Behavioral'
  | 'Resume'
  | 'Application'
  | 'Mock Interview'
  | 'Company Research';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  estimatedMinutes: number;
  completedAt?: string;
  applicationId?: string; // Optional link to a Job Application / Project
  tags: string[];
  notes?: string;
  isAiSuggested?: boolean;
}

export type ApplicationStage =
  | 'Wishlist'
  | 'Applied'
  | 'Screening'
  | 'Technical'
  | 'Onsite'
  | 'Offer'
  | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-site';
  salaryRange?: string;
  stage: ApplicationStage;
  priority: 'High' | 'Medium' | 'Low';
  appliedDate?: string;
  interviewDate?: string;
  deadline?: string;
  jobUrl?: string;
  contactName?: string;
  contactEmail?: string;
  jobDescription?: string;
  notes?: string;
  logoColor?: string;
  roundsCompleted?: number;
  totalRounds?: number;
}

export interface ResumeBulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface ResumeProfile {
  id: string;
  title: string;
  fullName: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  summary: string;
  skills: {
    category: string;
    list: string[];
  }[];
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    year: string;
  }[];
  projects: {
    id: string;
    title: string;
    technologies: string;
    description: string;
    impact: string;
  }[];
  lastAtsAnalysis?: {
    atsScore: number;
    matchRating: string;
    summaryAnalysis: string;
    categoryScores: {
      keywords: number;
      quantifiedImpact: number;
      formattingClarity: number;
      roleAlignment: number;
    };
    matchedKeywords: string[];
    missingKeywords: string[];
    bulletImprovements: ResumeBulletImprovement[];
    actionableChecklist: string[];
    analyzedAt: string;
  };
}

export type QuestionCategory = 'Behavioral' | 'Technical' | 'System Design' | 'Company Specific' | 'Coding' | 'Situational';
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionMastery = 'unattempted' | 'practicing' | 'mastered';

export interface StarEvaluation {
  overallScore: number;
  verdict?: string;
  starBreakdown: {
    situation: string | number;
    task: string | number;
    action: string | number;
    result: string | number;
  };
  strengths: string[];
  improvements?: string[];
  areasToImprove?: string[];
  idealAnswerOutline?: string;
  refinedModelAnswer?: string;
}

export interface MockInterviewSession {
  id: string;
  date: string;
  company: string;
  role: string;
  question: string;
  category: string;
  userAnswer: string;
  evaluation: StarEvaluation;
  durationMinutes: number;
}

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  difficulty: QuestionDifficulty;
  company?: string;
  role?: string;
  roleTarget?: string;
  tips?: string[];
  practiced?: boolean;
  interviewerPerspective?: string;
  keyPointsToHit?: string[];
  idealStarFramework?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  userNotes?: string;
  masteryStatus?: QuestionMastery;
  lastAnswer?: string;
  lastScore?: number;
  lastEvaluatedAt?: string;
  lastFeedback?: {
    score: number;
    verdict: string;
    starBreakdown: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    strengths: string[];
    areasToImprove: string[];
    refinedModelAnswer: string;
  };
}

export interface StudyPlanDay {
  dayNumber: number;
  topic?: string;
  focus?: string;
  hours?: number;
  tasks: string[];
  resources?: string[];
  completed?: boolean;
}

export interface StudyPlanWeek {
  weekNumber: number;
  theme: string;
  objective?: string;
  days: StudyPlanDay[];
}

export interface StudyPlan {
  id: string;
  title: string;
  targetRole: string;
  timelineWeeks?: number;
  durationWeeks?: number;
  dailyHours: number;
  focusAreas?: string[];
  overview?: string;
  readinessProjection?: number;
  weeks: StudyPlanWeek[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTasks?: {
    title: string;
    category: TaskCategory;
    priority: TaskPriority;
  }[];
}

export interface PrepStats {
  tasksCompleted: number;
  totalTasks: number;
  mockInterviewsCount: number;
  averageMockScore: number;
  streakDays: number;
  readinessScore: number;
  weeklyCompletedTasks: { day: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
}

export type ActiveTab =
  | 'dashboard'
  | 'tasks'
  | 'applications'
  | 'resume'
  | 'interviews'
  | 'study-plans'
  | 'ai-assistant';
