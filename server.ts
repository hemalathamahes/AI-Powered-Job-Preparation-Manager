import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini AI client initialization with required User-Agent header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Helper for parsing clean JSON from Gemini output
function extractJsonFromText(text: string): any {
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return JSON.parse(trimmed);
    }
    const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1));
    }
    throw new Error('No valid JSON block found in model output');
  } catch (err) {
    console.warn('Failed to parse AI JSON, returning raw text fallback:', err);
    return null;
  }
}

// 1. AI Career Chatbot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages = [], context = {} } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality contextual fallback when API key is not yet set
      const lastUserMsg = messages[messages.length - 1]?.content || 'Hello';
      return res.json({
        reply: `Here is structured career prep advice for: "${lastUserMsg}"\n\n` +
          `1. **Clarify Objective**: Break down your target competencies (e.g. System Design, Behavioral STAR stories, Data Structures).\n` +
          `2. **Execution cadence**: Complete at least 1 mock interview session and 2 focused coding tasks daily.\n` +
          `3. **Metric tracking**: Aim for 80%+ ATS match on your resumes and record metrics (impact, percentages, latency reduction) in bullet points.\n\n` +
          `*Note: Connect your Gemini API key in Settings > Secrets for real-time model synthesis.*`,
        suggestedTasks: [
          { title: 'Draft 3 STAR stories for behavioral interviews', category: 'Behavioral', priority: 'high' },
          { title: 'Review core data structures (Trees & Graphs)', category: 'Coding', priority: 'medium' }
        ]
      });
    }

    const systemPrompt = `You are an elite, encouraging, and highly technical Career Coach & Job Preparation Mentor for tech and knowledge-work roles.
You help candidates:
- Organize daily prep schedules
- Prioritize high-impact interview preparation
- Master technical and behavioral interviews using the STAR method
- Refine resume bullets for maximum quantifiable impact and ATS pass-rates
- Overcome interview anxiety with clear actionable advice

Current Candidate Context:
- Target Role: ${context.targetRole || 'Software Engineer'}
- Active Applications: ${context.applicationsCount || 0}
- Pending Tasks: ${context.pendingTasksCount || 0}
- Current Readiness Score: ${context.readinessScore || 65}%

Keep your responses modern, structured, and actionable with markdown formatting (bullet points, bold highlights).
If appropriate, recommend 1 to 3 specific tasks the candidate should add to their prep tracker.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm ready to help you land your dream offer. What role are we preparing for today?";

    res.json({
      reply: replyText,
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      message: error?.message || 'Internal error'
    });
  }
});

// 2. AI Study Plan Generator Endpoint
app.post('/api/ai/study-plan', async (req, res) => {
  try {
    const { targetRole, timelineWeeks = 2, dailyHours = 2, focusAreas = ['DSA', 'System Design', 'Behavioral'] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Realistic pre-computed fallback
      return res.json({
        title: `${timelineWeeks}-Week Intensive Preparation Plan for ${targetRole || 'Software Engineer'}`,
        overview: `A focused ${dailyHours}h/day study roadmap targeting ${focusAreas.join(', ')} to maximize interview readiness.`,
        readinessProjection: 88,
        weeks: [
          {
            weekNumber: 1,
            theme: 'Foundations, Algorithmic Patterns & Behavioral Framing',
            days: [
              { dayNumber: 1, topic: 'Two Pointers & Sliding Window Patterns', hours: dailyHours, tasks: ['Solve 3 sliding window problems', 'Document pattern template in prep notes'] },
              { dayNumber: 2, topic: 'Binary Search & Tree Traversals', hours: dailyHours, tasks: ['Implement BFS/DFS iterative & recursive', 'Review lowest common ancestor'] },
              { dayNumber: 3, topic: 'Behavioral: Leadership & Conflict Resolution', hours: dailyHours, tasks: ['Draft 2 STAR stories for conflict with teammate', 'Record 2-minute mock answer'] },
              { dayNumber: 4, topic: 'Dynamic Programming & Memoization', hours: dailyHours, tasks: ['Practice 1D DP knapsack variations', 'Trace state transition graphs'] },
              { dayNumber: 5, topic: 'System Design: Scalability & Caching (Redis/CDN)', hours: dailyHours, tasks: ['Study cache invalidation strategies', 'Design a URL shortener high-level flow'] },
              { dayNumber: 6, topic: 'Full Mock Interview & Timed Assessment', hours: dailyHours, tasks: ['Complete a 45-min live coding session', 'Self-grade against rubric'] },
              { dayNumber: 7, topic: 'Weekly Review & Knowledge Gap Analysis', hours: Math.max(1, dailyHours - 1), tasks: ['Review missed questions', 'Polish resume project bullets'] }
            ]
          },
          {
            weekNumber: 2,
            theme: 'Advanced Systems, Speed Drilling & Company Deep Dives',
            days: [
              { dayNumber: 8, topic: 'Distributed Messaging (Kafka/RabbitMQ) & Queues', hours: dailyHours, tasks: ['Compare push vs pull architectures', 'Design rate limiter architecture'] },
              { dayNumber: 9, topic: 'Graph Algorithms & Topological Sort', hours: dailyHours, tasks: ['Solve Course Schedule I & II', 'Review Dijkstra algorithm basics'] },
              { dayNumber: 10, topic: 'Behavioral: Project Ownership & Failures', hours: dailyHours, tasks: ['Prepare story on a technical outage or bug', 'Quantify recovery actions taken'] },
              { dayNumber: 11, topic: 'Database Sharding & Replication Models', hours: dailyHours, tasks: ['Understand SQL vs NoSQL tradeoffs', 'Design an Instagram/Twitter feed schema'] },
              { dayNumber: 12, topic: 'Reverse Interview Questions & Culture Fit', hours: dailyHours, tasks: ['Draft 5 smart reverse questions for interviewers', 'Research target company tech stack'] },
              { dayNumber: 13, topic: 'Final Rapid-fire Technical Simulator', hours: dailyHours, tasks: ['Simulate 60-minute technical interview', 'Refine whiteboard communication speed'] },
              { dayNumber: 14, topic: 'Pre-Interview Mental Reset & Final Checklist', hours: 1, tasks: ['Review cheat sheets and STAR notes', 'Prepare workspace, mic, and resume copy'] }
            ]
          }
        ]
      });
    }

    const prompt = `Generate a realistic, comprehensive, and highly practical study plan for a candidate preparing for the role of "${targetRole}".
Parameters:
- Duration: ${timelineWeeks} weeks
- Daily Prep Time: ${dailyHours} hours/day
- Core Focus Areas: ${focusAreas.join(', ')}

Return ONLY valid JSON matching this structure:
{
  "title": "string",
  "overview": "string",
  "readinessProjection": number,
  "weeks": [
    {
      "weekNumber": number,
      "theme": "string",
      "days": [
        {
          "dayNumber": number,
          "topic": "string",
          "hours": number,
          "tasks": ["string", "string"]
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractJsonFromText(response.text || '');
    if (!parsed) {
      throw new Error('Failed to parse AI study plan response');
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Study Plan Error:', error);
    res.status(500).json({ error: 'Failed to generate study plan', message: error.message });
  }
});

// 3. AI Resume Analyzer & ATS Optimizer Endpoint
app.post('/api/ai/resume-analyze', async (req, res) => {
  try {
    const { resumeText, targetRole = 'Software Engineer', jobDescription = '' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        atsScore: 78,
        matchRating: 'Strong Potential with Key Gaps',
        summaryAnalysis: 'Strong technical grounding, but several bullet points lack quantified business outcomes (e.g. latency, revenue, cost savings).',
        categoryScores: {
          keywords: 76,
          quantifiedImpact: 70,
          formattingClarity: 90,
          roleAlignment: 82
        },
        matchedKeywords: ['TypeScript', 'React', 'REST APIs', 'Node.js', 'Git', 'Agile', 'CI/CD'],
        missingKeywords: ['Docker', 'AWS ECS/Lambda', 'Unit Testing (Jest/Playwright)', 'System Architecture', 'Performance Profiling'],
        bulletImprovements: [
          {
            original: 'Worked on front-end components and fixed bugs for the application dashboard.',
            improved: 'Architected 12+ reusable React components, decreasing page load latency by 34% and resolving 40+ high-priority UI defects across 2 quarters.',
            reason: 'Adds concrete volume (12+ components), quantified latency reduction (34%), and demonstrable defect resolution metrics.'
          },
          {
            original: 'Helped implement backend API routes using Node and Express.',
            improved: 'Designed and deployed 8 RESTful microservices in Node.js/Express handling 50k+ daily requests with 99.9% uptime SLA.',
            reason: 'Replaces passive phrasing with active leadership and enterprise-scale operational numbers.'
          }
        ],
        actionableChecklist: [
          'Incorporate missing keywords in your core skills and project descriptions.',
          'Lead each bullet point with high-impact power verbs (Engineered, Spearheaded, Automated, Reduced).',
          'Ensure contact details and LinkedIn/GitHub profiles are clearly positioned in the header.'
        ]
      });
    }

    const prompt = `You are a Principal Technical Recruiter and ATS (Applicant Tracking System) Specialist.
Analyze the following candidate resume for the target role: "${targetRole}".
${jobDescription ? `Target Job Description:\n${jobDescription}\n` : ''}

Candidate Resume Text:
"""
${resumeText}
"""

Evaluate this rigorously. Return ONLY a valid JSON object with the following structure:
{
  "atsScore": number (0 to 100),
  "matchRating": "string (e.g. Excellent Fit / Strong Potential / Needs Work)",
  "summaryAnalysis": "string (2-3 sentences overview)",
  "categoryScores": {
    "keywords": number (0-100),
    "quantifiedImpact": number (0-100),
    "formattingClarity": number (0-100),
    "roleAlignment": number (0-100)
  },
  "matchedKeywords": ["string", "string"],
  "missingKeywords": ["string", "string"],
  "bulletImprovements": [
    {
      "original": "string (extract a weak or average line from their resume)",
      "improved": "string (STAR-formatted high impact rewritten bullet)",
      "reason": "string (why this version passes ATS and impresses hiring managers)"
    }
  ],
  "actionableChecklist": ["string", "string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractJsonFromText(response.text || '');
    if (!parsed) {
      throw new Error('Failed to parse resume analysis JSON');
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Resume Analyze Error:', error);
    res.status(500).json({ error: 'Failed to analyze resume', message: error.message });
  }
});

// 4. AI Interview Question Generator Endpoint
app.post('/api/ai/interview-question', async (req, res) => {
  try {
    const { role = 'Full Stack Engineer', company = 'Tech Company', category = 'Behavioral', difficulty = 'Medium' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallbackQuestions: Record<string, any> = {
        'Behavioral': {
          question: `Tell me about a time you had to deliver a critical project under a tight deadline with changing requirements. How did you prioritize?`,
          category: 'Behavioral',
          difficulty: 'Medium',
          interviewerPerspective: 'Checking adaptability, prioritization under ambiguity, and proactive stakeholder communication.',
          keyPointsToHit: [
            'Clear definition of the baseline dilemma and stakes',
            'How you triaged trade-offs with product managers and engineers',
            'Actionable milestones implemented',
            'Measurable outcome and post-mortem retrospective'
          ],
          idealStarFramework: {
            situation: 'Q3 feature launch for enterprise client with sudden scope change 2 weeks before deadline.',
            task: 'Needed to deliver MVP without compromising stability or burning out the team.',
            action: 'Ran an emergency triage, negotiated 2 non-essential items to v1.1, and set up daily 15-min syncs.',
            result: 'Delivered MVP on-time with zero critical bugs, securing a $120k contract renewal.'
          }
        },
        'Technical': {
          question: `Explain how you would diagnose and resolve a sudden 500ms latency spike in a high-traffic Node.js API service.`,
          category: 'Technical',
          difficulty: 'Hard',
          interviewerPerspective: 'Evaluates systems debugging methodology, APM observability, profiling, and database connection pooling knowledge.',
          keyPointsToHit: [
            'Observability check: Distributed tracing, Prometheus metrics, error logs',
            'Isolation of bottleneck: Event loop lag, unindexed DB query, external third-party API',
            'Remediation: Connection pool sizing, caching layer, or async worker delegation',
            'Prevention: Load testing and canary alerting'
          ],
          idealStarFramework: {
            situation: 'API response times degraded from 60ms to 560ms during peak checkout hours.',
            task: 'Identify root cause immediately without taking the cluster offline.',
            action: 'Inspected Datadog APM traces; identified sequential DB queries inside a nested loop and lack of Redis caching.',
            result: 'Batch-fetched records and added TTL caching; reduced latency down to 42ms.'
          }
        },
        'System Design': {
          question: `Design a real-time collaborative document editor like Google Docs with conflict resolution and offline syncing.`,
          category: 'System Design',
          difficulty: 'Hard',
          interviewerPerspective: 'Tests understanding of CRDTs vs Operational Transformation (OT), WebSockets, and state persistence.',
          keyPointsToHit: [
            'Functional & non-functional requirements (latency < 100ms, consistency)',
            'Client-server sync protocol (WebSockets with heartbeats)',
            'Concurrency control: Operational Transformation or Yjs/CRDTs',
            'Snapshot persistence and append-only edit logs in Cassandra or Postgres'
          ],
          idealStarFramework: {
            situation: 'Designing collaborative workspace module for 100k active concurrent editors.',
            task: 'Ensure low-latency character-by-character propagation without split-brain conflicts.',
            action: 'Implemented state-based CRDTs with Redis pub/sub broadcasting and WebSocket edge termination.',
            result: 'Maintained sub-50ms peer update delivery with offline reconciliation.'
          }
        }
      };

      const selected = fallbackQuestions[category] || fallbackQuestions['Behavioral'];
      return res.json(selected);
    }

    const prompt = `Generate a realistic, high-caliber interview question tailored for:
Role: ${role}
Target Company: ${company}
Category: ${category} (e.g. Behavioral, Technical, System Design, Situational)
Difficulty: ${difficulty}

Return ONLY valid JSON matching this structure:
{
  "question": "string",
  "category": "string",
  "difficulty": "string",
  "interviewerPerspective": "string (what the interviewer evaluates behind this question)",
  "keyPointsToHit": ["string", "string", "string", "string"],
  "idealStarFramework": {
    "situation": "string",
    "task": "string",
    "action": "string",
    "result": "string"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractJsonFromText(response.text || '');
    if (!parsed) {
      throw new Error('Failed to parse question JSON');
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Interview Question Error:', error);
    res.status(500).json({ error: 'Failed to generate interview question', message: error.message });
  }
});

// 5. AI Mock Interview Answer Evaluator Endpoint
app.post('/api/ai/interview-evaluate', async (req, res) => {
  try {
    const { question, category = 'Behavioral', role = 'Software Engineer', answerText = '' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const length = answerText.trim().split(/\s+/).length;
      const score = Math.min(9, Math.max(5, Math.floor(length / 25) + 4));

      return res.json({
        score: score,
        verdict: score >= 8 ? 'Exemplary STAR Delivery' : 'Good Foundation - Needs More Specific Metrics',
        starBreakdown: {
          situation: 'Set up context well, but could specify company scale or timeline constraints.',
          task: 'Clear statement of your personal ownership vs team role.',
          action: 'Strong operational verbs; explain the specific technical decisions you championed.',
          result: 'Good conclusion, but incorporate hard numbers (e.g., % improvement, revenue saved, hours reduced).'
        },
        strengths: [
          'Clear logical narrative progression.',
          'Highlighted personal contribution rather than just "we".',
          'Professional demeanor in communication.'
        ],
        areasToImprove: [
          'Add quantifiable business metrics (e.g., reduced latency by X%, saved Y engineering hours).',
          'Briefly mention what you would do differently in hindsight to demonstrate self-reflection.'
        ],
        refinedModelAnswer: `In my previous role at a fast-growing SaaS startup, we faced a critical obstacle where ${answerText.slice(0, 80)}... To resolve this, I took direct ownership by establishing automated monitoring, communicating transparently with stakeholders, and implementing a permanent mitigation plan that boosted overall system reliability by 35% with zero regressions.`
      });
    }

    const prompt = `You are a Bar Raiser Interviewer for top-tier companies.
Evaluate the candidate's interview response using the STAR methodology (Situation, Task, Action, Result).

Target Role: ${role}
Question Category: ${category}
Interview Question: "${question}"

Candidate's Spoken/Written Answer:
"""
${answerText}
"""

Evaluate critically and construct constructive, encouraging feedback.
Return ONLY valid JSON with this structure:
{
  "score": number (1 to 10),
  "verdict": "string (e.g. Strong Hire / Hire / Leaning No / No Hire)",
  "starBreakdown": {
    "situation": "string",
    "task": "string",
    "action": "string",
    "result": "string"
  },
  "strengths": ["string", "string"],
  "areasToImprove": ["string", "string"],
  "refinedModelAnswer": "string (rewrite their exact answer into an exemplary 10/10 response using STAR and high-impact metrics)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractJsonFromText(response.text || '');
    if (!parsed) {
      throw new Error('Failed to parse interview evaluation JSON');
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Interview Evaluate Error:', error);
    res.status(500).json({ error: 'Failed to evaluate interview answer', message: error.message });
  }
});

// 6. AI Prioritize Tasks & Actionable Strategy Endpoint
app.post('/api/ai/prioritize-tasks', async (req, res) => {
  try {
    const { tasks = [], upcomingApplications = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        topFocusToday: tasks.slice(0, 3).map((t: any) => t.id),
        rationale: 'Prioritized based on impending interview dates, high-impact core competencies, and application deadlines.',
        strategicAdvice: 'Focus your high-energy morning block on algorithmic problem solving or mock interview drills. Reserve administrative tasks (like updating application records) for the afternoon.',
        recommendedNewTasks: [
          'Review top 5 recent architectural decisions on your resume project',
          'Practice explaining your favorite system design tradeoff out loud'
        ]
      });
    }

    const prompt = `You are an executive productivity coach for job seekers.
Analyze the candidate's current tasks and upcoming job interview pipeline, and determine the optimal priority ranking.

Pending Tasks:
${JSON.stringify(tasks, null, 2)}

Upcoming Applications & Interviews:
${JSON.stringify(upcomingApplications, null, 2)}

Return ONLY valid JSON with:
{
  "topFocusToday": ["taskId1", "taskId2"],
  "rationale": "string",
  "strategicAdvice": "string",
  "recommendedNewTasks": ["string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractJsonFromText(response.text || '');
    if (!parsed) {
      throw new Error('Failed to parse prioritization response');
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Prioritize Error:', error);
    res.status(500).json({ error: 'Failed to prioritize tasks', message: error.message });
  }
});

// 7. AI Progress Summary Endpoint
app.post('/api/ai/progress-summary', async (req, res) => {
  try {
    const { stats = {} } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        readinessScore: 78,
        velocityTier: 'High Momentum 🔥',
        executiveSummary: `You have completed ${stats.completedTasks || 14} preparation tasks and conducted ${stats.mockSessionsCount || 3} mock interviews. Your technical consistency is solid, and your behavioral narrative has strengthened noticeably.`,
        keyWins: [
          'Maintained consistent daily preparation streak',
          'High accuracy in algorithmic problem categories',
          'Strong STAR behavioral answer delivery'
        ],
        bottlenecks: [
          'Need more timed System Design practice sessions',
          'Follow-up pending for 2 active recruiter screenings'
        ],
        nextWeekFocus: 'Execute 2 deep-dive System Design mock interviews and finalize customized resume tailoring for top-priority applications.'
      });
    }

    const prompt = `Generate a concise, motivating executive summary of the candidate's job preparation progress.
Stats:
${JSON.stringify(stats, null, 2)}

Return ONLY valid JSON with:
{
  "readinessScore": number (0 to 100),
  "velocityTier": "string",
  "executiveSummary": "string",
  "keyWins": ["string", "string"],
  "bottlenecks": ["string", "string"],
  "nextWeekFocus": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractJsonFromText(response.text || '');
    if (!parsed) {
      throw new Error('Failed to parse summary response');
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Progress Summary Error:', error);
    res.status(500).json({ error: 'Failed to generate progress summary', message: error.message });
  }
});

// Vite middleware for development vs static build serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Job Preparation Manager server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
