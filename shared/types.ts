export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}

export interface UserProfile {
  id: string
  name: string
  email: string
  targetRole: string
  targetTimeline: string
  location: string
}

export interface Resume {
  id: string
  userId: string
  rawText: string
  atsScore: number
  keywords: string[]
  parsedAt: string
}

export interface CareerScore {
  id: string
  userId: string
  overallScore: number
  dimensions: {
    resumeQuality: number
    skillMatch: number
    experienceRelevance: number
    digitalPresence: number
    certifications: number
  }
  calculatedAt: string
}

export interface SkillGap {
  id: string
  userId: string
  skill: string
  urgency: 'high' | 'medium' | 'low'
  closability: 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'done'
}

export interface LearningItem {
  id: string
  userId: string
  skillGapId: string
  platform: 'Coursera' | 'Udemy' | 'YouTube' | 'Microsoft Learn' | 'Other'
  url: string
  estimatedHours: number
  timeline: '30_days' | '90_days' | '180_days'
  completed: boolean
}

export interface JobMatch {
  id: string
  userId: string
  jobTitle: string
  company: string
  matchScore: number
  location: string
  salaryRange: string
  gapDelta: string[]
  applyUrl: string
}

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

export interface SkillGapData {
  skill: string
  urgency: 'high' | 'medium' | 'low'
  closability: 'high' | 'medium' | 'low'
  status: 'open'
  marketDemandPercent: number
  estimatedHours: number
  recommendedResource: {
    platform: 'Coursera' | 'Udemy' | 'YouTube' | 'Microsoft Learn'
    name: string
  }
  scoreImpact: number
}

export interface ProfileAnalysis {
  userInfo: {
    name: string
    currentRole: string
    yearsExperience: number
    education: string
    location: string
  }
  careerScore: {
    overallScore: number
    dimensions: DimensionScore[]
  }
  dnaReport: DnaReport
  skillGaps: SkillGapData[]
  priorityActions: PriorityAction[]
  velocityData: VelocityPoint[]
}

export interface DnaReport {
  archetype: {
    title: string
    targetTitle: string
    description: string
  }
  strengths: Array<{
    name: string
    relevanceTag: string
    description: string
  }>
  gaps: Array<{
    name: string
    urgency: 'high' | 'medium' | 'low'
    recommendedAction: string
    marketDemandPercent: number
  }>
  riskFlags: Array<{
    title: string
    description: string
    severity: 'high' | 'medium' | 'low'
  }>
  nextActions: Array<{
    action: string
    impact: string
  }>
  marketPerceptionScore: number
}
