export type IconKey =
  | 'users' | 'brain' | 'calculator' | 'trending'
  | 'database' | 'code' | 'layers' | 'settings'
  | 'chart' | 'search' | 'file' | 'zap'

export interface InterviewCategory {
  key: string
  label: string
  /** Sent to AI to anchor question generation for this category */
  promptDescription: string
  questionCount: number
  color: string
  ring: string
  activeBg: string
  iconKey: IconKey
}

// ─── Category pools ──────────────────────────────────────────────────────────

const BEHAVIORAL: InterviewCategory = {
  key: 'behavioral', label: 'Behavioral',
  promptDescription: 'Leadership, teamwork, conflict resolution, STAR-format situational questions, stakeholder management',
  questionCount: 2,
  color: 'text-slate-700', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-indigo-600', iconKey: 'users',
}

// ─── Product Management ───────────────────────────────────────────────────────
const PM_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'product_design', label: 'Product Design', promptDescription: 'Feature design, user journeys, north-star metrics, PRD thinking, product sense', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'brain' },
  { key: 'estimation', label: 'Estimation', promptDescription: 'Market sizing, back-of-envelope calculations, Fermi problems, DAU/MAU, revenue estimation', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'calculator' },
  { key: 'strategy', label: 'Strategy', promptDescription: 'GTM strategy, competitive analysis, OKRs, business model thinking, growth levers', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'trending' },
]

// ─── Data Scientist ───────────────────────────────────────────────────────────
const DS_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'machine_learning', label: 'ML & Algorithms', promptDescription: 'ML algorithms (tree-based, neural nets, clustering), model selection, bias/variance tradeoff, regularisation, feature engineering', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'brain' },
  { key: 'statistics', label: 'Statistics & Probability', promptDescription: 'Probability distributions, hypothesis testing, A/B testing, p-values, confidence intervals, Bayesian vs frequentist', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'calculator' },
  { key: 'sql_data', label: 'SQL & Analytics', promptDescription: 'SQL queries (window functions, CTEs, aggregations), pandas, data cleaning, exploratory data analysis', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'database' },
]

// ─── Data Analyst / BI Analyst ─────────────────────────────────────────────
const DA_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'sql_analytics', label: 'SQL & Analytics', promptDescription: 'Complex SQL (CTEs, window functions, joins), data extraction, aggregations, data wrangling', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'database' },
  { key: 'business_intelligence', label: 'Business Intelligence', promptDescription: 'KPI definition, dashboards (Tableau/Power BI/Looker), metrics trees, data storytelling, business insight derivation', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'chart' },
  { key: 'case_study', label: 'Analytical Case Study', promptDescription: 'Business problem-solving with data, root-cause analysis, A/B test interpretation, metric movement diagnosis', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'trending' },
]

// ─── Data Engineer ────────────────────────────────────────────────────────────
const DE_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'data_pipelines', label: 'Data Pipelines & ETL', promptDescription: 'ETL/ELT design, Apache Spark, Airflow/dbt, streaming (Kafka), batch processing, data quality, orchestration', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'layers' },
  { key: 'cloud_infra', label: 'Cloud & Infrastructure', promptDescription: 'Cloud platforms (AWS/GCP/Azure), data lakes, lakehouses (Delta/Iceberg), object storage, cost optimisation, serverless', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'settings' },
  { key: 'database_design', label: 'Database Design', promptDescription: 'Schema design (star/snowflake), OLAP vs OLTP, indexing, partitioning, SQL optimisation, NoSQL trade-offs', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'database' },
]

// ─── ML Engineer ─────────────────────────────────────────────────────────────
const MLE_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'ml_theory', label: 'ML Theory', promptDescription: 'ML algorithms, deep learning (CNNs/Transformers/RNNs), optimisation, loss functions, model evaluation, LLM fundamentals', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'brain' },
  { key: 'mlops', label: 'MLOps & Deployment', promptDescription: 'Model serving, CI/CD for ML, feature stores, model monitoring, drift detection, containerisation (Docker/K8s), A/B model testing', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'settings' },
  { key: 'system_design_ml', label: 'ML System Design', promptDescription: 'Scalable ML system architecture, recommendation systems, ranking systems, real-time inference, training pipelines at scale', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'layers' },
]

// ─── AI Engineer ─────────────────────────────────────────────────────────────
const AI_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'llm_genai', label: 'LLMs & GenAI', promptDescription: 'Prompt engineering, RAG architecture, fine-tuning vs RLHF, hallucination mitigation, LLM evaluation, vector databases, Langchain/LlamaIndex', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'brain' },
  { key: 'ml_application', label: 'Applied ML', promptDescription: 'Production ML, model serving APIs, latency/throughput trade-offs, embedding models, multimodal AI, agentic AI systems', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'zap' },
  { key: 'ai_system_design', label: 'AI System Design', promptDescription: 'Building scalable AI applications, architecture patterns for GenAI products, safety, cost optimisation, infrastructure for AI', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'layers' },
]

// ─── Software Engineer ────────────────────────────────────────────────────────
const SWE_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'dsa', label: 'Data Structures & Algo', promptDescription: 'Arrays, trees, graphs, dynamic programming, sorting, searching, time/space complexity, LeetCode-style problem solving', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'code' },
  { key: 'system_design', label: 'System Design', promptDescription: 'Scalable architecture, distributed systems, CAP theorem, databases, caching (Redis), message queues, API design', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'layers' },
  { key: 'coding', label: 'Coding & Debugging', promptDescription: 'OOP principles, design patterns (SOLID), debugging approaches, code review, testing strategies, clean code', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'zap' },
]

// ─── Full Stack / Frontend / Backend ─────────────────────────────────────────
const FULLSTACK_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'frontend', label: 'Frontend & UI', promptDescription: 'React/Vue/Angular, TypeScript, HTML/CSS, browser rendering, performance optimisation, accessibility, state management', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'code' },
  { key: 'backend', label: 'Backend & APIs', promptDescription: 'REST/GraphQL API design, Node.js/Python/Java, authentication/authorisation, microservices, message queues, error handling', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'layers' },
  { key: 'system_design', label: 'System Design', promptDescription: 'Scalable web architecture, databases (SQL vs NoSQL), caching, CDN, load balancing, API gateways, cloud deployment', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'settings' },
]

const FRONTEND_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'js_ts', label: 'JavaScript & TypeScript', promptDescription: 'JS fundamentals (closures, prototypes, async/await, event loop), TypeScript types, ES6+ features, module systems', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'code' },
  { key: 'react_frameworks', label: 'React & Frameworks', promptDescription: 'React hooks, state management (Redux/Zustand), component patterns, SSR (Next.js), performance (memo, lazy loading)', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'brain' },
  { key: 'web_performance', label: 'Performance & Web', promptDescription: 'Core Web Vitals, bundle optimisation, caching, accessibility (WCAG), CSS layout (flexbox/grid), browser APIs', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'zap' },
]

const BACKEND_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'api_arch', label: 'APIs & Architecture', promptDescription: 'REST vs GraphQL, microservices, event-driven architecture, API versioning, rate limiting, contract testing', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'layers' },
  { key: 'databases', label: 'Databases & Storage', promptDescription: 'SQL vs NoSQL, indexing strategies, ACID transactions, replication, sharding, query optimisation, caching patterns', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'database' },
  { key: 'system_design', label: 'System Design', promptDescription: 'Distributed systems, CAP theorem, consistency models, fault tolerance, load balancing, message queues, scalability patterns', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'settings' },
]

// ─── DevOps / SRE / Cloud ─────────────────────────────────────────────────────
const DEVOPS_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'cicd', label: 'CI/CD & Automation', promptDescription: 'CI/CD pipelines (GitHub Actions/Jenkins), GitOps, containerisation (Docker), Kubernetes, infrastructure as code (Terraform)', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'settings' },
  { key: 'cloud', label: 'Cloud Platforms', promptDescription: 'AWS/GCP/Azure core services, cloud networking, IAM, serverless (Lambda/Cloud Functions), cost optimisation, multi-cloud', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'layers' },
  { key: 'reliability', label: 'Reliability & Monitoring', promptDescription: 'SLOs/SLAs/SLIs, observability (logs/metrics/traces), incident management, capacity planning, chaos engineering, on-call', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'zap' },
]

// ─── Business Analyst / Strategy ─────────────────────────────────────────────
const BA_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'requirements', label: 'Requirements & Analysis', promptDescription: 'BRD/FRD, user stories, use cases, stakeholder interviews, gap analysis, business process mapping (BPMN)', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'file' },
  { key: 'process', label: 'Process & Improvement', promptDescription: 'Process mapping, Lean/Six Sigma, change management, as-is vs to-be analysis, workflow optimisation, KPI design', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'layers' },
  { key: 'case_study', label: 'Business Case Study', promptDescription: 'Structured problem solving, MECE frameworks, root-cause analysis, recommendation framing, business impact estimation', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'trending' },
]

const CONSULTING_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'case_study', label: 'Case Study', promptDescription: 'Business cases (profitability, market entry, M&A), structured frameworks (Porter, MECE), hypothesis-driven analysis, synthesis', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'brain' },
  { key: 'market_analysis', label: 'Market Analysis', promptDescription: 'Market sizing, competitive landscape, industry analysis, trend identification, customer segmentation', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'chart' },
  { key: 'strategy', label: 'Strategy & Recommendations', promptDescription: 'Strategic options evaluation, trade-off analysis, implementation roadmaps, stakeholder alignment, executive communication', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'trending' },
]

const GROWTH_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'growth_analytics', label: 'Growth & Metrics', promptDescription: 'Funnel analysis, cohort analysis, activation/retention/monetisation metrics, north-star metrics, AARRR framework', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'chart' },
  { key: 'experimentation', label: 'Experimentation', promptDescription: 'A/B testing design, statistical significance, sample size, multivariate testing, feature rollout, experiment lifecycle', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'zap' },
  { key: 'gtm', label: 'Go-To-Market & Product', promptDescription: 'GTM strategy, channel selection, user acquisition, product-led growth (PLG), viral loops, growth levers, pricing strategy', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'trending' },
]

// ─── Finance ──────────────────────────────────────────────────────────────────
const FA_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'financial_modeling', label: 'Financial Modelling', promptDescription: 'DCF, LBO, three-statement models, sensitivity analysis, scenario modelling, Excel/Python for finance', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'calculator' },
  { key: 'valuation', label: 'Valuation', promptDescription: 'Company valuation (EV/EBITDA, P/E, EV/Revenue), precedent transactions, comparable companies, sum-of-parts', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'chart' },
  { key: 'case_study', label: 'Finance Case Study', promptDescription: 'Investment thesis, buy/sell recommendations, credit analysis, risk assessment, market awareness', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'trending' },
]

// ─── UX / Design ─────────────────────────────────────────────────────────────
const UX_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'design_thinking', label: 'Design Thinking', promptDescription: 'Design process (empathise/define/ideate/prototype/test), design critique, heuristic evaluation, usability principles', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'brain' },
  { key: 'user_research', label: 'User Research', promptDescription: 'Qualitative vs quantitative research, user interviews, usability testing, surveys, affinity mapping, persona creation', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'search' },
  { key: 'interaction_design', label: 'Interaction & Visual Design', promptDescription: 'Information architecture, user flows, wireframing, prototyping (Figma), design systems, accessibility, motion design', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'zap' },
]

// ─── Generic fallback ─────────────────────────────────────────────────────────
const GENERIC_CATS: InterviewCategory[] = [
  BEHAVIORAL,
  { key: 'technical', label: 'Technical Skills', promptDescription: 'Core technical skills and knowledge required for this role', questionCount: 2, color: 'text-indigo-600', ring: 'border-indigo-200 bg-indigo-50', activeBg: 'bg-indigo-600', iconKey: 'brain' },
  { key: 'case_study', label: 'Case Study', promptDescription: 'Problem-solving, analytical thinking, structured approach to business challenges', questionCount: 2, color: 'text-slate-600', ring: 'border-slate-200 bg-slate-50', activeBg: 'bg-slate-700', iconKey: 'chart' },
  { key: 'strategy', label: 'Strategy & Thinking', promptDescription: 'Strategic thinking, market awareness, long-term planning, prioritisation', questionCount: 2, color: 'text-indigo-700', ring: 'border-indigo-100 bg-indigo-50', activeBg: 'bg-indigo-700', iconKey: 'trending' },
]

// ─── Role → Category mapping ──────────────────────────────────────────────────
export function getCategoriesForRole(role: string): InterviewCategory[] {
  const r = role.toLowerCase()

  // Product roles
  if (/product manager|associate product|senior product|group product|technical product|apm|gpm|tpm/.test(r)) return PM_CATS
  if (/product analyst/.test(r)) return GROWTH_CATS
  if (/product designer|ui.?ux|ux designer|interaction designer/.test(r)) return UX_CATS
  if (/ux researcher|user researcher/.test(r)) return UX_CATS

  // Data & AI roles
  if (/data scientist|data science|research scientist/.test(r)) return DS_CATS
  if (/data analyst|analytics analyst|business intelligence|bi analyst/.test(r)) return DA_CATS
  if (/analytics engineer/.test(r)) return DA_CATS
  if (/data engineer/.test(r)) return DE_CATS
  if (/ml engineer|machine learning engineer|mlops/.test(r)) return MLE_CATS
  if (/ai engineer|llm engineer/.test(r)) return AI_CATS

  // Software Engineering
  if (/full.?stack|fullstack/.test(r)) return FULLSTACK_CATS
  if (/frontend|front.?end|react developer|vue developer|angular developer/.test(r)) return FRONTEND_CATS
  if (/backend|back.?end|node developer|python developer/.test(r)) return BACKEND_CATS
  if (/software engineer|swe|senior engineer|java developer|python engineer/.test(r)) return SWE_CATS
  if (/ios developer|android developer|mobile developer|flutter developer/.test(r)) return SWE_CATS
  if (/qa|quality assurance|test engineer/.test(r)) return SWE_CATS

  // DevOps / Cloud
  if (/devops|site reliability|sre|cloud engineer|cloud architect|platform engineer/.test(r)) return DEVOPS_CATS

  // Business & Strategy
  if (/business analyst/.test(r)) return BA_CATS
  if (/strategy consultant|management consultant|consulting/.test(r)) return CONSULTING_CATS
  if (/growth manager|growth hacker|performance marketing/.test(r)) return GROWTH_CATS
  if (/business development|bd manager|sales/.test(r)) return CONSULTING_CATS

  // Finance
  if (/financial analyst|investment bank|equity research|credit analyst|finance manager/.test(r)) return FA_CATS

  // Default
  return GENERIC_CATS
}
