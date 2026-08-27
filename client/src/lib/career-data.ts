// Roles sourced from Naukri, LinkedIn India, Indeed India — top listed categories
export interface JobRoleCategory {
  category: string
  roles: string[]
}

export const JOB_ROLE_CATEGORIES: JobRoleCategory[] = [
  {
    category: 'Technology',
    roles: [
      'Software Engineer',
      'Senior Software Engineer',
      'Full Stack Developer',
      'Frontend Developer',
      'Backend Developer',
      'iOS Developer',
      'Android Developer',
      'QA / Test Engineer',
      'DevOps Engineer',
      'Site Reliability Engineer',
      'Cloud Engineer',
      'Cloud Architect',
      'Cybersecurity Analyst',
      'Blockchain Developer',
      'Embedded Systems Engineer',
    ],
  },
  {
    category: 'Data & AI',
    roles: [
      'Data Analyst',
      'Data Engineer',
      'Data Scientist',
      'Machine Learning Engineer',
      'AI Engineer',
      'Business Intelligence Analyst',
      'Analytics Engineer',
      'MLOps Engineer',
      'Research Scientist (AI/ML)',
    ],
  },
  {
    category: 'Product & Design',
    roles: [
      'Product Manager',
      'Associate Product Manager',
      'Senior Product Manager',
      'Group Product Manager',
      'Product Analyst',
      'Technical Product Manager',
      'UI/UX Designer',
      'Product Designer',
      'UX Researcher',
      'Interaction Designer',
    ],
  },
  {
    category: 'Business & Strategy',
    roles: [
      'Business Analyst',
      'Strategy Consultant',
      'Management Consultant',
      'Business Development Manager',
      'Growth Manager',
      'Product Marketing Manager',
      'Brand Manager',
      'Digital Marketing Manager',
      'Performance Marketing Manager',
      'Category Manager',
    ],
  },
  {
    category: 'Finance',
    roles: [
      'Financial Analyst',
      'Investment Banking Analyst',
      'Equity Research Analyst',
      'Risk Analyst',
      'Credit Analyst',
      'Finance Manager',
      'CA / Chartered Accountant',
    ],
  },
  {
    category: 'Operations & Program',
    roles: [
      'Operations Manager',
      'Program Manager',
      'Project Manager',
      'Technical Program Manager',
      'Scrum Master',
      'Supply Chain Analyst',
      'Logistics Manager',
      'Procurement Analyst',
    ],
  },
  {
    category: 'HR & Talent',
    roles: [
      'HR Manager',
      'HR Business Partner',
      'Talent Acquisition Specialist',
      'Recruiter',
      'Learning & Development Manager',
    ],
  },
]

// Flat list for quick search
export const ALL_JOB_ROLES: string[] = JOB_ROLE_CATEGORIES.flatMap(c => c.roles)

// Top Indian job market cities (Naukri/LinkedIn data)
export interface CityOption {
  city: string
  state: string
}

export const INDIAN_CITIES: CityOption[] = [
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Gurugram', state: 'Haryana' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Chandigarh', state: 'Punjab' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Thiruvananthapuram', state: 'Kerala' },
  { city: 'Mohali', state: 'Punjab' },
  { city: 'Vadodara', state: 'Gujarat' },
  { city: 'Mysuru', state: 'Karnataka' },
  { city: 'Remote / Work from Home', state: '' },
  { city: 'Pan India', state: '' },
]
