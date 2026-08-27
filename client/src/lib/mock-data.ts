// Phase 1 mock data — Rahul Sharma, target role: Product Manager at tech startup

export interface DimensionScore {
  label: string
  key: string
  value: number
}

export interface PriorityAction {
  rank: number
  action: string
  impact: string
  urgency: 'high' | 'medium' | 'low'
  href: string
}

export interface VelocityPoint {
  month: string
  score: number
}

export interface MockCareerScore {
  overallScore: number
  dimensions: DimensionScore[]
}

export const mockUser = {
  name: 'Rahul Sharma',
  targetRole: 'Product Manager',
  targetCompany: 'tech startup',
  location: 'Bengaluru, India',
  connections: 320,
}

export const mockCareerScore: MockCareerScore = {
  overallScore: 58,
  dimensions: [
    { label: 'Resume Quality', key: 'resumeQuality', value: 62 },
    { label: 'Skill Match', key: 'skillMatch', value: 45 },
    { label: 'Experience Relevance', key: 'experienceRelevance', value: 70 },
    { label: 'Digital Presence', key: 'digitalPresence', value: 38 },
    { label: 'Certifications', key: 'certifications', value: 75 },
  ],
}

export const mockPriorityActions: PriorityAction[] = [
  {
    rank: 1,
    action: 'Complete Product Roadmapping course',
    impact: '+8 pts',
    urgency: 'high',
    href: '/learning',
  },
  {
    rank: 2,
    action: 'Add A/B Testing to your skill profile',
    impact: '+6 pts',
    urgency: 'high',
    href: '/skills',
  },
  {
    rank: 3,
    action: 'Optimize your LinkedIn headline',
    impact: '+4 pts',
    urgency: 'medium',
    href: '/connect',
  },
]

export const mockVelocityData: VelocityPoint[] = [
  { month: 'Mar', score: 42 },
  { month: 'Apr', score: 45 },
  { month: 'May', score: 48 },
  { month: 'Jun', score: 51 },
  { month: 'Jul', score: 55 },
  { month: 'Aug', score: 58 },
]

export interface SkillGapItem {
  skill: string
  urgency: 'high' | 'medium' | 'low'
  closability: 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'done'
  marketDemandPercent: number
  estimatedHours: number
  recommendedResource: {
    platform: 'Coursera' | 'Udemy' | 'YouTube' | 'Microsoft Learn'
    name: string
  }
  scoreImpact: number
}

export const mockSkillGaps: SkillGapItem[] = [
  // Close First — high urgency, high closability
  {
    skill: 'Product Roadmapping',
    urgency: 'high',
    closability: 'high',
    status: 'open',
    marketDemandPercent: 91,
    estimatedHours: 20,
    recommendedResource: { platform: 'Coursera', name: 'Product Management Fundamentals' },
    scoreImpact: 8,
  },
  // Plan For — high urgency, medium closability
  {
    skill: 'A/B Testing',
    urgency: 'high',
    closability: 'medium',
    status: 'in_progress',
    marketDemandPercent: 84,
    estimatedHours: 15,
    recommendedResource: { platform: 'Udemy', name: 'A/B Testing & Experimentation for Beginners' },
    scoreImpact: 6,
  },
  // Long Game — medium urgency, medium closability
  {
    skill: 'Go-to-Market Strategy',
    urgency: 'medium',
    closability: 'medium',
    status: 'open',
    marketDemandPercent: 72,
    estimatedHours: 25,
    recommendedResource: { platform: 'YouTube', name: 'GTM Strategy: From Zero to Launch' },
    scoreImpact: 5,
  },
  // Quick Wins — medium urgency, high closability
  {
    skill: 'User Story Writing',
    urgency: 'medium',
    closability: 'high',
    status: 'open',
    marketDemandPercent: 88,
    estimatedHours: 8,
    recommendedResource: { platform: 'Udemy', name: 'Agile User Stories Mastery' },
    scoreImpact: 4,
  },
  // Long Game — medium urgency, low closability
  {
    skill: 'Advanced Data Analytics',
    urgency: 'medium',
    closability: 'low',
    status: 'open',
    marketDemandPercent: 76,
    estimatedHours: 40,
    recommendedResource: { platform: 'Coursera', name: 'Google Data Analytics Certificate' },
    scoreImpact: 7,
  },
  // Done — high urgency, high closability (completed)
  {
    skill: 'Stakeholder Communication',
    urgency: 'high',
    closability: 'high',
    status: 'done',
    marketDemandPercent: 79,
    estimatedHours: 10,
    recommendedResource: { platform: 'Udemy', name: 'Business Communication Mastery' },
    scoreImpact: 6,
  },
  // Done — medium urgency, high closability (completed)
  {
    skill: 'SQL Fundamentals',
    urgency: 'medium',
    closability: 'high',
    status: 'done',
    marketDemandPercent: 82,
    estimatedHours: 12,
    recommendedResource: { platform: 'Coursera', name: 'SQL for Data Science' },
    scoreImpact: 5,
  },
]

export interface LearningPhaseData {
  phase: 30 | 90 | 180
  label: string
  dateRange: string
  skillNames: string[]
}

export const mockLearningPhases: LearningPhaseData[] = [
  {
    phase: 30,
    label: 'Month 1',
    dateRange: 'Aug 7 – Sep 6, 2026',
    skillNames: ['Product Roadmapping', 'User Story Writing'],
  },
  {
    phase: 90,
    label: 'Months 2–3',
    dateRange: 'Sep 7 – Nov 5, 2026',
    skillNames: ['A/B Testing', 'Go-to-Market Strategy'],
  },
  {
    phase: 180,
    label: 'Months 4–6',
    dateRange: 'Nov 6, 2026 – Feb 3, 2027',
    skillNames: ['Advanced Data Analytics'],
  },
]

export const mockDnaReport = {
  archetype: {
    title: 'The Rising Analyst',
    targetTitle: 'Product Manager',
    description:
      'You have built a strong analytical foundation through your BA role and MBA, positioning you as a credible APM candidate. Your key challenge is bridging the gap from analysis to product ownership — the next 90 days are critical.',
  },
  strengths: [
    { name: 'Stakeholder Management', relevanceTag: 'Core PM Skill', description: 'Demonstrated ability to align cross-functional teams and communicate with senior leadership.' },
    { name: 'Data Analysis (SQL)', relevanceTag: 'Technical Depth', description: 'Strong SQL and Excel skills allow you to make data-driven product decisions independently.' },
    { name: 'Domain Knowledge', relevanceTag: 'Industry Edge', description: 'Two years of BA experience gives you deep context most APM candidates simply lack.' },
    { name: 'MBA Education', relevanceTag: 'Credibility Signal', description: 'MBA from a recognized institution signals strategic thinking capability to hiring managers.' },
    { name: 'Process Documentation', relevanceTag: 'Transferable', description: 'Experience writing BRDs and process flows translates directly to user story writing in PM roles.' },
  ],
  gaps: [
    { name: 'Product Roadmapping', urgency: 'high' as const, recommendedAction: 'Complete a hands-on roadmapping course and build a sample roadmap for a B2C app this week.', marketDemandPercent: 91 },
    { name: 'A/B Testing', urgency: 'high' as const, recommendedAction: 'Learn experimentation fundamentals via Udemy and run a mock A/B test on a personal project.', marketDemandPercent: 84 },
    { name: 'Go-to-Market Strategy', urgency: 'medium' as const, recommendedAction: 'Study 3 successful product launch case studies and build a reusable GTM template.', marketDemandPercent: 72 },
    { name: 'User Story Writing', urgency: 'medium' as const, recommendedAction: 'Practice writing INVEST-compliant user stories for 5 features you use in apps daily.', marketDemandPercent: 88 },
    { name: 'Advanced Analytics', urgency: 'medium' as const, recommendedAction: 'Complete the Google Analytics 4 certification and set up a personal GA4 dashboard.', marketDemandPercent: 76 },
  ],
  riskFlags: [
    { title: 'No Product Artifacts', description: 'Your portfolio lacks PM-specific work samples — recruiters expect PRDs, roadmaps, or case studies.', severity: 'high' as const },
    { title: 'Weak LinkedIn Presence', description: 'Generic headline and low activity score reduce recruiter discoverability by an estimated 40%.', severity: 'medium' as const },
    { title: 'Outdated Certification', description: 'Your Google Analytics cert is 2 years old — a refreshed GA4 cert would strengthen your profile.', severity: 'low' as const },
  ],
  nextActions: [
    { action: 'Build a product roadmap portfolio piece for a B2C app', impact: '+8 pts' },
    { action: 'Complete A/B testing fundamentals course on Udemy', impact: '+6 pts' },
    { action: 'Rewrite LinkedIn headline to "MBA · Aspiring PM · Data-Driven"', impact: '+4 pts' },
  ],
  marketPerceptionScore: 61,
}

export type InterviewCategory = 'behavioral' | 'product_design' | 'estimation' | 'strategy'

export interface InterviewQuestion {
  id: string
  category: InterviewCategory
  question: string
  difficulty: 'easy' | 'medium' | 'hard'
  framework: string[]
  tips: string[]
}

export const mockInterviewQuestions: InterviewQuestion[] = [
  // Behavioral
  {
    id: 'b1',
    category: 'behavioral',
    question: 'Tell me about a time you had to influence a decision without formal authority.',
    difficulty: 'medium',
    framework: [
      'Set the scene: what decision, who held authority, what was at stake',
      'Explain the data or logic you assembled to make your case',
      'Describe how you brought stakeholders along — individually, then together',
      'Share the outcome and what changed as a result',
      'Reflect: what influence tactic would you use differently now',
    ],
    tips: [
      'Use STAR structure but weight heavily on the Action step',
      'Interviewers want proof of cross-functional collaboration, not just persuasion',
      'Avoid stories where you just escalated to your manager — show lateral influence',
    ],
  },
  {
    id: 'b2',
    category: 'behavioral',
    question: 'Describe a product you use daily that you would dramatically improve. Why that product?',
    difficulty: 'easy',
    framework: [
      'Pick a product you genuinely use — authenticity shows',
      'State the specific user problem the current version fails to solve',
      'Propose one focused solution with a clear user benefit',
      'Define 2 metrics you would use to know if it worked',
      'Acknowledge trade-offs or risks of your proposal',
    ],
    tips: [
      '"Add dark mode" or "make it faster" signals shallow thinking — go deeper',
      'Tie your improvement to a business outcome, not just a user convenience',
      'Pick a product relevant to the role: PM candidates should pick B2C or B2B tools they know well',
    ],
  },
  {
    id: 'b3',
    category: 'behavioral',
    question: 'How do you decide what NOT to build when you have more requests than capacity?',
    difficulty: 'hard',
    framework: [
      'Name the framework you default to: RICE, ICE, Impact/Effort matrix',
      'Explain how you gather signal: user data, sales input, strategic themes',
      'Describe how you communicate the decision to disappointed stakeholders',
      'Share an example where saying no led to a better outcome',
    ],
    tips: [
      'This tests prioritisation, a core PM skill — be specific about the framework',
      'Show empathy for the requester while being firm on the rationale',
      'Mention that no is never forever — backlog, quarterly review cycles, etc.',
    ],
  },
  // Product Design
  {
    id: 'pd1',
    category: 'product_design',
    question: 'Design a feature to help Swiggy reduce late deliveries for customers in Tier II cities.',
    difficulty: 'hard',
    framework: [
      'Clarify scope: Tier II cities specifically — what makes them different (distance, partner density)',
      'Identify the user pain: anxiety from uncertainty vs. actual late delivery',
      'Brainstorm solutions: live tracking upgrade, predictive ETA alerts, delivery partner incentives',
      'Pick one, explain the build cost vs. impact trade-off',
      'Define success metrics: on-time %, cancellation rate, CSAT',
    ],
    tips: [
      'Interviewers reward structured thinking over a "right" answer — show the framework clearly',
      'Distinguish between solving the perception problem (anxiety) and the actual delay problem',
      'Mention constraint: solution should work on 2G/low-RAM Android devices for Tier II context',
    ],
  },
  {
    id: 'pd2',
    category: 'product_design',
    question: 'How would you redesign LinkedIn job matching for first-time job seekers in India?',
    difficulty: 'medium',
    framework: [
      'Define the user: fresh graduate, limited experience, Tier I or II city, smartphone-first',
      'State the core problem: keyword-match fails sparse profiles; rejection is demoralising',
      'Propose a solution: skill-signal matching, portfolio upload, peer referral loop',
      'Explain how the new experience changes the funnel from search to apply to hired',
      'Success metrics: application rate, interview conversion, profile completion rate',
    ],
    tips: [
      'Mention the India-specific context: WhatsApp-first, certificate-heavy culture, salary visibility taboo',
      'Show you understand the two-sided marketplace: also think about employer pain',
      'Avoid generic "better algorithm" answers — describe the actual UX change',
    ],
  },
  {
    id: 'pd3',
    category: 'product_design',
    question: 'Design the onboarding experience for a new B2B project management SaaS.',
    difficulty: 'medium',
    framework: [
      'Define the activation goal: user creates their first project and invites one teammate',
      'Map the persona: busy team lead, time-poor, skeptical of yet another tool',
      'Design the flow: import from Jira/Notion, guided first project, value-first (not feature-first)',
      'Address drop-off moments: email confirmation delay, blank-slate problem, permission bottlenecks',
      'Metrics: time-to-activation, D7 retention, invite-sent rate',
    ],
    tips: [
      'The best onboarding delivers the "aha moment" before asking for effort',
      'Mention progressive disclosure — don\'t show all features on day 1',
      'B2B onboarding must account for the org unit, not just the individual',
    ],
  },
  // Estimation
  {
    id: 'e1',
    category: 'estimation',
    question: 'Estimate the number of online food orders placed in Bengaluru on a typical weekday.',
    difficulty: 'medium',
    framework: [
      'Population: Bengaluru ≈ 12M. Working-age (18–50) ≈ 50% → 6M',
      'Internet + app users: ~60% of that → 3.6M potential orderers',
      'Active monthly orderers: ~25% → 900K. Daily orderers: ~20% of monthly → 180K',
      'Average order value check: 180K orders × ~1.1 orders/person = ~200K orders/day',
      'Sanity check: Swiggy claims 1M+ orders/day across India; Bengaluru ≈ 15–20% → 150–200K. Consistent.',
    ],
    tips: [
      'Show your workings step-by-step — the method matters more than the final number',
      'Always do a sanity check against a known benchmark',
      'Round numbers as you go and keep track; precision ≠ accuracy in estimation',
    ],
  },
  {
    id: 'e2',
    category: 'estimation',
    question: 'How many WhatsApp messages are sent in India per day?',
    difficulty: 'easy',
    framework: [
      'India WhatsApp users: ~500M (public fact)',
      'DAU ≈ 70% → 350M active daily',
      'Avg messages sent per active user per day: ~30 (mix of 1:1 and groups)',
      'Total: 350M × 30 = 10.5B messages/day',
      'Sanity check: WhatsApp global is ~100B/day; India ≈ 10–15% of volume. Consistent.',
    ],
    tips: [
      'Starting with a known public statistic is a good anchor — shows business awareness',
      'Distinguish sent vs. received to avoid double-counting if the interviewer pushes',
      'Group chats inflate individual send rates — mention this as a known uncertainty',
    ],
  },
  // Strategy
  {
    id: 's1',
    category: 'strategy',
    question: 'How would you grow PhonePe\'s merchant base by 2× in 12 months?',
    difficulty: 'hard',
    framework: [
      'Understand current state: how many merchants today, what segments (kirana, restaurants, D2C)',
      'Identify growth levers: acquisition (onboarding), activation (first transaction), retention (repeat use)',
      'Prioritise by segment: kirana stores in Tier II cities likely have highest addressable gap',
      'Propose 2–3 initiatives: merchant app UX simplification, referral programme, BNPL for merchants',
      'Define metrics and timeline: merchants onboarded/month, 30-day activation rate, GMV per merchant',
    ],
    tips: [
      'Show you understand both supply (merchants) and demand (consumer behaviour) sides',
      'Anchor on India-specific context: cash-to-digital transition, GST compliance incentive',
      '2× is aggressive — acknowledge trade-offs: quality vs. speed of onboarding',
    ],
  },
  {
    id: 's2',
    category: 'strategy',
    question: 'What would you do in your first 30, 60, and 90 days as a PM at a new company?',
    difficulty: 'easy',
    framework: [
      '0–30 days: Listen and learn. Meet all stakeholders, read existing docs, understand the roadmap history, shadow customer calls',
      '30–60 days: Connect the dots. Identify the top unresolved tension (tech debt vs. new features, B2B vs. B2C), map the competitive landscape',
      '60–90 days: Drive your first win. Pick one small, high-confidence improvement. Ship it. Build credibility.',
    ],
    tips: [
      'The biggest mistake new PMs make is proposing changes before understanding why things are the way they are',
      'Your first win should be small enough to ship in 4 weeks — visible, not revolutionary',
      'Mention the importance of building trust with engineering before asking for anything',
    ],
  },
  {
    id: 's3',
    category: 'strategy',
    question: 'How do you measure the success of a feature after it launches?',
    difficulty: 'medium',
    framework: [
      'Restate the goal metric that justified building it (adoption rate, revenue, NPS delta)',
      'Define leading indicators: early signals that predict the lagging goal metric',
      'Set guardrail metrics: what you must NOT break (load time, support tickets, churn)',
      'Plan the cadence: daily for week 1, weekly for month 1, monthly thereafter',
      'Define when you would roll back, iterate, or double down',
    ],
    tips: [
      'Never use a single metric — always have a primary + at least one guardrail',
      'Distinguish between output metrics (feature usage) and outcome metrics (business value)',
      'Mention A/B test holdout if you ran one — shows rigour',
    ],
  },
]

export type CompanySize = 'startup' | 'mid' | 'large'

export interface JobMatch {
  id: string
  jobTitle: string
  company: string
  location: string
  salaryRange: string
  applyUrl?: string
  isDirectApply?: boolean
  matchScore: number
  isRemote: boolean
  postedDaysAgo: number
  companySize: CompanySize
  matchedSkills: string[]
  gapSkills: string[]
  whyFit: string[]
}

export const mockJobMatches: JobMatch[] = [
  {
    id: 'j1',
    jobTitle: 'Product Manager – Fintech',
    company: 'Groww',
    location: 'Bengaluru',
    salaryRange: '₹22–30 LPA',
    matchScore: 82,
    isRemote: false,
    postedDaysAgo: 2,
    companySize: 'mid',
    matchedSkills: ['Stakeholder Management', 'Data Analysis (SQL)', 'Domain Knowledge', 'MBA Education', 'Process Documentation'],
    gapSkills: ['Product Roadmapping', 'A/B Testing'],
    whyFit: [
      'Your 2 years of BA experience in a fintech-adjacent domain directly mirrors what Groww looks for in new PMs',
      'Strong SQL skills align with Groww\'s data-first product culture',
    ],
  },
  {
    id: 'j2',
    jobTitle: 'Associate Product Manager',
    company: 'Meesho',
    location: 'Bengaluru',
    salaryRange: '₹18–26 LPA',
    matchScore: 78,
    isRemote: false,
    postedDaysAgo: 4,
    companySize: 'large',
    matchedSkills: ['Stakeholder Management', 'Data Analysis (SQL)', 'Domain Knowledge', 'MBA Education'],
    gapSkills: ['Product Roadmapping', 'User Story Writing'],
    whyFit: [
      'Meesho\'s APM programme explicitly targets MBA graduates with BA backgrounds',
      'Your process documentation experience maps well to writing PRDs for Meesho\'s supply-chain product',
    ],
  },
  {
    id: 'j3',
    jobTitle: 'Associate Product Manager',
    company: 'Razorpay',
    location: 'Bengaluru',
    salaryRange: '₹18–24 LPA',
    matchScore: 72,
    isRemote: false,
    postedDaysAgo: 6,
    companySize: 'mid',
    matchedSkills: ['Stakeholder Management', 'Data Analysis (SQL)', 'MBA Education'],
    gapSkills: ['Product Roadmapping', 'A/B Testing'],
    whyFit: [
      'Razorpay values analytical PMs — your SQL proficiency scores high in their rubric',
      'MBA from a recognised institution is a stated preference in Razorpay\'s APM job description',
    ],
  },
  {
    id: 'j4',
    jobTitle: 'Associate PM – Payments',
    company: 'PhonePe',
    location: 'Bengaluru',
    salaryRange: '₹16–22 LPA',
    matchScore: 69,
    isRemote: false,
    postedDaysAgo: 3,
    companySize: 'large',
    matchedSkills: ['Stakeholder Management', 'Domain Knowledge', 'Process Documentation'],
    gapSkills: ['A/B Testing', 'Go-to-Market Strategy'],
    whyFit: [
      'PhonePe APM roles are open to BA → PM transitions; your cross-team coordination experience fits',
      'Closing the A/B Testing gap would push your fit from 69% to 84%',
    ],
  },
  {
    id: 'j5',
    jobTitle: 'Associate Product Manager',
    company: 'CRED',
    location: 'Bengaluru',
    salaryRange: '₹20–28 LPA',
    matchScore: 65,
    isRemote: false,
    postedDaysAgo: 8,
    companySize: 'mid',
    matchedSkills: ['MBA Education', 'Stakeholder Management', 'Data Analysis (SQL)'],
    gapSkills: ['Product Roadmapping', 'A/B Testing', 'User Story Writing'],
    whyFit: [
      'CRED is MBA-first at the APM level — your education is a strong signal here',
      'Their product-led growth mandate means SQL-fluent PMs are prioritised',
    ],
  },
  {
    id: 'j6',
    jobTitle: 'Product Manager – Consumer',
    company: 'Zomato',
    location: 'Gurugram',
    salaryRange: '₹24–32 LPA',
    matchScore: 58,
    isRemote: true,
    postedDaysAgo: 1,
    companySize: 'large',
    matchedSkills: ['Domain Knowledge', 'Stakeholder Management'],
    gapSkills: ['Product Roadmapping', 'A/B Testing', 'Go-to-Market Strategy'],
    whyFit: [
      'This is a stretch role — closing 2 key skill gaps would push your fit above 75%',
      'Zomato\'s PM role requires 1+ year of prior PM experience which you\'d gain in an APM role first',
    ],
  },
  {
    id: 'j7',
    jobTitle: 'Product Manager',
    company: 'Swiggy',
    location: 'Bengaluru',
    salaryRange: '₹28–36 LPA',
    matchScore: 51,
    isRemote: false,
    postedDaysAgo: 10,
    companySize: 'large',
    matchedSkills: ['Stakeholder Management', 'MBA Education'],
    gapSkills: ['Product Roadmapping', 'A/B Testing', 'Go-to-Market Strategy', 'User Story Writing'],
    whyFit: [
      'Swiggy PM roles require 2+ years of direct PM experience — best approached after an APM role',
      'Your domain knowledge is relevant; the fit grows significantly once you close core PM skill gaps',
    ],
  },
  {
    id: 'j8',
    jobTitle: 'Associate Product Manager',
    company: 'Zepto',
    location: 'Mumbai',
    salaryRange: '₹14–20 LPA',
    matchScore: 44,
    isRemote: false,
    postedDaysAgo: 14,
    companySize: 'startup',
    matchedSkills: ['Data Analysis (SQL)', 'Domain Knowledge'],
    gapSkills: ['Product Roadmapping', 'A/B Testing', 'Go-to-Market Strategy', 'User Story Writing', 'Advanced Data Analytics'],
    whyFit: [
      'Zepto operates at hyper-growth pace — requires most PM skills to be already sharp on day one',
      'Location (Mumbai) may be a constraint if you\'re Bengaluru-based',
    ],
  },
]
