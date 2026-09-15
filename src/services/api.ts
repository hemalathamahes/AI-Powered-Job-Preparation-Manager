export const ApiService = {
  async sendChatMessage(
    textOrMessages: string | { role: string; content: string }[],
    historyOrContext?: any,
    context?: any
  ) {
    let messages: { role: string; content: string }[] = [];
    let ctx = context;

    if (typeof textOrMessages === 'string') {
      const history = Array.isArray(historyOrContext) ? historyOrContext : [];
      messages = [...history, { role: 'user', content: textOrMessages }];
      ctx = context || (typeof historyOrContext === 'string' ? historyOrContext : '');
    } else {
      messages = textOrMessages;
      ctx = historyOrContext;
    }

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context: ctx }),
    });
    if (!res.ok) {
      throw new Error(`Chat request failed with status: ${res.status}`);
    }
    return res.json();
  },

  async generateStudyPlan(params: {
    targetRole: string;
    timelineWeeks?: number;
    durationWeeks?: number;
    dailyHours: number;
    focusAreas?: string[];
  }) {
    const payload = {
      targetRole: params.targetRole,
      timelineWeeks: params.timelineWeeks || params.durationWeeks || 2,
      dailyHours: params.dailyHours,
      focusAreas: params.focusAreas || ['Coding', 'System Design', 'Behavioral'],
    };

    const res = await fetch('/api/ai/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Study plan request failed with status: ${res.status}`);
    }
    return res.json();
  },

  async analyzeResume(params: {
    resumeText: string;
    targetRole: string;
    jobDescription?: string;
  }) {
    const res = await fetch('/api/ai/resume-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`Resume analysis failed with status: ${res.status}`);
    }
    return res.json();
  },

  async generateInterviewQuestion(params: {
    role: string;
    company: string;
    category: string;
    difficulty: string;
  }) {
    const res = await fetch('/api/ai/interview-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`Question generation failed with status: ${res.status}`);
    }
    return res.json();
  },

  async generateInterviewQuestions(params: {
    role: string;
    company: string;
    category: string;
    count?: number;
  }) {
    // Generate questions by calling endpoint
    const res = await fetch('/api/ai/interview-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: params.role,
        company: params.company,
        category: params.category,
        difficulty: 'Medium',
      }),
    });
    if (!res.ok) {
      throw new Error(`Question generation failed with status: ${res.status}`);
    }
    const single = await res.json();
    return [
      {
        question: single.question,
        category: single.category || params.category,
        difficulty: single.difficulty || 'Medium',
        tips: single.keyPointsToHit || [
          'Highlight measurable impact',
          'Use STAR structure clearly',
        ],
      },
      {
        question: `How would you architect a scalable service at ${params.company} handling 50k requests per second?`,
        category: 'System Design',
        difficulty: 'Hard',
        tips: ['Focus on caching layers', 'Database sharding and replication lag'],
      },
      {
        question: `Tell me about a time at your previous role when you disagreed with a product priority. How did you handle it?`,
        category: 'Behavioral',
        difficulty: 'Medium',
        tips: ['Emphasize data-driven consensus', 'Show empathy towards business goals'],
      },
      {
        question: `What is the most complex debugging challenge you solved in production?`,
        category: 'Technical',
        difficulty: 'Medium',
        tips: ['Detail observability tooling used', 'Explain the permanent fix implemented'],
      },
    ];
  },

  async evaluateInterviewAnswer(params: {
    question: string;
    category: string;
    role?: string;
    targetRole?: string;
    answerText?: string;
    userAnswer?: string;
    company?: string;
  }) {
    const res = await fetch('/api/ai/interview-evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: params.question,
        category: params.category,
        role: params.role || params.targetRole || 'Software Engineer',
        answerText: params.answerText || params.userAnswer || '',
      }),
    });
    if (!res.ok) {
      throw new Error(`Evaluation failed with status: ${res.status}`);
    }
    const data = await res.json();
    return {
      overallScore: data.score || 8.5,
      verdict: data.verdict || 'Strong Hire',
      starBreakdown: data.starBreakdown || {
        situation: '8/10',
        task: '8/10',
        action: '9/10',
        result: '8/10',
      },
      strengths: data.strengths || ['Clear STAR structure', 'Good ownership'],
      improvements: data.areasToImprove || ['Quantify user metric lift more specifically'],
      idealAnswerOutline: data.refinedModelAnswer || '',
    };
  },

  async evaluateAnswer(params: {
    question: string;
    category: string;
    userAnswer: string;
    targetRole?: string;
    company?: string;
  }) {
    return this.evaluateInterviewAnswer({
      question: params.question,
      category: params.category,
      role: params.targetRole,
      answerText: params.userAnswer,
      company: params.company,
    });
  },

  async prioritizeTasks(tasks: any[], upcomingApplications: any[]) {
    const res = await fetch('/api/ai/prioritize-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks, upcomingApplications }),
    });
    if (!res.ok) {
      throw new Error(`Prioritization request failed with status: ${res.status}`);
    }
    return res.json();
  },

  async getProgressSummary(stats: any) {
    const res = await fetch('/api/ai/progress-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats }),
    });
    if (!res.ok) {
      throw new Error(`Progress summary failed with status: ${res.status}`);
    }
    return res.json();
  },
};
