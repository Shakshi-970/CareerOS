export type MCQCategory = string
export type Difficulty = 'easy' | 'medium' | 'hard'
export type OptionKey = 'A' | 'B' | 'C' | 'D'

export interface MCQOption {
  key: OptionKey
  text: string
}

export interface MCQQuestion {
  id: string
  category: MCQCategory
  difficulty: Difficulty
  concept: string
  question: string
  options: MCQOption[]
  correct: OptionKey
  explanation: string
}

export const mcqQuestions: MCQQuestion[] = [
  // ─── BEHAVIORAL ───────────────────────────────────────────────────────────
  {
    id: 'beh_001',
    category: 'behavioral',
    difficulty: 'medium',
    concept: 'Data-Driven Diagnosis',
    question:
      "You own CRED's bill payment completion rate. It drops 12% overnight. What do you do FIRST?",
    options: [
      { key: 'A', text: 'Write a post-mortem and share it with leadership' },
      { key: 'B', text: 'Roll back the last deployment immediately' },
      { key: 'C', text: 'Segment the drop by platform, geography, and user cohort to isolate the cause' },
      { key: 'D', text: 'Call a war room with all stakeholders' },
    ],
    correct: 'C',
    explanation:
      'Diagnostic segmentation before action is the PM first principle. Rolling back without diagnosis can introduce new issues. A post-mortem comes after you understand the cause. War rooms are for confirmed outages, not unexplained drops.',
  },
  {
    id: 'beh_002',
    category: 'behavioral',
    difficulty: 'medium',
    concept: 'Stakeholder Management & Scoping',
    question:
      'Engineering estimates a feature at 8 weeks. Business wants it in 3 weeks. What is the MOST effective PM response?',
    options: [
      { key: 'A', text: 'Tell business it is not possible in 3 weeks' },
      { key: 'B', text: 'Ask engineering to work weekends to meet the deadline' },
      { key: 'C', text: 'Scope to an MVP that delivers core value in 3 weeks; ship the full version in 8' },
      { key: 'D', text: 'Escalate to the CTO to resolve the conflict' },
    ],
    correct: 'C',
    explanation:
      'Scoping is a PM\'s core superpower. An MVP in 3 weeks delivers business value while respecting engineering capacity. Escalating is a last resort, not a first move. Mandating overtime damages morale and quality.',
  },
  {
    id: 'beh_003',
    category: 'behavioral',
    difficulty: 'hard',
    concept: 'Prioritization Frameworks',
    question:
      'As PM at PhonePe you receive requests from: (1) the CEO, (2) top 3 enterprise clients, (3) user research showing 40% of users want the same thing, (4) a competitor just launched it. Which carries the MOST weight?',
    options: [
      { key: 'A', text: 'CEO — they are the final decision maker' },
      { key: 'B', text: 'Enterprise clients — direct revenue impact' },
      { key: 'C', text: 'User research — broadest validated signal of real user need' },
      { key: 'D', text: 'Competitor launch — urgency and market signal' },
    ],
    correct: 'C',
    explanation:
      'User research with 40% signal represents validated demand across your full user base. CEO and client requests may reflect individual preferences, not user needs. Competitor launches signal trends but do not prove your users need the same thing.',
  },
  {
    id: 'beh_004',
    category: 'behavioral',
    difficulty: 'medium',
    concept: 'Metrics & North Star',
    question:
      'After 6 months you realise your success metric (sign-ups) is a vanity metric. The real indicator is "7-day active users." What do you do?',
    options: [
      { key: 'A', text: 'Keep reporting sign-ups since leadership already tracks it' },
      { key: 'B', text: 'Propose changing the metric to leadership with data on its correlation to revenue' },
      { key: 'C', text: 'Track both internally but let leadership continue with sign-ups' },
      { key: 'D', text: 'Quietly change the metric in dashboards to avoid confusion' },
    ],
    correct: 'B',
    explanation:
      'A PM must have the courage to challenge flawed metrics with data. Show leadership how sign-ups correlate (or do not) with revenue and retention. Hiding the issue or making unilateral changes both create trust problems.',
  },
  {
    id: 'beh_005',
    category: 'behavioral',
    difficulty: 'medium',
    concept: 'Risk Management at Launch',
    question:
      'QA found a bug affecting 0.1% of users on a rare device model. Launch is tomorrow. What do you do?',
    options: [
      { key: 'A', text: 'Delay the launch until the bug is fully fixed' },
      { key: 'B', text: 'Launch without fixing — 0.1% is an acceptable error rate' },
      { key: 'C', text: 'Launch with a kill switch for affected devices, ship a hotfix next week' },
      { key: 'D', text: 'Give QA 48 more hours to find a workaround' },
    ],
    correct: 'C',
    explanation:
      'The PM\'s job is to ship value while managing risk. A kill switch isolates the 0.1% edge case while everyone else gets the feature on time. Blanket delay or ship-anyway are both suboptimal responses.',
  },
  {
    id: 'beh_006',
    category: 'behavioral',
    difficulty: 'hard',
    concept: 'Counter-Intuitive Metric Interpretation',
    question:
      'Your North Star DAU grew 20% MoM but revenue dropped 5%. What is the MOST likely explanation?',
    options: [
      { key: 'A', text: 'Your monetization strategy is fundamentally broken' },
      { key: 'B', text: 'You are acquiring new users from a segment with lower LTV or different payment behaviour' },
      { key: 'C', text: 'The product has gone viral among non-paying free users' },
      { key: 'D', text: 'Engineering has introduced a billing bug' },
    ],
    correct: 'B',
    explanation:
      'DAU growth with revenue decline is a classic signal of user-segment shift. New users from a new campaign, geography, or channel may not monetize like your core cohort. Investigate cohort-level revenue, not just aggregate.',
  },
  {
    id: 'beh_007',
    category: 'behavioral',
    difficulty: 'hard',
    concept: 'LTV-Weighted Thinking',
    question:
      "Meesho's reseller community requests a feature used by only 2% of active users. However, those 2% generate 40% of GMV. What is your decision?",
    options: [
      { key: 'A', text: 'Reject — 2% user base is too small to justify the investment' },
      { key: 'B', text: 'Build it — these are power users with disproportionate business impact' },
      { key: 'C', text: 'Survey all users before committing to any decision' },
      { key: 'D', text: 'Build a lighter version to test, then invest if validated' },
    ],
    correct: 'B',
    explanation:
      'Headcount share (2%) is the wrong lens here. LTV-weighted thinking says these are your most valuable users. A PM must understand the business impact of serving different cohorts, not just their size.',
  },
  {
    id: 'beh_008',
    category: 'behavioral',
    difficulty: 'medium',
    concept: 'Bharat Product Design Constraints',
    question:
      'You are building a product for Bharat users (Tier 2/3 India). Which design constraint is MOST foundational?',
    options: [
      { key: 'A', text: 'Dark mode support for viewing comfort' },
      { key: 'B', text: 'Works reliably on 2G/3G networks and low-RAM Android devices (1–2 GB)' },
      { key: 'C', text: 'Support for 10 major Indian languages' },
      { key: 'D', text: 'Full offline-first architecture' },
    ],
    correct: 'B',
    explanation:
      'Network speed and device capability are the most common blockers for Bharat users. Before language support, dark mode, or offline-first, you must ensure the app works on entry-level Android and slow networks — this affects 80%+ of your target audience.',
  },

  // ─── PRODUCT DESIGN ───────────────────────────────────────────────────────
  {
    id: 'pd_001',
    category: 'product_design',
    difficulty: 'medium',
    concept: 'Marketplace Supply-Side Thinking',
    question:
      'Zomato is launching in a new Tier 2 city. Which metric should you prioritise in the FIRST 30 days?',
    options: [
      { key: 'A', text: 'Revenue per order' },
      { key: 'B', text: 'Restaurant partner NPS scores' },
      { key: 'C', text: 'Active restaurant density (partners per square km)' },
      { key: 'D', text: 'App downloads' },
    ],
    correct: 'C',
    explanation:
      'In a marketplace, supply density determines whether demand can be fulfilled. Without enough restaurant coverage, even high demand leads to poor experience and churn. Downloads and revenue follow supply density, not the reverse.',
  },
  {
    id: 'pd_002',
    category: 'product_design',
    difficulty: 'medium',
    concept: 'Social Proof & Conversion',
    question:
      'You are adding a "social proof" element to an e-commerce product page. Which pattern has the HIGHEST proven impact on purchase conversion?',
    options: [
      { key: 'A', text: '"X people are viewing this right now" urgency signal' },
      { key: 'B', text: '"Bestseller in [category]" badge' },
      { key: 'C', text: 'Verified purchase reviews with user photos' },
      { key: 'D', text: '"Limited time offer" countdown timer' },
    ],
    correct: 'C',
    explanation:
      'Verified reviews with photos combine social proof (others like me bought this) with authenticity (real user images). Research consistently shows authentic reviews outperform urgency tactics and badges in long-term conversion — especially as users have become wary of dark patterns.',
  },
  {
    id: 'pd_003',
    category: 'product_design',
    difficulty: 'hard',
    concept: 'Funnel Analysis',
    question:
      "CRED rewards funnel: App Open → Rewards Tab (35%) → View Reward (60%) → Redeem (8%). Where is the BIGGEST improvement opportunity?",
    options: [
      { key: 'A', text: 'Increase overall app opens' },
      { key: 'B', text: 'Get more users to click the Rewards Tab (65% never open it)' },
      { key: 'C', text: 'Increase the View → Redeem rate (92% of viewers do not redeem)' },
      { key: 'D', text: 'Add more reward categories to the catalogue' },
    ],
    correct: 'C',
    explanation:
      'The View → Redeem step has the steepest percentage drop-off (92%). Users are seeing rewards and not redeeming, signalling a UX or perceived-value problem at the final decision point. Fixing the deepest percentage drop has the highest leverage on end-to-end conversion.',
  },
  {
    id: 'pd_004',
    category: 'product_design',
    difficulty: 'hard',
    concept: 'Sustainable Growth Loops',
    question:
      'When designing for viral growth (K-factor > 1), which mechanism is MOST sustainable long-term?',
    options: [
      { key: 'A', text: 'Cash incentive referrals (₹100 for every friend referred)' },
      { key: 'B', text: 'Invite-to-unlock (premium feature gated behind inviting 3 friends)' },
      { key: 'C', text: 'Inherent network effects (product becomes more valuable as more people use it)' },
      { key: 'D', text: 'Aggressive push notification re-engagement campaigns' },
    ],
    correct: 'C',
    explanation:
      'Network effect virality is defensible — it is baked into the product\'s value proposition and grows without ongoing spend. Incentive referrals stop working when budget runs out and attract low-LTV users. Invite-to-unlock creates resentment and faces regulatory scrutiny.',
  },
  {
    id: 'pd_005',
    category: 'product_design',
    difficulty: 'hard',
    concept: 'First-Session Personalisation',
    question:
      'Users who place their FIRST food order via "Recommended for You" have 40% higher 30-day retention than search users. What is the PRIMARY strategic insight?',
    options: [
      { key: 'A', text: 'The recommendation algorithm is technically superior to search' },
      { key: 'B', text: 'Discovery-mode users have higher purchase intent than search users' },
      { key: 'C', text: 'Personalised first-session experience is a strong predictor of long-term retention' },
      { key: 'D', text: 'The search UX needs urgent redesign' },
    ],
    correct: 'C',
    explanation:
      'First-session personalisation as a retention driver is documented at Netflix, Spotify, and DoorDash. Users who get a "made for you" experience in session one are significantly more likely to stay. The correct action is investing in first-session personalisation, not just fixing search.',
  },
  {
    id: 'pd_006',
    category: 'product_design',
    difficulty: 'hard',
    concept: 'Generative AI Risk Management',
    question:
      'You use Generative AI to auto-write product descriptions. 3% of outputs contain factual errors. What is the correct PM decision?',
    options: [
      { key: 'A', text: 'Disable the feature — a 3% error rate is unacceptable' },
      { key: 'B', text: 'Launch with human review for high-GMV items; AI for the long-tail' },
      { key: 'C', text: 'Keep retraining the model until the error rate reaches 0%' },
      { key: 'D', text: 'Launch everywhere with a disclaimer: "AI-generated, may contain errors"' },
    ],
    correct: 'B',
    explanation:
      'Risk-tiered deployment is standard for generative AI. Errors on high-GMV items cause significant brand and trust damage. Auto-generating descriptions for millions of low-value long-tail products is safe and high-ROI. A blanket disclaimer does not protect your reputation on high-stakes items.',
  },
  {
    id: 'pd_007',
    category: 'product_design',
    difficulty: 'medium',
    concept: 'Gamification & Retention Mechanics',
    question:
      "Duolingo's daily streak drives 50% of DAU, but research shows streak anxiety causes 20% of users to quit. What is the BEST PM response?",
    options: [
      { key: 'A', text: 'Remove the streak entirely — it is causing more harm than good' },
      { key: 'B', text: 'Change streaks to a weekly cadence to reduce daily pressure' },
      { key: 'C', text: 'Introduce a "streak freeze" (1–2 missed days do not break the streak)' },
      { key: 'D', text: 'Send more push notifications to prevent users from missing days' },
    ],
    correct: 'C',
    explanation:
      'Streak Freeze is a real Duolingo feature. It preserves the gamification value (the streak habit) while removing the cliff-edge anxiety. Removing streaks would sacrifice 50% of DAU. More notifications increase opt-outs. Weekly streaks reduce habit frequency.',
  },
  {
    id: 'pd_008',
    category: 'product_design',
    difficulty: 'medium',
    concept: 'B2B Dashboard Information Architecture',
    question:
      "You are designing Razorpay's home dashboard for SME merchants. Which content hierarchy is MOST important?",
    options: [
      { key: 'A', text: 'Latest product announcements and new features' },
      { key: 'B', text: "Today's revenue, pending settlements, and failed transactions" },
      { key: 'C', text: 'Account settings and API documentation quick links' },
      { key: 'D', text: '6-month historical revenue trend charts' },
    ],
    correct: 'B',
    explanation:
      'SME merchants\' primary anxiety is "where is my money?" Real-time revenue and settlement status are the job-to-be-done when they open the dashboard. Historical charts, settings, and announcements are all secondary use cases.',
  },
  {
    id: 'pd_009',
    category: 'product_design',
    difficulty: 'hard',
    concept: 'Correlation vs. Causation in Product Data',
    question:
      'Users who enable biometric login have 65% higher 90-day retention than password users. What is the MOST accurate interpretation?',
    options: [
      { key: 'A', text: 'Biometric login causally improves retention and should be pushed to all users' },
      { key: 'B', text: 'More engaged, committed users are more likely to enable biometrics (selection bias)' },
      { key: 'C', text: 'Password friction is the primary driver of churn in the app' },
      { key: 'D', text: 'Biometric login should be made mandatory to drive retention' },
    ],
    correct: 'B',
    explanation:
      'Classic correlation vs. causation trap. Users who invest time in enabling biometric login are already more committed to the app. Making it mandatory or attributing causality to biometrics is wrong — the underlying variable is user engagement level.',
  },
  {
    id: 'pd_010',
    category: 'product_design',
    difficulty: 'medium',
    concept: 'Offline-First Design for Bharat',
    question:
      'You are designing PhonePe UPI Lite for users in low-connectivity zones. What is the SINGLE most important design decision?',
    options: [
      { key: 'A', text: 'Beautiful micro-animations to delight users on first use' },
      { key: 'B', text: 'Offline-capable transaction storage that syncs when connected' },
      { key: 'C', text: 'Reducing the payment flow from 5 steps to 3' },
      { key: 'D', text: 'Adding a voice-based chatbot for regional language support' },
    ],
    correct: 'B',
    explanation:
      'In low/no-connectivity environments, the ability to initiate and store transactions offline — synced when reconnected — is the foundational design requirement. This is exactly why UPI Lite uses an on-device wallet. Step reduction is a nice-to-have; offline-first is essential.',
  },

  // ─── ESTIMATION ───────────────────────────────────────────────────────────
  {
    id: 'est_001',
    category: 'estimation',
    difficulty: 'medium',
    concept: 'Top-Down Market Estimation',
    question:
      'Estimate Swiggy Instamart DAU in Mumbai. Which estimation approach is MOST structured?',
    options: [
      { key: 'A', text: 'Mumbai population × 10% app users × 2% daily order rate' },
      { key: 'B', text: 'Mumbai smartphone users × Swiggy MAU rate × daily order frequency' },
      { key: 'C', text: 'Mumbai urban adults (≈10M) → smartphone (75%) → food delivery (30%) → Instamart-specific (20%) → daily active (15%)' },
      { key: 'D', text: 'Total Swiggy India orders ÷ number of active cities ÷ days per month' },
    ],
    correct: 'C',
    explanation:
      'Option C is top-down with progressive qualifying filters at each step — the standard PM estimation framework. Each filter is defensible and discussable. Option D uses national aggregates to estimate a city metric, conflating city size and usage patterns.',
  },
  {
    id: 'est_002',
    category: 'estimation',
    difficulty: 'medium',
    concept: 'Anchoring with Published Data',
    question:
      'You need to estimate daily UPI transaction volume in India. The BEST starting anchor is:',
    options: [
      { key: 'A', text: "India's active internet users × estimated payment frequency per user" },
      { key: 'B', text: 'NPCI publicly reports ~14–16 billion monthly transactions (2024) — divide by 30' },
      { key: 'C', text: "Razorpay + PhonePe disclosed counts × estimated combined market share" },
      { key: 'D', text: 'Number of bank account holders × digital payment adoption rate' },
    ],
    correct: 'B',
    explanation:
      'NPCI publishes monthly UPI statistics — using disclosed public data is always stronger than re-deriving from proxies. In PM interviews, anchoring on verified industry data demonstrates research instincts. 14B ÷ 30 ≈ 467M transactions/day.',
  },
  {
    id: 'est_003',
    category: 'estimation',
    difficulty: 'medium',
    concept: 'Ratio-Based Headcount Estimation',
    question:
      'Estimate the number of Product Managers at Indian tech unicorns. Which approach is MOST defensible?',
    options: [
      { key: 'A', text: "India's employed population × % in tech × % who are PMs" },
      { key: 'B', text: 'Number of Indian unicorns (~100) × avg engineering headcount × PM:Engineer ratio (1:8 to 1:10)' },
      { key: 'C', text: 'LinkedIn search count for "Product Manager India"' },
      { key: 'D', text: 'NASSCOM industry employment report for tech roles' },
    ],
    correct: 'B',
    explanation:
      'Bottom-up from known ratios is the most structured approach. A PM:Engineer ratio of 1:8 to 1:10 is an industry benchmark. LinkedIn counts are biased toward active profiles. NASSCOM aggregates all tech roles without PM specificity.',
  },
  {
    id: 'est_004',
    category: 'estimation',
    difficulty: 'hard',
    concept: 'Non-Uniform Distribution Thinking',
    question:
      'Estimate the share of total daily food delivery orders placed in India between 10 PM and midnight. The key PM insight is:',
    options: [
      { key: 'A', text: '2 hours out of 24 = approximately 8.3% of daily orders' },
      { key: 'B', text: 'Orders are NOT uniform — late-night (10 PM–midnight) accounts for roughly 3–6% of daily volume' },
      { key: 'C', text: 'Late-night orders have higher basket value so revenue share exceeds order share' },
      { key: 'D', text: 'It depends entirely on the city and cannot be generalised' },
    ],
    correct: 'B',
    explanation:
      'Orders cluster heavily around lunch (12–2 PM) and dinner (7–9 PM). The 10 PM–midnight window is a low-traffic slot with ~3–6% of daily orders, not 8.3%. Assuming uniform distribution is a common estimation mistake that interviewers test for.',
  },
  {
    id: 'est_005',
    category: 'estimation',
    difficulty: 'hard',
    concept: 'B2B SaaS TAM with Government Data',
    question:
      'Sizing the market for an HR SaaS targeting Indian companies with 50–500 employees. The MOST accurate first step is:',
    options: [
      { key: 'A', text: 'India GDP × typical enterprise software spend percentage' },
      { key: 'B', text: 'Total registered companies in India × an estimated conversion rate' },
      { key: 'C', text: 'India has ~63 million MSMEs (formal + informal); filter to the 50–500 employee band (~2% ≈ 1.26M companies)' },
      { key: 'D', text: 'Benchmark US HR SaaS penetration and apply an India discount factor' },
    ],
    correct: 'C',
    explanation:
      'Starting from actual MSME census data and applying a size filter gives the most defensible TAM. GDP-based approaches are too indirect. US benchmarks ignore India\'s market structure and price sensitivity. "Total companies" without size filtering massively overstates the addressable market.',
  },
  {
    id: 'est_006',
    category: 'estimation',
    difficulty: 'hard',
    concept: 'Addressable Market Segmentation',
    question:
      'Sizing the TAM for a premium mental health app in India (₹500/month). The correct estimation sequence is:',
    options: [
      { key: 'A', text: "Global mental health market × India's share of world GDP" },
      { key: 'B', text: 'India population → urban middle class (~15%) → mental health awareness → willingness to pay ₹500/month' },
      { key: 'C', text: 'Number of licensed therapists × avg patients per therapist × digital conversion' },
      { key: 'D', text: 'Prevalence of anxiety/depression × treatment-seeking rate × price point' },
    ],
    correct: 'B',
    explanation:
      'Top-down with progressive qualification is the standard TAM approach. Urban middle class is the realistic addressable segment — both awareness and income to pay ₹500/month. Supply-side estimation (C) gives capacity, not demand. Prevalence data (D) ignores willingness-to-pay segmentation.',
  },
  {
    id: 'est_007',
    category: 'estimation',
    difficulty: 'hard',
    concept: 'Bottom-Up GMV Estimation',
    question:
      "Estimating Zepto's monthly GMV. Which sequence is most defensible?",
    options: [
      { key: 'A', text: "Zepto's last funding valuation × typical GMV-to-valuation multiple" },
      { key: 'B', text: 'Zepto cities × avg households per city × order frequency × average basket size' },
      { key: 'C', text: "Competitor Blinkit's disclosed GMV × estimated Zepto market share" },
      { key: 'D', text: 'Total quick commerce market size × Zepto app download share' },
    ],
    correct: 'B',
    explanation:
      'Bottom-up demand estimation (cities × users × frequency × basket) is the most transparent and defensible approach. Valuation multiples are unreliable for private companies. Competitor benchmarks require estimating market share (circular). Download share is a weak proxy for GMV.',
  },
  {
    id: 'est_008',
    category: 'estimation',
    difficulty: 'medium',
    concept: 'Transactions to Users Conversion',
    question:
      'You use NPCI\'s ~14 billion monthly UPI transactions to estimate UPI DAU. What is the critical ADDITIONAL assumption needed?',
    options: [
      { key: 'A', text: 'UPI transaction success rate (attempted vs. completed)' },
      { key: 'B', text: 'Average number of UPI transactions per active user per day' },
      { key: 'C', text: 'Urban vs. rural split of UPI usage' },
      { key: 'D', text: 'Split between P2P and P2M (person-to-merchant) transactions' },
    ],
    correct: 'B',
    explanation:
      'To convert transaction volume to DAU you need per-user frequency. If the average UPI user makes 2–3 transactions/day, then 467M daily transactions ÷ 2.5 ≈ 187M DAU. Without this assumption you cannot convert volume to user count.',
  },

  // ─── STRATEGY ─────────────────────────────────────────────────────────────
  {
    id: 'str_001',
    category: 'strategy',
    difficulty: 'hard',
    concept: 'Competitive Positioning & Niche Strategy',
    question:
      "Spotify enters India facing JioSaavn (free, deep Jio integration) and Gaana (free, Hindi-first). Spotify's BEST Phase 1 strategy is:",
    options: [
      { key: 'A', text: 'Price-match competitors and go free for the first year' },
      { key: 'B', text: 'Focus on underserved premium listeners willing to pay for global catalog and superior UX' },
      { key: 'C', text: 'Negotiate a distribution partnership with Jio for built-in reach' },
      { key: 'D', text: 'Acquire Gaana to consolidate the Hindi music market' },
    ],
    correct: 'B',
    explanation:
      'A price war with JioSaavn — backed by Reliance\'s balance sheet — is unwinnable. Differentiated positioning in the premium segment targets users the free competitors cannot serve well. This is textbook Blue Ocean strategy: compete on a different dimension rather than head-to-head.',
  },
  {
    id: 'str_002',
    category: 'strategy',
    difficulty: 'hard',
    concept: 'Regulatory Strategy in India Fintech',
    question:
      'WhatsApp Pay had 500M+ Indian users yet struggled to grow UPI share for years. The PRIMARY constraint was:',
    options: [
      { key: 'A', text: 'Inferior payment UX compared to PhonePe and Google Pay' },
      { key: 'B', text: 'NPCI imposed a phased user onboarding cap on WhatsApp Pay (enforced through 2024)' },
      { key: 'C', text: 'Indian users distrust Meta/Facebook with financial data' },
      { key: 'D', text: 'PhonePe and Google Pay had more compelling cashback programmes' },
    ],
    correct: 'B',
    explanation:
      'NPCI imposed a user cap on WhatsApp Pay — starting at 20 million users — to prevent UPI dominance by a single player. The cap was only fully removed in December 2024. This regulatory constraint, not UX or trust, was the key bottleneck. Critical India fintech regulatory knowledge for PM interviews.',
  },
  {
    id: 'str_003',
    category: 'strategy',
    difficulty: 'hard',
    concept: 'Super App Anchor Strategy',
    question:
      'A startup is building a super app for Tier 2/3 India. Which product should be built FIRST to establish daily habit and financial trust?',
    options: [
      { key: 'A', text: 'Short video content (proven engagement in Tier 2/3)' },
      { key: 'B', text: 'Payments / UPI wallet as the core entry point' },
      { key: 'C', text: 'Vernacular news feed for daily active engagement' },
      { key: 'D', text: 'Hyperlocal job listings for economic value' },
    ],
    correct: 'B',
    explanation:
      'Payments create multiple daily touch-points and establish financial trust — both are prerequisites for a super app flywheel. WeChat built everything on top of WeChat Pay. Video drives engagement but does not create a financial relationship. News and jobs are low-frequency use cases.',
  },
  {
    id: 'str_004',
    category: 'strategy',
    difficulty: 'medium',
    concept: "Innovator's Dilemma",
    question:
      'Which Indian company scenario BEST illustrates the "Innovator\'s Dilemma" — incumbents unable to respond to a disruptive new entrant?',
    options: [
      { key: 'A', text: "Jio entering telecom with near-zero data prices, forcing Airtel and Vodafone into an impossible dilemma" },
      { key: 'B', text: 'Swiggy launching Instamart as a new business unit within an existing company' },
      { key: 'C', text: 'Amazon investing in AWS infrastructure to power future growth' },
      { key: 'D', text: 'PhonePe expanding from payments into insurance and lending' },
    ],
    correct: 'A',
    explanation:
      'Jio is the canonical Indian innovator\'s dilemma case. Airtel and Vodafone were trapped — they could not price data at near-zero without destroying their own revenue base. Jio had no installed base to protect. The other options describe diversification or internal expansion, not external disruption.',
  },
  {
    id: 'str_005',
    category: 'strategy',
    difficulty: 'medium',
    concept: 'Competitive Loyalty Response',
    question:
      "Amazon Prime creates a powerful loyalty flywheel in India. Flipkart's DIRECT competitive response was:",
    options: [
      { key: 'A', text: 'Launching Flipkart Quick (90-minute delivery) for convenience parity' },
      { key: 'B', text: 'Acquiring Myntra and Jabong to dominate the fashion category' },
      { key: 'C', text: 'Flipkart Plus loyalty programme (coin-based rewards, free and opt-in)' },
      { key: 'D', text: 'The Walmart acquisition providing global supply chain leverage' },
    ],
    correct: 'C',
    explanation:
      'Flipkart Plus (launched August 2018) was explicitly designed as Flipkart\'s answer to Amazon Prime. Key strategic differentiator: Flipkart Plus is free (earned via purchase coins) vs. Prime\'s paid subscription — a deliberate choice for India\'s price-sensitive consumer base.',
  },
  {
    id: 'str_006',
    category: 'strategy',
    difficulty: 'hard',
    concept: 'Go-to-Market: Depth vs. Breadth',
    question:
      'A health-tech startup chooses Phase 1: (A) Deep in ONE city with full-stack care (diagnostics + treatment + delivery), or (B) Wide across 10 cities with diagnostics only. Which is better?',
    options: [
      { key: 'A', text: 'Wide — more cities = more data and faster learning velocity' },
      { key: 'B', text: 'Deep — unit economics clarity, category leadership, and word-of-mouth in one market' },
      { key: 'C', text: 'Wide — first-mover advantage before competitors enter all 10 cities' },
      { key: 'D', text: 'Wide — investors prefer a scale narrative over operational depth' },
    ],
    correct: 'B',
    explanation:
      '"Do things that don\'t scale" (Paul Graham). Dominating one city with a full-stack product gives you proof of unit economics, referral density, and operational learnings you can replicate. Going wide with a half-product spreads resources thin and lets deep-focused competitors outcompete you in every city.',
  },
  {
    id: 'str_007',
    category: 'strategy',
    difficulty: 'medium',
    concept: 'Build on Infrastructure vs. Build from Scratch',
    question:
      'Google launched Google Pay in India as a UPI-only app with no digital wallet. This was strategically SMART primarily because:',
    options: [
      { key: 'A', text: 'Wallets require an RBI Prepaid Payment Instrument licence and heavy compliance overhead' },
      { key: 'B', text: 'Indian users had already rejected wallets following Paytm UX backlash' },
      { key: 'C', text: 'UPI is zero-cost whereas wallets charge merchants MDR fees' },
      { key: 'D', text: 'Building on UPI rails gave Google speed-to-market and instant bank interoperability without building settlement infrastructure' },
    ],
    correct: 'D',
    explanation:
      'UPI as infrastructure gave Google speed-to-market, zero settlement infrastructure build, and instant interoperability with all Indian banks. While the regulatory benefit (A) is real, the primary strategic insight is leveraging existing national infrastructure — the same principle Stripe applied to card rails.',
  },
  {
    id: 'str_008',
    category: 'strategy',
    difficulty: 'hard',
    concept: 'Product-Led Growth (PLG)',
    question:
      'An Indian edtech startup post-2022 wants to improve free-to-paid conversion. Based on PLG research, which strategy has the HIGHEST expected impact?',
    options: [
      { key: 'A', text: 'Aggressive WhatsApp and email retargeting campaigns targeting free users' },
      { key: 'B', text: 'Feature gating: free users can see premium features but cannot access them (creates pull)' },
      { key: 'C', text: 'Time-limited 50% discount offers to create urgency' },
      { key: 'D', text: 'Social proof leaderboards showing peer achievement and certifications' },
    ],
    correct: 'B',
    explanation:
      'Feature gating — where free users can see the value of premium features but are blocked from using them — is the highest-converting PLG mechanism (proven by Notion, Canva, Loom, Linear). It converts through demonstrated value and pull. Discounts condition users to wait for sales and erode long-term pricing power.',
  },
]
