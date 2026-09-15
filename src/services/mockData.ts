import {
  Task,
  JobApplication,
  ResumeProfile,
  InterviewQuestion,
  StudyPlan,
  ChatMessage,
} from '../types';

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Senior Frontend Engineer - Billing',
    location: 'San Francisco, CA (Remote)',
    workType: 'Remote',
    salaryRange: '$180,000 - $220,000 + Equity',
    stage: 'Technical',
    priority: 'High',
    appliedDate: '2026-08-20',
    interviewDate: '2026-09-18T14:00:00',
    deadline: '2026-09-18',
    jobUrl: 'https://stripe.com/jobs/billing-fe',
    contactName: 'Sarah Lin (Engineering Manager)',
    contactEmail: 'slin@stripe.com',
    jobDescription:
      'We are looking for an experienced frontend engineer to craft enterprise-grade billing dashboards, payment recovery UI, and high-performance financial data visualizations using React, TypeScript, and robust state machines.',
    notes:
      'Round 2: Practical UI Component architecture & state management exercise (60 mins). Review React concurrent features and optimistic mutations.',
    logoColor: '#635bff',
    roundsCompleted: 1,
    totalRounds: 4,
  },
  {
    id: 'app-2',
    company: 'Linear',
    role: 'Product Engineer (Full Stack)',
    location: 'Remote (Global)',
    workType: 'Remote',
    salaryRange: '$170,000 - $210,000',
    stage: 'Screening',
    priority: 'High',
    appliedDate: '2026-09-02',
    interviewDate: '2026-09-21T16:00:00',
    deadline: '2026-09-21',
    jobUrl: 'https://linear.app/careers',
    contactName: 'Marcus Vance (Recruiter)',
    contactEmail: 'marcus@linear.app',
    jobDescription:
      'Build fast, keyboard-first issue tracking software. Requires mastery of client-side caching, local-first synchronization, WebSockets, and clean UI craftsmanship.',
    notes:
      'Initial 30-min culture & architecture alignment screen. Emphasize background with offline-first indexing and high-fps animations.',
    logoColor: '#5e6ad2',
    roundsCompleted: 0,
    totalRounds: 4,
  },
  {
    id: 'app-3',
    company: 'Datadog',
    role: 'Staff Systems Software Engineer',
    location: 'New York, NY',
    workType: 'Hybrid',
    salaryRange: '$210,000 - $260,000',
    stage: 'Onsite',
    priority: 'High',
    appliedDate: '2026-08-10',
    interviewDate: '2026-09-25T10:00:00',
    deadline: '2026-09-25',
    jobUrl: 'https://careers.datadoghq.com',
    contactName: 'Elena Rostova (Lead Recruiter)',
    contactEmail: 'elena.r@datadog.com',
    jobDescription:
      'Architect distributed telemetry streaming pipelines processing 50M+ metric events per second. Deep Linux internals, memory profiling, and high-throughput network architectures.',
    notes:
      'Full virtual loop scheduled: 2 System Design rounds, 1 Distributed Algorithms round, 1 Executive Leadership round.',
    logoColor: '#632ca6',
    roundsCompleted: 3,
    totalRounds: 5,
  },
  {
    id: 'app-4',
    company: 'Figma',
    role: 'Software Engineer - Canvas Platform',
    location: 'San Francisco, CA',
    workType: 'Hybrid',
    salaryRange: '$190,000 - $230,000',
    stage: 'Applied',
    priority: 'Medium',
    appliedDate: '2026-09-10',
    jobUrl: 'https://figma.com/careers',
    jobDescription:
      'Engineers on the Canvas team build the core rendering engine powering multiplayer design sessions. C++, WebAssembly, WebGL, and modern TypeScript.',
    notes: 'Referral submitted via former colleague James. Awaiting recruiter follow-up.',
    logoColor: '#0acf83',
    roundsCompleted: 0,
    totalRounds: 4,
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Drill Stripe System Design: High-Throughput Webhook Processing',
    description:
      'Diagram at-least-once delivery, idempotency keys, exponential backoff, and dead-letter queues.',
    category: 'System Design',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: '2026-09-17',
    estimatedMinutes: 60,
    applicationId: 'app-1',
    tags: ['System Design', 'Stripe', 'Idempotency', 'Kafka'],
    notes: 'Draw complete architecture on Excalidraw; practice 10-minute verbal walkthrough.',
  },
  {
    id: 'task-2',
    title: 'Formulate 4 STAR behavioral stories for Leadership & Conflict',
    description:
      'Structure stories using Situation, Task, Action, and quantifiable business Result.',
    category: 'Behavioral',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-09-16',
    estimatedMinutes: 45,
    applicationId: 'app-1',
    tags: ['STAR Method', 'Behavioral', 'Leadership'],
    notes: 'Include concrete metrics: % latency improvement, team velocity increase.',
  },
  {
    id: 'task-3',
    title: 'Practice Real-Time WebSockets & Local State Cache for Linear',
    description:
      'Implement an optimistic UI mutation pattern with undo stack in React 19.',
    category: 'Coding',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-09-19',
    estimatedMinutes: 90,
    applicationId: 'app-2',
    tags: ['React', 'Local-First', 'Optimistic UI'],
  },
  {
    id: 'task-4',
    title: 'Run AI ATS Resume Scanner on Datadog Staff Systems role',
    description:
      'Check keyword density for distributed systems, eBPF, telemetry, and high concurrency.',
    category: 'Resume',
    priority: 'medium',
    status: 'completed',
    dueDate: '2026-09-14',
    completedAt: '2026-09-14T18:30:00',
    estimatedMinutes: 30,
    applicationId: 'app-3',
    tags: ['Resume', 'ATS', 'Datadog'],
  },
  {
    id: 'task-5',
    title: 'Solve 3 Graph & Topological Sort Problems on LeetCode',
    description:
      'Alien Dictionary, Course Schedule II, and Parallel Courses dependency graph resolution.',
    category: 'Coding',
    priority: 'medium',
    status: 'completed',
    dueDate: '2026-09-13',
    completedAt: '2026-09-13T20:15:00',
    estimatedMinutes: 75,
    tags: ['Algorithms', 'Graphs', 'Topological Sort'],
  },
  {
    id: 'task-6',
    title: 'Complete 30-minute Mock Interview on STAR Conflict Resolution',
    description:
      'Use the AI Mock Interview simulator to test answers under timer and get instant scoring.',
    category: 'Mock Interview',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-09-17',
    estimatedMinutes: 30,
    tags: ['Mock Prep', 'AI Evaluator', 'Speaking Practice'],
  },
  {
    id: 'task-7',
    title: 'Research Stripe Billing architecture & 10-K investor reports',
    description:
      'Understand enterprise revenue streams, recent Stripe Tax integrations, and team goals.',
    category: 'Company Research',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-09-17',
    estimatedMinutes: 40,
    applicationId: 'app-1',
    tags: ['Research', 'Stripe', 'Reverse Questions'],
  },
];

export const INITIAL_RESUME: ResumeProfile = {
  id: 'resume-1',
  title: 'Full Stack & Distributed Systems Resume (v2026)',
  fullName: 'Alex Morgan',
  targetRole: 'Senior Full Stack & Systems Engineer',
  email: 'alex.morgan.eng@example.com',
  phone: '+1 (415) 890-2341',
  location: 'San Francisco, CA / Remote',
  linkedinUrl: 'https://linkedin.com/in/alexmorgan-eng',
  githubUrl: 'https://github.com/alexmorgan-dev',
  summary:
    'Product-minded Senior Software Engineer with 6+ years designing scalable cloud backends, real-time distributed data pipelines, and responsive web platforms. Proven track record reducing system latencies by 40% and deploying mission-critical payments infrastructure processing $50M+ annually.',
  skills: [
    {
      category: 'Languages & Runtimes',
      list: ['TypeScript', 'JavaScript', 'Go', 'Python', 'Node.js', 'SQL', 'HTML5/CSS3'],
    },
    {
      category: 'Frontend & UI',
      list: ['React 19', 'Next.js', 'Tailwind CSS', 'State Machines', 'WebSockets', 'Vite'],
    },
    {
      category: 'Backend & Distributed Systems',
      list: ['Express', 'gRPC', 'PostgreSQL', 'Redis', 'Apache Kafka', 'GraphQL', 'Docker'],
    },
    {
      category: 'Cloud & DevOps',
      list: ['AWS (ECS, S3, RDS)', 'Google Cloud Platform', 'CI/CD Pipelines', 'Prometheus', 'Datadog'],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Software Engineer',
      company: 'Aura Cloud Technologies',
      duration: '2023 - Present',
      bullets: [
        'Architected real-time event-driven notification engine using Node.js, Kafka, and WebSockets, reducing median push delivery latency from 1.2s to 95ms for 450k daily active users.',
        'Spearheaded migration of legacy monolith to modular TypeScript microservices, improving team PR velocity by 38% and eliminating 15+ recurring deployment bottlenecks.',
        'Mentored 6 junior and mid-level engineers, instituting rigorous automated testing standards that raised test coverage from 58% to 91%.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Software Engineer II',
      company: 'Beacon Payments',
      duration: '2021 - 2023',
      bullets: [
        'Engineered idempotency protocol and retry mechanism for multi-currency payment checkout flows, safeguarding $14M+ in automated monthly subscription volume.',
        'Developed internal diagnostic dashboard in React and Tailwind CSS, slashing merchant dispute resolution turnaround from 4 days to under 4 hours.',
        'Optimized slow analytical SQL queries on Postgres database, decreasing average p99 reporting latency by 62%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      year: '2021',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'HyperQueue - Distributed Task Scheduler',
      technologies: 'Go, Redis, gRPC, Docker',
      description:
        'A lightweight distributed task orchestrator supporting rate limiting, deduplication, and dead-letter queues.',
      impact: 'Tested to process 12,000 tasks/second with sub-10ms scheduling overhead.',
    },
    {
      id: 'proj-2',
      title: 'SyncBoard - Collaborative Infinite Canvas',
      technologies: 'TypeScript, React, WebSockets, CRDTs',
      description:
        'Local-first vector drawing canvas supporting conflict-free peer-to-peer real-time multi-cursor collaboration.',
      impact: 'Achieved 60fps rendering performance with 50+ concurrent live editors.',
    },
  ],
  lastAtsAnalysis: {
    atsScore: 84,
    matchRating: 'Strong Competitive Candidate',
    summaryAnalysis:
      'High-impact resume with outstanding quantifiable metrics and clean technical positioning. Minor optimization needed around cloud infrastructure keywords.',
    categoryScores: {
      keywords: 82,
      quantifiedImpact: 92,
      formattingClarity: 90,
      roleAlignment: 85,
    },
    matchedKeywords: [
      'TypeScript',
      'React',
      'Kafka',
      'WebSockets',
      'PostgreSQL',
      'Microservices',
      'Redis',
      'AWS',
      'CI/CD',
    ],
    missingKeywords: ['Kubernetes', 'System Architecture', 'eBPF', 'Terraform', 'Observability (OpenTelemetry)'],
    bulletImprovements: [
      {
        original: 'Helped build the checkout flow and fixed bugs for payment users.',
        improved:
          'Engineered idempotency protocol and retry mechanism for multi-currency payment checkout flows, safeguarding $14M+ in automated monthly volume.',
        reason:
          'Transforms a generic support task into high-value engineering leadership with measurable revenue protection.',
      },
    ],
    actionableChecklist: [
      'Explicitly cite Terraform or Infrastructure as Code if applicable.',
      'Highlight system-level reliability SLAs (e.g. 99.99% uptime).',
      'Include a targeted 1-sentence headline customized per job application.',
    ],
    analyzedAt: '2026-09-14T19:00:00',
  },
};

export const INITIAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q-1',
    category: 'Behavioral',
    question:
      'Tell me about a time you strongly disagreed with an engineering or product decision. How did you handle it and what was the outcome?',
    difficulty: 'Medium',
    company: 'Stripe',
    interviewerPerspective:
      'Assesses professional conflict resolution, technical diplomacy, commitment to team velocity, and "disagree and commit" ethos.',
    keyPointsToHit: [
      'Frame the disagreement around user outcomes/technical risk rather than personal ego',
      'Demonstrate data-driven analysis and collaborative prototyping',
      'Explain how alignment was reached without lingering friction',
      'Highlight mutual respect and retrospective learnings',
    ],
    idealStarFramework: {
      situation:
        'Product team proposed storing unencrypted API payloads in a rapid-lookup cache to hit an aggressive 2-week launch deadline.',
      task: 'I needed to safeguard compliance and customer security without blocking product momentum.',
      action:
        'I quickly benchmarked tokenized field-level hashing, proving it added only 3ms overhead while satisfying compliance; presented benchmark data next morning.',
      result:
        'Team unanimously adopted the secure architecture and delivered the feature on time with zero compliance audit findings.',
    },
    masteryStatus: 'practicing',
    lastAnswer:
      'At Aura, product wanted to skip integration testing for a rapid beta release. I explained that checkout regressions would cost thousands in chargebacks. I built automated smoke tests in 4 hours so we launched on schedule safely.',
    lastScore: 8,
    lastEvaluatedAt: '2026-09-14T15:20:00',
    lastFeedback: {
      score: 8,
      verdict: 'Strong Delivery with Good Impact',
      starBreakdown: {
        situation: 'Clear business context and competing constraints.',
        task: 'Good personal accountability.',
        action: 'Shows fast practical execution (built automated smoke tests in 4 hours).',
        result: 'Emphasize the exact monetary savings or bug-free telemetry in the post-launch phase.',
      },
      strengths: ['Crisp time-to-solution', 'Protects customer trust'],
      areasToImprove: ['Mention how product managers reacted and how trust grew between teams'],
      refinedModelAnswer:
        'When product proposed bypassing end-to-end integration tests to meet an aggressive beta deadline, I recognized the immediate revenue risk of payment regressions. Rather than just pushing back, I rapidly assembled a targeted 4-hour automated smoke suite covering the top 5 critical payment paths. This allowed us to hit our release date with 100% confidence, catching two latent edge-case bugs before they ever hit production.',
    },
  },
  {
    id: 'q-2',
    category: 'System Design',
    question:
      'Design a globally distributed rate limiting tier that protects critical APIs from DDOS and abusive bursts while maintaining <5ms latency overhead.',
    difficulty: 'Hard',
    company: 'Stripe',
    interviewerPerspective:
      'Tests algorithmic understanding of Token Bucket vs Leaky Bucket vs Sliding Window Counter, along with Redis cluster synchronization vs local edge token buckets.',
    keyPointsToHit: [
      'Clarify throughput requirements (e.g. 500k RPS, multi-region)',
      'Compare Token Bucket vs Sliding Window Log memory overhead',
      'Hybrid approach: Local in-memory leaky bucket with async Redis synchronization',
      'Graceful degradation when Redis tier experiences split-brain or network partitions',
    ],
    idealStarFramework: {
      situation: 'Designing global tier for 100k requests/sec across 4 AWS edge regions.',
      task: 'Prevent abuse without incurring inter-region cross-datacenter roundtrip latency.',
      action:
        'Implemented local memory token buckets at Envoy/edge proxy synchronized every 500ms via Redis clusters with fallback fail-open semantics.',
      result:
        'Maintained sub-2ms overhead at p99, deflecting 2.4M abusive requests daily with 99.999% availability.',
    },
    masteryStatus: 'practicing',
  },
  {
    id: 'q-3',
    category: 'Technical',
    question:
      'Explain how React 19 handles optimistic updates, transitions, and action hooks compared to legacy setState patterns.',
    difficulty: 'Medium',
    company: 'Linear',
    interviewerPerspective:
      'Checks modern frontend depth, declarative state management, user perceived performance, and error rollback strategies.',
    keyPointsToHit: [
      'useOptimistic for instant user feedback with automated rollback on rejection',
      'useTransition / startTransition to prioritize interactive typing over background renders',
      'Action form handling with automated pending states',
      'Preventing UI flickering without manual isLoading boilerplate',
    ],
    idealStarFramework: {
      situation: 'Building a collaborative task editor where users re-order items constantly.',
      task: 'Eliminate latency perception on slow 3G network connections.',
      action:
        'Utilized useOptimistic hook to immediately re-order DOM list while server action executed in background.',
      result: 'Perceived task completion speed improved to 0ms with graceful error toast reverts.',
    },
    masteryStatus: 'mastered',
    lastScore: 9,
  },
  {
    id: 'q-4',
    category: 'Behavioral',
    question:
      'Describe a time when you took initiative to solve a major problem that was not formally assigned to you.',
    difficulty: 'Easy',
    company: 'Linear',
    interviewerPerspective:
      'Evaluates ownership mindset, proactivity, customer empathy, and autonomous execution.',
    keyPointsToHit: [
      'Identified an overlooked pain point or systemic inefficiency',
      'Quantified the silent friction or cost of inaction',
      'Took independent initiative without waiting for management prompting',
      'Measured positive team or customer transformation',
    ],
    idealStarFramework: {
      situation: 'Noticed onboarding engineers spent 4 days configuring local Docker environments.',
      task: 'Wanted to reduce friction and ramp new hires to their first commit within 24 hours.',
      action:
        'Created a standardized devcontainer configuration and unified CLI script on weekends; tested with 2 new hires.',
      result: 'Reduced developer onboarding setup time from 4 days to 45 minutes.',
    },
    masteryStatus: 'mastered',
    lastScore: 10,
  },
  {
    id: 'q-5',
    category: 'Technical',
    question:
      'How does the Linux epoll mechanism work under the hood, and why is it superior to select/poll for high-concurrency event loops?',
    difficulty: 'Hard',
    company: 'Datadog',
    interviewerPerspective:
      'Measures low-level OS systems fluency, kernel-to-user space context switching, O(1) vs O(N) file descriptor readiness inspection.',
    keyPointsToHit: [
      'select/poll re-scans entire array of FDs (O(N)) on every wake-up',
      'epoll maintains a red-black tree of watched descriptors in kernel memory',
      'epoll_wait returns only active descriptors via a ready-list linked list (O(1))',
      'Edge-triggered vs Level-triggered semantics',
    ],
    idealStarFramework: {
      situation: 'Profiling network proxy handling 50k idle persistent connections.',
      task: 'Eliminate 85% CPU burn spent inside kernel polling loops.',
      action: 'Migrated polling loop to edge-triggered epoll with epoll_create1 and non-blocking sockets.',
      result: 'CPU utilization dropped from 88% to 14% under identical 50k connection concurrency.',
    },
    masteryStatus: 'unattempted',
  },
];

export const INITIAL_STUDY_PLAN: StudyPlan = {
  id: 'plan-1',
  title: '2-Week Senior Full Stack & Systems Interview Sprint',
  targetRole: 'Senior Full Stack / Systems Engineer',
  timelineWeeks: 2,
  dailyHours: 2.5,
  focusAreas: ['System Design & Scalability', 'Algorithmic Patterns', 'STAR Behavioral', 'Resume Tailoring'],
  overview:
    'A high-velocity, structured curriculum designed to build peak interview readiness for upcoming technical rounds at Stripe, Linear, and Datadog.',
  readinessProjection: 92,
  createdAt: '2026-09-12',
  weeks: [
    {
      weekNumber: 1,
      theme: 'Core Architectures, Algorithmic Edge Cases & STAR Framing',
      days: [
        {
          dayNumber: 1,
          topic: 'High-Throughput Webhook Processing & Idempotency',
          hours: 2.5,
          tasks: [
            'Diagram idempotency key deduplication with Redis TTL',
            'Draft at-least-once delivery retry backoff state machine',
          ],
          completed: true,
        },
        {
          dayNumber: 2,
          topic: 'Sliding Window & Topological Dependency Resolution',
          hours: 2.5,
          tasks: [
            'Solve Course Schedule II & Alien Dictionary on LeetCode',
            'Time-box each solution to 25 minutes with verbal explanation',
          ],
          completed: true,
        },
        {
          dayNumber: 3,
          topic: 'Behavioral: Leadership, Direct Conflict & Ownership',
          hours: 2.0,
          tasks: [
            'Draft 3 STAR stories highlighting technical diplomacy',
            'Run 20-minute AI Mock Interview on conflict management',
          ],
          completed: true,
        },
        {
          dayNumber: 4,
          topic: 'Distributed Caching Strategies & Sharding',
          hours: 2.5,
          tasks: [
            'Study Cache-Aside, Write-Through, and Write-Behind tradeoffs',
            'Design a distributed LRU cache with eviction policies',
          ],
          completed: false,
        },
        {
          dayNumber: 5,
          topic: 'Modern React 19 State, Actions & Local-First Sync',
          hours: 2.5,
          tasks: [
            'Implement optimistic UI mutations with rollback in React',
            'Review WebSockets reconnect backoff patterns',
          ],
          completed: false,
        },
        {
          dayNumber: 6,
          topic: 'Full 60-Minute Timed Mock Interview Simulation',
          hours: 2.5,
          tasks: [
            'Conduct complete mock interview under real exam conditions',
            'Review AI STAR rubric score and identify weak spots',
          ],
          completed: false,
        },
        {
          dayNumber: 7,
          topic: 'Weekly Retrospective & Resume Fine-Tuning',
          hours: 1.5,
          tasks: [
            'Run AI ATS scan against updated job descriptions',
            'Schedule high-priority tasks for Week 2',
          ],
          completed: false,
        },
      ],
    },
    {
      weekNumber: 2,
      theme: 'Advanced Systems, Rate Limiting & Company Deep Dives',
      days: [
        {
          dayNumber: 8,
          topic: 'Distributed Rate Limiting & Token Bucket Algorithms',
          hours: 2.5,
          tasks: [
            'Implement sliding window log and token bucket in TypeScript',
            'Walk through multi-region Redis synchronization trade-offs',
          ],
          completed: false,
        },
        {
          dayNumber: 9,
          topic: 'Linux Kernels, epoll, and Concurrency Models',
          hours: 2.5,
          tasks: [
            'Review epoll vs select and kernel-to-user space transitions',
            'Practice answering low-level OS latency questions',
          ],
          completed: false,
        },
        {
          dayNumber: 10,
          topic: 'Stripe Technical Round Deep Dive & Reverse Questions',
          hours: 2.5,
          tasks: [
            'Prepare 5 insightful reverse questions for Stripe engineers',
            'Review Stripe API design principles and idempotency RFCs',
          ],
          completed: false,
        },
        {
          dayNumber: 11,
          topic: 'Distributed Database Consistencies (CAP, PACELC, Raft)',
          hours: 2.5,
          tasks: [
            'Compare linearizability vs eventual consistency in practice',
            'Explain Raft leader election and log replication succinctly',
          ],
          completed: false,
        },
        {
          dayNumber: 12,
          topic: 'Behavioral: Project Failures & Production Outages',
          hours: 2.0,
          tasks: [
            'Document post-mortem story with quantifiable mitigation steps',
            'Practice voice delivery to project calm technical maturity',
          ],
          completed: false,
        },
        {
          dayNumber: 13,
          topic: 'Final Rapid-Fire Live Coding Drill',
          hours: 2.5,
          tasks: [
            'Solve 4 medium problems back-to-back under 20-min limits',
            'Focus on edge-case testing before submitting code',
          ],
          completed: false,
        },
        {
          dayNumber: 14,
          topic: 'Pre-Interview Mental Reset & Equipment Checklist',
          hours: 1.0,
          tasks: [
            'Verify camera, microphone, and clean coding environment',
            'Review one-page STAR summary cheat sheet',
          ],
          completed: false,
        },
      ],
    },
  ],
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: `👋 **Welcome to your AI Career & Job Preparation Manager!**\n\nI am your dedicated career mentor, technical interviewer, and productivity partner. Here is what we can do together:\n\n- 🎯 **Organize & Prioritize**: Structure your daily study schedule and optimize upcoming application deadlines.\n- 📄 **ATS Resume Optimization**: Enhance bullet points with quantifiable STAR metrics and keyword density.\n- 🎙️ **Interactive Interview Prep**: Run mock interviews for behavioral, coding, and system design rounds with instant feedback.\n- 📅 **Study Plans**: Generate customized multi-week roadmaps tailored to any company or engineering level.\n\nHow can I help accelerate your interview preparation today?`,
    timestamp: '2026-09-15T08:00:00',
    suggestedTasks: [
      {
        title: 'Complete Stripe System Design webhook drill',
        category: 'System Design',
        priority: 'urgent',
      },
      {
        title: 'Run AI ATS scan on updated resume',
        category: 'Resume',
        priority: 'high',
      },
    ],
  },
];
