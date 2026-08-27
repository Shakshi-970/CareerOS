import type { JobMatch } from './mock-data'

// ─── Role-specific job match data ─────────────────────────────────────────────

const DS_JOBS: JobMatch[] = [
  {
    id: 'ds1', jobTitle: 'Data Scientist', company: 'Flipkart',
    location: 'Bengaluru', salaryRange: '₹24–35 LPA', matchScore: 83,
    isRemote: false, postedDaysAgo: 2, companySize: 'large',
    matchedSkills: ['Python', 'SQL', 'Machine Learning', 'Statistical Analysis', 'Data Visualisation'],
    gapSkills: ['Deep Learning', 'Spark / Big Data'],
    whyFit: [
      "Flipkart Data Science team explicitly looks for strong Python + SQL foundations — directly matches your profile",
      "Your statistical analysis experience transfers directly to their recommendation and pricing models",
    ],
  },
  {
    id: 'ds2', jobTitle: 'Senior Data Scientist', company: 'PhonePe',
    location: 'Bengaluru', salaryRange: '₹30–45 LPA', matchScore: 76,
    isRemote: false, postedDaysAgo: 4, companySize: 'large',
    matchedSkills: ['Python', 'SQL', 'A/B Testing', 'Statistical Modelling'],
    gapSkills: ['NLP / Text Mining', 'MLOps'],
    whyFit: [
      "PhonePe's DS team runs high-scale experiments — your A/B testing background is a strong differentiator",
      "Fintech domain knowledge increases your relevance score against purely technical candidates",
    ],
  },
  {
    id: 'ds3', jobTitle: 'Machine Learning Engineer', company: 'Swiggy',
    location: 'Bengaluru', salaryRange: '₹28–40 LPA', matchScore: 71,
    isRemote: false, postedDaysAgo: 5, companySize: 'large',
    matchedSkills: ['Python', 'Scikit-learn', 'SQL', 'Feature Engineering'],
    gapSkills: ['TensorFlow / PyTorch', 'Model Deployment (MLOps)'],
    whyFit: [
      "Swiggy's ML team values breadth across modelling and engineering — your cross-functional experience fits",
      "Real-time recommendation at Swiggy's scale uses classical ML extensively, where your foundations shine",
    ],
  },
  {
    id: 'ds4', jobTitle: 'Data Scientist – Growth', company: 'Meesho',
    location: 'Bengaluru', salaryRange: '₹20–30 LPA', matchScore: 78,
    isRemote: false, postedDaysAgo: 3, companySize: 'large',
    matchedSkills: ['Python', 'SQL', 'Cohort Analysis', 'Regression Models'],
    gapSkills: ['Causal Inference', 'Bayesian Methods'],
    whyFit: [
      "Meesho Growth DS roles are analytics-heavy — your SQL and cohort analysis skills map perfectly",
      "Smaller model complexity = faster impact; your foundations let you ship in week 1",
    ],
  },
  {
    id: 'ds5', jobTitle: 'Applied Data Scientist', company: 'Juspay',
    location: 'Bengaluru', salaryRange: '₹18–28 LPA', matchScore: 68,
    isRemote: true, postedDaysAgo: 7, companySize: 'mid',
    matchedSkills: ['Python', 'Statistical Analysis', 'SQL'],
    gapSkills: ['Haskell / Functional Programming', 'Payments Domain Expertise'],
    whyFit: [
      "Juspay values mathematically rigorous data scientists — your statistics background is a fit",
      "Startup environment means broader scope; your generalist DS profile is an advantage over specialists",
    ],
  },
]

const DA_JOBS: JobMatch[] = [
  {
    id: 'da1', jobTitle: 'Product Analyst', company: 'Razorpay',
    location: 'Bengaluru', salaryRange: '₹16–24 LPA', matchScore: 85,
    isRemote: false, postedDaysAgo: 2, companySize: 'mid',
    matchedSkills: ['SQL', 'Excel / Sheets', 'Dashboard Design', 'Business Metrics', 'Stakeholder Communication'],
    gapSkills: ['Python (Pandas)', 'Looker / Tableau'],
    whyFit: [
      "Razorpay Product Analysts are expected to own dashboards end-to-end — your SQL depth is exactly the bar they set",
      "Fintech domain awareness translates directly to understanding their payment funnel metrics",
    ],
  },
  {
    id: 'da2', jobTitle: 'Business Analyst', company: 'CRED',
    location: 'Bengaluru', salaryRange: '₹14–22 LPA', matchScore: 79,
    isRemote: false, postedDaysAgo: 3, companySize: 'mid',
    matchedSkills: ['SQL', 'Excel', 'Data Storytelling', 'KPI Definition'],
    gapSkills: ['dbt', 'Python Automation'],
    whyFit: [
      "CRED's analytics culture prizes structured thinking over raw coding — your business acumen is the differentiator",
      "High-net-worth user base analysis needs strong business context — your domain experience fills that need",
    ],
  },
  {
    id: 'da3', jobTitle: 'Analytics Manager', company: 'Zomato',
    location: 'Gurugram', salaryRange: '₹20–30 LPA', matchScore: 73,
    isRemote: false, postedDaysAgo: 5, companySize: 'large',
    matchedSkills: ['SQL', 'Data Visualisation', 'Business Intelligence', 'Stakeholder Management'],
    gapSkills: ['Python / Pandas', 'Spark'],
    whyFit: [
      "Zomato Analytics Managers need to translate data to business decisions — your communication skills score high",
      "Food-tech funnel metrics (conversion, retention, CAC) are learnable fast given your analytics foundation",
    ],
  },
  {
    id: 'da4', jobTitle: 'Data Analyst – Growth', company: 'Groww',
    location: 'Bengaluru', salaryRange: '₹12–18 LPA', matchScore: 81,
    isRemote: false, postedDaysAgo: 1, companySize: 'mid',
    matchedSkills: ['SQL', 'Excel', 'A/B Testing', 'Funnel Analysis', 'Business Metrics'],
    gapSkills: ['Python Scripting', 'Amplitude / Mixpanel'],
    whyFit: [
      "Groww Growth team runs a SQL-first culture — you'd be productive from day 1",
      "Your A/B testing knowledge directly feeds into their acquisition and activation experiment roadmap",
    ],
  },
  {
    id: 'da5', jobTitle: 'Senior Business Analyst', company: 'Accenture',
    location: 'Mumbai', salaryRange: '₹14–20 LPA', matchScore: 69,
    isRemote: false, postedDaysAgo: 6, companySize: 'large',
    matchedSkills: ['SQL', 'Excel', 'Process Documentation', 'Stakeholder Management'],
    gapSkills: ['Power BI', 'JIRA / Agile Tools'],
    whyFit: [
      "Accenture BA roles are cross-industry — your broad analytical background is an asset not a liability",
      "Strong documentation and stakeholder skills align with their client-delivery model",
    ],
  },
]

const DE_JOBS: JobMatch[] = [
  {
    id: 'de1', jobTitle: 'Data Engineer', company: 'Flipkart',
    location: 'Bengaluru', salaryRange: '₹22–35 LPA', matchScore: 80,
    isRemote: false, postedDaysAgo: 2, companySize: 'large',
    matchedSkills: ['Python', 'SQL', 'Spark', 'Hadoop', 'ETL Pipelines'],
    gapSkills: ['dbt', 'Kafka Streaming'],
    whyFit: [
      "Flipkart's data platform handles petabyte scale — your Spark experience is directly applicable",
      "Strong SQL fundamentals are table stakes at Flipkart; your depth separates you from junior candidates",
    ],
  },
  {
    id: 'de2', jobTitle: 'Senior Data Engineer', company: 'PhonePe',
    location: 'Bengaluru', salaryRange: '₹28–42 LPA', matchScore: 75,
    isRemote: false, postedDaysAgo: 3, companySize: 'large',
    matchedSkills: ['Python', 'Spark', 'SQL', 'Cloud (AWS/GCP)', 'Pipeline Orchestration'],
    gapSkills: ['Flink (real-time streaming)', 'Data Mesh architecture'],
    whyFit: [
      "PhonePe's data team runs 1000+ daily pipelines — your orchestration experience is high-signal",
      "Fintech reliability requirements mean your experience with data quality validation stands out",
    ],
  },
  {
    id: 'de3', jobTitle: 'Analytics Engineer', company: 'Razorpay',
    location: 'Bengaluru', salaryRange: '₹20–30 LPA', matchScore: 77,
    isRemote: false, postedDaysAgo: 4, companySize: 'mid',
    matchedSkills: ['SQL', 'dbt', 'Python', 'Data Modelling'],
    gapSkills: ['Spark (heavy usage)', 'Airflow Administration'],
    whyFit: [
      "Razorpay's Analytics Engineering team owns the semantic layer — your dbt experience is rare and valued",
      "Their payments data model complexity needs someone who thinks in schemas, which your background supports",
    ],
  },
  {
    id: 'de4', jobTitle: 'Data Platform Engineer', company: 'Zepto',
    location: 'Mumbai', salaryRange: '₹18–26 LPA', matchScore: 71,
    isRemote: false, postedDaysAgo: 5, companySize: 'mid',
    matchedSkills: ['Python', 'SQL', 'ETL Pipelines', 'Cloud Infrastructure'],
    gapSkills: ['Kafka', 'Real-time processing'],
    whyFit: [
      "Zepto's 10-minute delivery model needs real-time data — your batch pipeline experience is the foundation",
      "Fast-growth startup means you'll own infra decisions early; your engineering breadth is advantageous",
    ],
  },
]

const MLE_JOBS: JobMatch[] = [
  {
    id: 'mle1', jobTitle: 'ML Engineer', company: 'Flipkart',
    location: 'Bengaluru', salaryRange: '₹26–40 LPA', matchScore: 82,
    isRemote: false, postedDaysAgo: 2, companySize: 'large',
    matchedSkills: ['Python', 'TensorFlow / PyTorch', 'ML Pipelines', 'Model Serving', 'Feature Engineering'],
    gapSkills: ['Recommendation Systems', 'A/B Framework at Scale'],
    whyFit: [
      "Flipkart's ML team ships personalization at 300M+ users — your model deployment skills are directly applicable",
      "Their MLOps maturity means you'll learn best-in-class practices from day 1",
    ],
  },
  {
    id: 'mle2', jobTitle: 'Applied ML Engineer', company: 'PhonePe',
    location: 'Bengaluru', salaryRange: '₹30–45 LPA', matchScore: 76,
    isRemote: false, postedDaysAgo: 3, companySize: 'large',
    matchedSkills: ['Python', 'ML Modelling', 'Real-time Inference', 'Risk Modelling'],
    gapSkills: ['Fraud Detection Specialisation', 'Low-latency serving (<10ms)'],
    whyFit: [
      "PhonePe's fraud and credit ML teams run latency-sensitive models — your real-time inference experience scores high",
      "Fintech ML context (risk, compliance) narrows competition; your domain familiarity is a differentiator",
    ],
  },
  {
    id: 'mle3', jobTitle: 'Research Scientist (ML)', company: 'Microsoft',
    location: 'Hyderabad', salaryRange: '₹35–60 LPA', matchScore: 68,
    isRemote: false, postedDaysAgo: 6, companySize: 'large',
    matchedSkills: ['Python', 'Deep Learning', 'Research Methodology', 'Publications / Projects'],
    gapSkills: ['Published Research', 'LLM Fine-tuning Expertise'],
    whyFit: [
      "Microsoft IDC Hyderabad is one of India's top ML research hubs — a stretch role with high upside",
      "Your applied ML background provides the practical grounding MSR values alongside research orientation",
    ],
  },
  {
    id: 'mle4', jobTitle: 'ML Engineer – GenAI', company: 'Groww',
    location: 'Bengaluru', salaryRange: '₹24–36 LPA', matchScore: 73,
    isRemote: false, postedDaysAgo: 4, companySize: 'mid',
    matchedSkills: ['Python', 'LLM APIs', 'Prompt Engineering', 'RAG Pipelines'],
    gapSkills: ['LLM Fine-tuning', 'Vector DB Operations at Scale'],
    whyFit: [
      "Groww's AI team is building GenAI features for 50M+ investors — early-stage means high ownership",
      "Your LLM application experience aligns with their chatbot and advisory product roadmap",
    ],
  },
]

const SWE_JOBS: JobMatch[] = [
  {
    id: 'swe1', jobTitle: 'Backend Software Engineer', company: 'Razorpay',
    location: 'Bengaluru', salaryRange: '₹20–32 LPA', matchScore: 82,
    isRemote: false, postedDaysAgo: 1, companySize: 'mid',
    matchedSkills: ['Java / Golang', 'REST APIs', 'Microservices', 'SQL', 'System Design'],
    gapSkills: ['Distributed Transactions', 'gRPC'],
    whyFit: [
      "Razorpay's payments infra is mission-critical — your strong API design background is a top signal",
      "High-frequency transaction systems at Razorpay match your experience with low-latency backend services",
    ],
  },
  {
    id: 'swe2', jobTitle: 'Software Engineer II', company: 'CRED',
    location: 'Bengaluru', salaryRange: '₹22–34 LPA', matchScore: 78,
    isRemote: false, postedDaysAgo: 3, companySize: 'mid',
    matchedSkills: ['Python / Go', 'REST APIs', 'PostgreSQL', 'Redis', 'OOP Principles'],
    gapSkills: ['Event-driven Architecture', 'Kafka'],
    whyFit: [
      "CRED invests heavily in engineering quality — your clean code and testing practices are valued culture signals",
      "Their fintech backend complexity (credit, rewards) maps well to your financial services experience",
    ],
  },
  {
    id: 'swe3', jobTitle: 'Senior SWE – Platform', company: 'BrowserStack',
    location: 'Mumbai', salaryRange: '₹28–42 LPA', matchScore: 74,
    isRemote: true, postedDaysAgo: 4, companySize: 'mid',
    matchedSkills: ['Python', 'Distributed Systems', 'REST APIs', 'Cloud Infra', 'CI/CD'],
    gapSkills: ['Browser Automation Internals', 'WebDriver Protocol'],
    whyFit: [
      "BrowserStack's global platform runs at massive scale — your distributed systems experience is a fit",
      "Remote-friendly culture + product in developer tooling = high-quality engineering culture",
    ],
  },
  {
    id: 'swe4', jobTitle: 'Full Stack Engineer', company: 'Zepto',
    location: 'Mumbai', salaryRange: '₹18–28 LPA', matchScore: 70,
    isRemote: false, postedDaysAgo: 5, companySize: 'mid',
    matchedSkills: ['React', 'Node.js', 'PostgreSQL', 'REST APIs'],
    gapSkills: ['Real-time Ops Dashboard Expertise', 'Mobile (React Native)'],
    whyFit: [
      "Zepto's speed of growth means engineers take on senior responsibilities quickly",
      "Your full-stack breadth matches their small-team, ship-fast engineering culture",
    ],
  },
]

const BA_JOBS: JobMatch[] = [
  {
    id: 'ba1', jobTitle: 'Business Analyst', company: 'Deloitte',
    location: 'Mumbai', salaryRange: '₹10–16 LPA', matchScore: 84,
    isRemote: false, postedDaysAgo: 2, companySize: 'large',
    matchedSkills: ['Business Requirements Analysis', 'Process Mapping', 'Excel', 'Stakeholder Management', 'Documentation'],
    gapSkills: ['SQL / Data Analysis', 'JIRA / Confluence'],
    whyFit: [
      "Deloitte's consulting BA track values structured thinking and communication — your profile matches their hire criteria",
      "Your cross-functional project exposure fits the multi-client environment at Deloitte",
    ],
  },
  {
    id: 'ba2', jobTitle: 'Senior Business Analyst', company: 'Accenture',
    location: 'Bengaluru', salaryRange: '₹12–18 LPA', matchScore: 79,
    isRemote: false, postedDaysAgo: 3, companySize: 'large',
    matchedSkills: ['Requirements Gathering', 'Process Documentation', 'Stakeholder Workshops', 'Excel / PowerPoint'],
    gapSkills: ['Agile / Scrum Certification', 'SAP / ERP Experience'],
    whyFit: [
      "Accenture BAs work across industries — your adaptable background and process skills are core requirements",
      "Strong documentation and facilitation skills differentiate you in their BA assessment process",
    ],
  },
  {
    id: 'ba3', jobTitle: 'Strategy & Operations Analyst', company: 'Swiggy',
    location: 'Bengaluru', salaryRange: '₹14–20 LPA', matchScore: 75,
    isRemote: false, postedDaysAgo: 4, companySize: 'large',
    matchedSkills: ['Data Analysis', 'Process Improvement', 'SQL (basic)', 'Business Communication'],
    gapSkills: ['Python / Advanced SQL', 'Operations Metrics (OTIF, NPS)'],
    whyFit: [
      "Swiggy Ops Analyst roles blend business analysis with data — your hybrid background is the target profile",
      "Hyperlocal logistics needs process thinkers who can also analyse data; you bridge both",
    ],
  },
  {
    id: 'ba4', jobTitle: 'Product Business Analyst', company: 'PhonePe',
    location: 'Bengaluru', salaryRange: '₹12–18 LPA', matchScore: 72,
    isRemote: false, postedDaysAgo: 5, companySize: 'large',
    matchedSkills: ['Requirements Analysis', 'User Stories', 'Stakeholder Management', 'SQL (basic)'],
    gapSkills: ['API Documentation', 'Payments Domain Knowledge'],
    whyFit: [
      "PhonePe's product BA role bridges business and engineering — your documentation skills are critical here",
      "UPI/payments background can be learnt fast; your BA fundamentals are the harder-to-teach skills",
    ],
  },
  {
    id: 'ba5', jobTitle: 'Management Trainee – Strategy', company: 'Zomato',
    location: 'Gurugram', salaryRange: '₹10–15 LPA', matchScore: 68,
    isRemote: false, postedDaysAgo: 7, companySize: 'large',
    matchedSkills: ['Analytical Thinking', 'Excel', 'Presentation Skills', 'Problem Structuring'],
    gapSkills: ['SQL Proficiency', 'Consumer Insights'],
    whyFit: [
      "Zomato's management trainee track fast-tracks to senior roles — a high-upside entry for strong analysts",
      "Their data-first culture rewards people who can structure problems well, which your background demonstrates",
    ],
  },
]

const PM_JOBS: JobMatch[] = [
  {
    id: 'pm1', jobTitle: 'Product Manager – Fintech', company: 'Groww',
    location: 'Bengaluru', salaryRange: '₹22–30 LPA', matchScore: 82,
    isRemote: false, postedDaysAgo: 2, companySize: 'mid',
    matchedSkills: ['Stakeholder Management', 'Data Analysis (SQL)', 'Domain Knowledge', 'MBA Education', 'Process Documentation'],
    gapSkills: ['Product Roadmapping', 'A/B Testing'],
    whyFit: [
      "Your 2 years of BA experience in a fintech-adjacent domain directly mirrors what Groww looks for in new PMs",
      "Strong SQL skills align with Groww's data-first product culture",
    ],
  },
  {
    id: 'pm2', jobTitle: 'Associate Product Manager', company: 'Meesho',
    location: 'Bengaluru', salaryRange: '₹18–26 LPA', matchScore: 78,
    isRemote: false, postedDaysAgo: 4, companySize: 'large',
    matchedSkills: ['Stakeholder Management', 'Data Analysis (SQL)', 'Domain Knowledge', 'MBA Education'],
    gapSkills: ['Product Roadmapping', 'User Story Writing'],
    whyFit: [
      "Meesho's APM programme explicitly targets MBA graduates with BA backgrounds",
      "Your process documentation experience maps well to writing PRDs for Meesho's supply-chain product",
    ],
  },
  {
    id: 'pm3', jobTitle: 'Associate Product Manager', company: 'Razorpay',
    location: 'Bengaluru', salaryRange: '₹18–24 LPA', matchScore: 72,
    isRemote: false, postedDaysAgo: 6, companySize: 'mid',
    matchedSkills: ['Stakeholder Management', 'Data Analysis (SQL)', 'MBA Education'],
    gapSkills: ['Product Roadmapping', 'A/B Testing'],
    whyFit: [
      "Razorpay values analytical PMs — your SQL proficiency scores high in their rubric",
      "MBA from a recognised institution is a stated preference in Razorpay's APM job description",
    ],
  },
  {
    id: 'pm4', jobTitle: 'Associate PM – Payments', company: 'PhonePe',
    location: 'Bengaluru', salaryRange: '₹16–22 LPA', matchScore: 69,
    isRemote: false, postedDaysAgo: 3, companySize: 'large',
    matchedSkills: ['Stakeholder Management', 'Domain Knowledge', 'Process Documentation'],
    gapSkills: ['A/B Testing', 'Go-to-Market Strategy'],
    whyFit: [
      "PhonePe's APM program is structured — strong for candidates who have business fundamentals but lack deep PM experience",
      "Your analytical background is valued in PhonePe's data-heavy product culture",
    ],
  },
]

const CONSULTING_JOBS: JobMatch[] = [
  {
    id: 'c1', jobTitle: 'Strategy Consultant', company: 'McKinsey',
    location: 'Mumbai', salaryRange: '₹22–32 LPA', matchScore: 74,
    isRemote: false, postedDaysAgo: 5, companySize: 'large',
    matchedSkills: ['Structured Problem Solving', 'Business Case Analysis', 'Stakeholder Communication', 'Excel / PowerPoint'],
    gapSkills: ['Management Consulting Frameworks', 'Client-facing experience'],
    whyFit: [
      "McKinsey's analysts are expected to synthesise complex problems into clear recommendations — your analytical background is the base",
      "Strong business acumen and communication differentiate you in their case interview process",
    ],
  },
  {
    id: 'c2', jobTitle: 'Business Analyst', company: 'BCG',
    location: 'Bengaluru', salaryRange: '₹20–28 LPA', matchScore: 71,
    isRemote: false, postedDaysAgo: 6, companySize: 'large',
    matchedSkills: ['Data Analysis', 'Business Strategy', 'Presentation Skills', 'Market Research'],
    gapSkills: ['Consulting Case Methodology', 'Industry-specific expertise'],
    whyFit: [
      "BCG BAs own quantitative analysis — your data skills are the primary evaluation criterion",
      "Diversity of industry exposure at BCG means your generalist background is an advantage in early cases",
    ],
  },
  {
    id: 'c3', jobTitle: 'Associate Consultant', company: 'Deloitte',
    location: 'Mumbai', salaryRange: '₹14–22 LPA', matchScore: 78,
    isRemote: false, postedDaysAgo: 3, companySize: 'large',
    matchedSkills: ['Process Analysis', 'Stakeholder Management', 'Excel', 'Business Requirements'],
    gapSkills: ['Project Management Certification', 'ERP / SAP Knowledge'],
    whyFit: [
      "Deloitte Consulting values structured analysts who can deliver client value on day 1 — your profile scores well",
      "Their digital transformation practice is actively hiring — your tech exposure adds to your consulting profile",
    ],
  },
  {
    id: 'c4', jobTitle: 'Strategy & Operations', company: 'Bain',
    location: 'Mumbai', salaryRange: '₹18–26 LPA', matchScore: 65,
    isRemote: false, postedDaysAgo: 8, companySize: 'large',
    matchedSkills: ['Analytical Thinking', 'Market Sizing', 'Communication'],
    gapSkills: ['Prior Consulting Experience', 'Advanced Modelling (DCF, LBO)'],
    whyFit: [
      "Bain is selective but values intellectual curiosity — a strong case interview performance can offset limited consulting experience",
      "Your structured thinking approach aligns with Bain's results-delivery culture",
    ],
  },
]

const FRONTEND_JOBS: JobMatch[] = [
  {
    id: 'fe1', jobTitle: 'Frontend Engineer', company: 'CRED',
    location: 'Bengaluru', salaryRange: '₹20–32 LPA', matchScore: 84,
    isRemote: false, postedDaysAgo: 2, companySize: 'mid',
    matchedSkills: ['React', 'TypeScript', 'CSS / Tailwind', 'State Management', 'Performance Optimisation'],
    gapSkills: ['React Native', 'WebGL / Animation'],
    whyFit: [
      "CRED's design-obsessed culture demands frontend engineers who care about polish — your CSS depth is high-signal",
      "Their component library investment means you'll build systems, not just pages",
    ],
  },
  {
    id: 'fe2', jobTitle: 'Senior Frontend Developer', company: 'Groww',
    location: 'Bengaluru', salaryRange: '₹22–34 LPA', matchScore: 79,
    isRemote: false, postedDaysAgo: 3, companySize: 'mid',
    matchedSkills: ['React', 'JavaScript / TypeScript', 'REST APIs', 'Webpack / Vite'],
    gapSkills: ['WebSockets (real-time data)', 'Chart / Visualisation Libraries'],
    whyFit: [
      "Groww's investment platform needs performant, real-time UIs — your React expertise and perf mindset are valued",
      "Fintech frontend has strict reliability requirements; your testing experience is a differentiator",
    ],
  },
  {
    id: 'fe3', jobTitle: 'UI Engineer', company: 'BrowserStack',
    location: 'Mumbai', salaryRange: '₹18–28 LPA', matchScore: 72,
    isRemote: true, postedDaysAgo: 5, companySize: 'mid',
    matchedSkills: ['React', 'JavaScript', 'Testing (Jest / RTL)', 'Accessibility'],
    gapSkills: ['Cross-browser Testing Internals', 'Selenium / Playwright'],
    whyFit: [
      "BrowserStack UI is used by developers globally — your attention to cross-browser compatibility is directly valued",
      "Remote-friendly culture with strong eng culture; your testing background fits their quality bar",
    ],
  },
]

const BACKEND_JOBS: JobMatch[] = [
  {
    id: 'be1', jobTitle: 'Backend Engineer', company: 'Razorpay',
    location: 'Bengaluru', salaryRange: '₹22–35 LPA', matchScore: 83,
    isRemote: false, postedDaysAgo: 1, companySize: 'mid',
    matchedSkills: ['Java / Go / Python', 'REST APIs', 'SQL', 'Microservices', 'System Design'],
    gapSkills: ['Payments Protocol Expertise', 'High-throughput Message Queues'],
    whyFit: [
      "Razorpay's payment processing needs battle-tested backend engineers — your distributed systems experience is the bar",
      "Their API-first culture rewards engineers who think in contracts and schema design, which matches your background",
    ],
  },
  {
    id: 'be2', jobTitle: 'Backend SWE – Infra', company: 'PhonePe',
    location: 'Bengaluru', salaryRange: '₹26–40 LPA', matchScore: 76,
    isRemote: false, postedDaysAgo: 3, companySize: 'large',
    matchedSkills: ['Java', 'gRPC / REST', 'MySQL / Cassandra', 'Kafka', 'System Design'],
    gapSkills: ['UPI / NPCI Protocol Layer', 'High-scale Concurrency Patterns'],
    whyFit: [
      "PhonePe Infra processes 300M+ UPI transactions monthly — your high-scale backend experience is directly relevant",
      "Mature engineering org means well-defined processes and learning from senior engineers",
    ],
  },
  {
    id: 'be3', jobTitle: 'Platform Engineer', company: 'Freshworks',
    location: 'Chennai', salaryRange: '₹18–28 LPA', matchScore: 74,
    isRemote: false, postedDaysAgo: 4, companySize: 'large',
    matchedSkills: ['Ruby on Rails / Node.js', 'PostgreSQL', 'REST APIs', 'Docker / K8s'],
    gapSkills: ['Multi-tenant SaaS Architecture', 'Salesforce / CRM Domain'],
    whyFit: [
      "Freshworks builds B2B SaaS for global customers — your product engineering background translates well",
      "Strong ESOPs program and international exposure make this a financially and professionally rewarding role",
    ],
  },
]

// ─── Role matcher ─────────────────────────────────────────────────────────────

export function getJobMatchesForRole(targetRole: string): JobMatch[] {
  const r = targetRole.toLowerCase()

  if (/data scientist|data science|research scientist/.test(r)) return DS_JOBS
  if (/data analyst|analytics analyst|business intelligence|bi analyst|analytics engineer/.test(r)) return DA_JOBS
  if (/data engineer/.test(r)) return DE_JOBS
  if (/ml engineer|machine learning engineer|mlops|ai engineer/.test(r)) return MLE_JOBS
  if (/business analyst|strategy analyst|operations analyst/.test(r)) return BA_JOBS
  if (/strategy consultant|management consultant|associate consultant/.test(r)) return CONSULTING_JOBS
  if (/frontend|front.?end|react developer|ui engineer/.test(r)) return FRONTEND_JOBS
  if (/backend|back.?end/.test(r)) return BACKEND_JOBS
  if (/software engineer|senior engineer|swe|full.?stack|fullstack/.test(r)) return SWE_JOBS
  if (/product manager|associate product|senior product|group product|apm|gpm/.test(r)) return PM_JOBS

  return PM_JOBS // default fallback
}
