import type { UserProfile, JobItem } from '../types/job';
import { assembleSignature } from '../services/emailAssembler';

export interface FoundationalDraft {
  id: string;
  title: string;
  category: 'Top Product / High-Comp (MAANG & Global)' | 'Tier-1 FinTech & Unicorns (India)' | 'SDE / Full Stack' | 'Cloud & DevOps' | 'Specialized & Networking';
  description: string;
  defaultSubject: string;
  bodyTemplate: string;
  companyTarget?: string;
  ctcBand?: string;
}

export const FOUNDATIONAL_DRAFTS: FoundationalDraft[] = [
  // ==========================================
  // TOP PRODUCT / HIGH-COMP (MAANG & GLOBAL TIER-1)
  // ==========================================
  {
    id: 'top-uber',
    title: 'Uber – Real-Time Marketplace & Low-Latency Dispatch',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Uber',
    ctcBand: '~₹95 LPA',
    description: 'Calibrated for real-time dispatch state machines, geo-distributed low latency (H3 indexing), and high-throughput microservices.',
    defaultSubject: 'Software Engineer Application – Real-Time Systems & Dispatch – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I have followed Uber's engineering architecture closely—particularly how your teams manage millions of concurrent trip state transitions with strict p99 latency SLAs. I am writing to express my strong enthusiasm for the {role} position.

With {yoe} of production experience specializing in {strengths}, I focus on designing high-throughput, fault-tolerant distributed systems. {flagshipAchievement}

Given Uber's scale across real-time marketplace matching, driver-rider telemetry, and event-driven architectures, I am eager to contribute immediately to optimizing backend latency, resilient message pipelines, and clean API boundaries.

You can inspect my production system architectures and codebases on GitHub ({githubUrl}) and interactive case studies at {portfolioUrl}.

Would you be open to a 15-minute conversation next week to explore how my technical background aligns with your team's upcoming roadmap?

{signature}`
  },
  {
    id: 'top-netflix',
    title: 'Netflix – High-Throughput Cloud & Chaos Resilience',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Netflix',
    ctcBand: '~₹90 LPA',
    description: 'Engineered for high autonomy (Freedom & Responsibility), edge streaming microservices, chaos testing, and low-latency micro-frontends.',
    defaultSubject: '{role} – High-Scale Distributed Systems & Telemetry – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

Netflix's culture of Freedom and Responsibility combined with world-class cloud resilience has long inspired my approach to software engineering. I am reaching out to submit my application for the {role} role.

Over {yoe}, I have specialized in {strengths}, building distributed services engineered to fail gracefully under high load with comprehensive telemetry. {flagshipAchievement}

Whether optimizing edge data delivery, isolating microservice failure domains, or crafting responsive, decoupled client applications, I thrive in environments that prize high autonomy and end-to-end ownership.

My architecture write-ups and open-source systems are available on GitHub ({githubUrl}) and portfolio at {portfolioUrl}.

I would love to learn more about your team's current technical challenges. Do you have 15 minutes for an introductory conversation next week?

{signature}`
  },
  {
    id: 'top-google',
    title: 'Google – Large-Scale Distributed Systems & Algorithmic Rigor',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Google',
    ctcBand: '~₹85 LPA',
    description: 'Emphasizes algorithmic efficiency, sub-millisecond p99 latency, scalable RPC infrastructure, and robust systems design.',
    defaultSubject: 'Application for {role} – Distributed Systems & Scalability – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I am writing to express my strong interest in the {role} opportunity at Google.

With {yoe} of hands-on experience specializing in {strengths}, I focus on building distributed, high-availability systems with relentless attention to algorithmic efficiency and low tail latency. {flagshipAchievement}

I admire Google's foundational contributions to distributed computing and infrastructure reliability. I am confident my background in scalable backend architectures, clean data contracts, and automated performance profiling will allow me to make an immediate impact on your team.

My technical case studies and public code repositories are available at {portfolioUrl} and GitHub ({githubUrl}).

I would welcome the opportunity to connect for a 15-minute chat to discuss how my skill set can support your team's goals.

{signature}`
  },
  {
    id: 'top-meta',
    title: 'Meta – High-Velocity Product Engineering & Web Scale',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Meta',
    ctcBand: '~₹85 LPA',
    description: 'Focused on rapid iteration, end-to-end feature ownership, React/TypeScript/GraphQL ecosystems, and measurable user impact.',
    defaultSubject: '{role} Candidate – High-Velocity Product & Systems Engineering – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I am reaching out to express my enthusiasm for the {role} opening at Meta.

As a product-focused engineer with {yoe} of experience in {strengths}, I specialize in rapidly translating complex product requirements into resilient, high-performance web applications and backend services. {flagshipAchievement}

Meta's culture of moving fast and building for billions of people strongly resonates with how I operate. I take pride in taking features from architectural RFC to global production launch with end-to-end telemetry and quantifiable user engagement impact.

You can inspect my interactive web applications, frontend micro-architectures, and codebases at {portfolioUrl} and GitHub ({githubUrl}).

Could we schedule a brief 15-minute conversation next week to discuss your team's upcoming product priorities?

{signature}`
  },
  {
    id: 'top-apple',
    title: 'Apple – Systems Craftsmanship, Reliability & Privacy',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Apple',
    ctcBand: '~₹82 LPA',
    description: 'Reflects Apple\'s uncompromising commitment to software craft, privacy-first architecture, and robust client-server reliability.',
    defaultSubject: 'Application: {role} – Systems Engineering & Craft – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

Apple's dedication to seamless user experiences, privacy-first architecture, and uncompromised software craft has always set the industry standard. I am writing to submit my application for the {role} role.

Over {yoe}, I have honed my skills across {strengths}, designing services that combine clean design patterns with rock-solid reliability under high traffic. {flagshipAchievement}

I take deep satisfaction in getting the details right—from defensive API design and rigorous edge-case testing to responsive, performant user interfaces. I would be thrilled to bring this dedication to craft to Apple's engineering team.

My technical case studies and repositories are available for your review at {portfolioUrl} and {githubUrl}.

I would appreciate the chance to discuss how my experience aligns with your team's standards. Would you have 15 minutes for an introductory conversation?

{signature}`
  },
  {
    id: 'top-airbnb',
    title: 'Airbnb – Distributed Marketplace & Product Infrastructure',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Airbnb',
    ctcBand: '~₹80 LPA',
    description: 'Geared for complex distributed state machines, booking pipelines, micro-frontends, and high-fidelity user workflows.',
    defaultSubject: '{role} Application – Distributed Marketplace & Product Infrastructure – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I have long admired Airbnb's product engineering excellence—from your sophisticated service-oriented architecture to your beautifully crafted user interfaces. I am excited to apply for the {role} position.

With {yoe} of experience in {strengths}, I build reliable full-stack systems that handle complex state machines, high-concurrency booking workflows, and modern web applications. {flagshipAchievement}

I thrive at the intersection of robust backend engineering and thoughtful frontend architecture, ensuring seamless user journeys backed by resilient, observable services.

Please feel free to review my interactive project demos and codebases at {portfolioUrl} and GitHub ({githubUrl}).

I would love to learn more about your team's upcoming milestones. Are you open to a quick 15-minute introductory call?

{signature}`
  },
  {
    id: 'top-amazon',
    title: 'Amazon / AWS – Customer Obsession & Operational Excellence',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Amazon',
    ctcBand: '~₹75 LPA',
    description: 'Aligned with Amazon Leadership Principles (Customer Obsession, Ownership, Deliver Results) and decoupled cloud microservices.',
    defaultSubject: '{role} – Customer Obsession & Cloud Architecture – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I am writing to apply for the {role} opening at Amazon.

Across {yoe} of software engineering specializing in {strengths}, I embody Amazon's Leadership Principles of Customer Obsession, Ownership, and Bias for Action. {flagshipAchievement}

I have extensive experience architecting decoupled, fault-tolerant microservices, implementing automated deployment pipelines, and managing production operations with zero tolerance for downtime. I would welcome the opportunity to contribute to Amazon's massive cloud footprint and deliver measurable value to your customers.

You can inspect my production systems and architecture documentation at {portfolioUrl} and GitHub ({githubUrl}).

I would welcome 15 minutes of your time to discuss how my background matches your team's operational and architectural goals.

{signature}`
  },
  {
    id: 'top-microsoft',
    title: 'Microsoft – Enterprise Cloud Scale & Systems Reliability (.NET / Azure / TS)',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Microsoft',
    ctcBand: '~₹72 LPA',
    description: 'Perfect alignment for Microsoft\'s core stack (.NET Core, C#, TypeScript, Azure microservices) and enterprise cloud productivity.',
    defaultSubject: '{role} – Enterprise Cloud Systems (.NET / Azure / TypeScript) – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I am writing to express my strong enthusiasm for the {role} position at Microsoft.

With {yoe} of deep production experience in {strengths}, my background is closely aligned with Microsoft's engineering ecosystem. I architect enterprise-grade microservices and modern web applications with strict requirements for performance, scalability, and security. {flagshipAchievement}

I admire Microsoft's leadership in cloud transformation, developer tooling, and global AI infrastructure. I am eager to bring my expertise in C#, .NET Core, TypeScript, and cloud-native microservices to your team to help empower organizations worldwide.

My complete project portfolio, architecture blueprints, and codebases are available at {portfolioUrl} and GitHub ({githubUrl}).

Would you be available for a 15-minute introductory call next week to discuss how my skill set can benefit your team?

{signature}`
  },
  {
    id: 'top-nvidia',
    title: 'NVIDIA – High-Performance Computing & Accelerated Infrastructure',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'NVIDIA',
    ctcBand: '~₹70 LPA',
    description: 'Tailored for high-throughput data streaming, accelerated platforms, GPU infrastructure, and low-latency systems engineering.',
    defaultSubject: '{role} Application – High-Performance Computing & Systems – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

NVIDIA's pioneering work in accelerated computing and AI infrastructure is transforming the technology landscape. I am writing to apply for the {role} position.

Over {yoe} in software engineering specializing in {strengths}, I have focused on high-throughput systems, low-latency data pipelines, and scalable microservices. {flagshipAchievement}

I am passionate about systems-level performance optimization, memory-efficient data processing, and robust software engineering practices. I would love to contribute to building the platforms and distributed services that power NVIDIA's next generation of computing breakthroughs.

Detailed architecture breakdowns and repositories are available at {portfolioUrl} and GitHub ({githubUrl}).

Could we schedule a 15-minute conversation to explore how my experience aligns with your team's objectives?

{signature}`
  },
  {
    id: 'top-stripe',
    title: 'Stripe – Financial Infrastructure & Zero-Loss API Craft',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Stripe',
    ctcBand: '~₹68 LPA',
    description: 'Emphasizes idempotent transactions, 99.999% availability, developer-first API design, and financial ledger correctness.',
    defaultSubject: 'Software Engineer Application – Financial Infrastructure & API Craft – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

Stripe's engineering rigor and devotion to developer-first API design have set the global standard for financial infrastructure. I am excited to apply for the {role} role.

With {yoe} of production experience focused on {strengths}, I specialize in designing idempotent APIs, distributed transaction pipelines, and highly observable microservices. {flagshipAchievement}

Building for the financial internet demands zero tolerance for data anomalies, seamless backward compatibility, and five-nines uptime. I would welcome the opportunity to bring my experience in resilient backend architecture and clean software design to Stripe's engineering team.

My technical case studies and code repositories are published at {portfolioUrl} and GitHub ({githubUrl}).

I would be grateful for a 15-minute introductory conversation to learn more about your team's roadmap.

{signature}`
  },
  {
    id: 'top-atlassian',
    title: 'Atlassian – Developer Platform & Enterprise Collaboration Cloud',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Atlassian',
    ctcBand: '~₹40–50+ LPA',
    description: 'Geared for enterprise collaboration scale (Jira, Confluence), developer velocity, and multi-tenant cloud microservices.',
    defaultSubject: '{role} Application – Enterprise Cloud & Collaboration Platforms – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

Atlassian's mission of unleashing the potential of every team through products like Jira and Confluence strongly resonates with my passion for developer productivity. I am writing to apply for the {role} position.

Over the past {yoe}, I have specialized in {strengths}, architecting scalable cloud services and modern web frontends designed for high-concurrency collaboration. {flagshipAchievement}

I admire Atlassian's open engineering culture and commitment to building durable, multi-tenant cloud platforms. I would love to bring my skills in microservice scaling, resilient state handling, and high-velocity shipping to your organization.

You can inspect my technical portfolio and code samples at {portfolioUrl} and GitHub ({githubUrl}).

Are you available for a brief 15-minute introductory chat next week?

{signature}`
  },

  // ==========================================
  // TIER-1 FINTECH & UNICORNS (INDIA & GLOBAL)
  // ==========================================
  {
    id: 'top-fintech-india',
    title: 'Razorpay / PhonePe – Mission-Critical Payments & 99.999% Uptime',
    category: 'Tier-1 FinTech & Unicorns (India)',
    companyTarget: 'Razorpay / PhonePe',
    ctcBand: '~₹45–46 LPA',
    description: 'Engineered for high-volume UPI transactions, flash sale surge resilience, idempotent webhooks, and zero-dropped payment states.',
    defaultSubject: '{role} – High-Availability Payment Gateways & Microservices – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

Handling billions of UPI and card transactions with 99.999% uptime is one of the most demanding engineering feats in the industry. I am reaching out to submit my application for the {role} role at {company}.

With {yoe} of hands-on experience in {strengths}, I specialize in architecting distributed systems that guarantee transaction atomicity, low latency, and robust failure recovery. {flagshipAchievement}

Given {company}'s critical role in digital finance, I am eager to contribute to scaling payment processing pipelines, hardening webhook delivery systems, and optimizing real-time ledger consistency.

My architecture write-ups, transaction state handling demos, and codebases are available at {portfolioUrl} and GitHub ({githubUrl}).

I would welcome 15 minutes of your time to discuss how my engineering background aligns with your payment platform goals.

{signature}`
  },
  {
    id: 'top-ecommerce-dispatch',
    title: 'Flipkart / Zomato / Swiggy / Meesho – Flash-Sale Concurrency & Hyper-Local Dispatch',
    category: 'Tier-1 FinTech & Unicorns (India)',
    companyTarget: 'Flipkart / Zomato / Swiggy / Meesho',
    ctcBand: '~₹40–48 LPA',
    description: 'Tailored for peak festive flash-sale spikes (Big Billion Days / New Year\'s Eve), real-time order dispatch, and high-throughput inventory engines.',
    defaultSubject: '{role} Application – High-Concurrency Microservices & Real-Time Scale – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

Operating hyper-scale consumer systems that gracefully absorb massive flash-sale spikes (such as Big Billion Days and peak holiday rushes) represents an incredible engineering benchmark. I am excited to apply for the {role} role at {company}.

Over {yoe}, I have specialized in {strengths}, building high-concurrency microservices, distributed cache topologies (Redis), and asynchronous event streams that remain responsive under heavy loads. {flagshipAchievement}

Whether scaling real-time driver/order dispatch state machines, optimizing checkout latency, or safeguarding inventory consistency, I thrive on high-impact challenges.

You can inspect my production systems and architecture projects on my portfolio ({portfolioUrl}) and GitHub ({githubUrl}).

Do you have 15 minutes available next week for a quick introductory conversation?

{signature}`
  },
  {
    id: 'top-enterprise-saas',
    title: 'Enterprise Multi-Tenant SaaS – Salesforce / Adobe / ServiceNow / PayPal / Oracle',
    category: 'Top Product / High-Comp (MAANG & Global)',
    companyTarget: 'Salesforce / Adobe / ServiceNow / PayPal / Oracle / SAP Labs',
    ctcBand: '~₹52–65 LPA',
    description: 'Designed for enterprise multi-tenant cloud platforms, distributed workflow engines, sub-second query performance, and rock-solid SLAs.',
    defaultSubject: '{role} Application – Enterprise Multi-Tenant Systems & Reliability – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I have been following {company}'s platform engineering achievements and am writing to submit my application for the {role} position.

With {yoe} of software engineering experience specializing in {strengths}, I architect robust enterprise applications that balance high developer velocity with rigorous system reliability and security compliance. {flagshipAchievement}

I bring deep expertise in building scalable microservices, designing domain-driven APIs, and optimizing database query performance across high-volume workloads. I would be thrilled to bring this dedication to {company}'s enterprise customers.

My portfolio case studies and open-source repositories are accessible at {portfolioUrl} and GitHub ({githubUrl}).

I would appreciate the opportunity to connect for a 15-minute chat to discuss how my background fits your team's objectives.

{signature}`
  },

  // ==========================================
  // GENERAL ROLE ARCHETYPES & SPECIALIZED DRAFTS
  // ==========================================
  {
    id: 'sde-distributed-backend',
    title: 'SDE / Distributed Backend & Microservices',
    category: 'SDE / Full Stack',
    description: 'Tailored for high-throughput distributed systems, API architecture, and microservices.',
    defaultSubject: 'Senior Backend Engineer Application – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I have been following {company}'s engineering milestones and was thrilled to see your opening for the {role} position.

With {yoe} of production experience specializing in {strengths}, I architect backend services engineered for low latency, fault tolerance, and clean observability. {flagshipAchievement}

At {company}, I would love to contribute immediately to scaling your core services, reducing p99 latency, and implementing robust asynchronous workflows. You can review my architecture design write-ups and open-source systems on GitHub ({githubUrl}) and live case studies at {portfolioUrl}.

I have attached my resume for your review. Would you be open to a brief 15-minute conversation next week to discuss how my background aligns with your engineering goals?

{signature}`
  },
  {
    id: 'sde-fullstack-product',
    title: 'Full Stack & Product Engineer',
    category: 'SDE / Full Stack',
    description: 'Balances polished, high-performance UI engineering with rock-solid API and database design.',
    defaultSubject: '{role} – {candidateName} – Candidate Introduction',
    bodyTemplate: `Dear {recruiterName},

I am writing to express my strong enthusiasm for the {role} role at {company}.

As a Full Stack Engineer with {yoe} of hands-on experience, I bridge user-centric frontend experiences with high-throughput backend services. My core technical strengths include {strengths}. {flagshipAchievement}

What excites me about {company} is your commitment to delivering exceptional user workflows while maintaining high technical rigor. In my past work, I have taken complex features from architectural RFC to cross-functional production release with end-to-end telemetry.

My interactive portfolio showcasing live production builds is accessible at {portfolioUrl}, and code repositories can be inspected at {githubUrl}.

I would welcome the opportunity to connect for a quick 15-minute introductory chat. Thank you for your time and consideration!

{signature}`
  },
  {
    id: 'cloud-platform-devops',
    title: 'Cloud Platform, DevOps & SRE',
    category: 'Cloud & DevOps',
    description: 'Focused on multi-cloud infrastructure as code, Kubernetes orchestration, and CI/CD security.',
    defaultSubject: 'Application for {role} – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I am reaching out regarding the {role} opening at {company}.

Over the past {yoe}, I have focused on designing resilient cloud infrastructure, automating zero-downtime deployments, and elevating developer velocity. My day-to-day focus centers on {strengths}. {flagshipAchievement}

I admire {company}'s platform engineering scale. I bring deep experience containerizing legacy applications, configuring Kubernetes operators, and hardening security postures with automated compliance pipelines.

Detailed infrastructure blueprints, Terraform modules, and CI/CD templates are available on my GitHub profile ({githubUrl}) and portfolio ({portfolioUrl}).

I would appreciate the chance to discuss how I can help safeguard uptime and accelerate deployment cadence for your teams. Are you free for a 15-minute discussion next week?

{signature}`
  },
  {
    id: 'cloud-solutions-architect',
    title: 'Cloud Solutions Architect & Systems Strategy',
    category: 'Cloud & DevOps',
    description: 'Strategic technical liaison translating enterprise requirements into scalable cloud architectures.',
    defaultSubject: 'Solutions Architect Opening – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I noticed that {company} is expanding its solutions engineering team and wanted to proactively introduce myself for the {role} position.

With {yoe} driving enterprise cloud migrations and architectural design, I specialize in {strengths}. {flagshipAchievement}

Whether optimizing cloud unit economics, establishing disaster recovery across multi-region clusters, or partnering with customer engineering teams, my focus is always on delivering measurable business ROI paired with rock-solid architectural foundations.

Please feel free to review my architecture case studies and whitepapers at {portfolioUrl}.

I would love to learn more about {company}'s current platform priorities. Would you have 15 minutes for an introductory conversation?

{signature}`
  },
  {
    id: 'high-growth-startup',
    title: 'High-Velocity Startup Generalist',
    category: 'SDE / Full Stack',
    description: 'High-agency tone optimized for early-to-mid stage startups valuing speed, ownership, and adaptability.',
    defaultSubject: 'Early Engineer / {role} – {candidateName}',
    bodyTemplate: `Hi {recruiterName},

I love what the team is building at {company} and would love to help you scale as your next {role}.

I am a high-agency engineer with {yoe} across full-stack systems and cloud deployment. My primary strengths lie in {strengths}. {flagshipAchievement}

At early and fast-scaling stages, I thrive wearing multiple hats: shipping user-facing features fast, establishing automated testing before tech debt snowballs, and debugging production bottlenecks end-to-end.

You can inspect live demos and projects I have built at {portfolioUrl} and check code quality on GitHub ({githubUrl}).

Do you have 10 minutes this week for a quick chat?

{signature}`
  },
  {
    id: 'enterprise-fintech',
    title: 'Enterprise & FinTech High-Reliability Systems',
    category: 'SDE / Full Stack',
    description: 'Emphasizes transaction integrity, zero-loss compliance, data privacy, and strict SLAs.',
    defaultSubject: '{role} Application – Integrity, Scale & Reliability – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I am writing to submit my application for the {role} opening at {company}.

Working in mission-critical environments requires zero tolerance for data anomalies, strict transaction guarantees, and airtight security. Over {yoe}, I have specialized in {strengths}. {flagshipAchievement}

I am particularly impressed by {company}'s engineering reputation for maintaining uncompromising standards in security and system correctness. I would welcome the chance to bring my experience in resilient data pipelines, idempotent API architectures, and automated audit logs to your team.

My technical portfolio and public repositories are available at {portfolioUrl} and {githubUrl}.

I look forward to discussing how I can add immediate value to {company}.

{signature}`
  },
  {
    id: 'ai-infra-llm-app',
    title: 'AI Systems & LLM Application Engineer',
    category: 'Specialized & Networking',
    description: 'Targeted for applied AI, retrieval-augmented generation (RAG), and model orchestration pipelines.',
    defaultSubject: 'Application: {role} (Applied AI & Systems) – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

I have been following {company}'s AI product advancements and wanted to express my enthusiasm for the {role} role.

Over the past {yoe}, my focus has combined core systems engineering with modern generative AI pipelines, specifically {strengths}. {flagshipAchievement}

I specialize in moving AI systems beyond naive prototypes into production reality—incorporating semantic caching, vector retrieval benchmarks, structured output validation, and cost-efficient latency optimizations.

You can explore my interactive AI applications and codebases at {portfolioUrl} and GitHub ({githubUrl}).

I would welcome the opportunity to exchange ideas on your AI roadmap. Would you be open to a 15-minute call?

{signature}`
  },
  {
    id: 'recruiter-direct-inmail',
    title: 'Direct Recruiter InMail / Short Cold Pitch',
    category: 'Specialized & Networking',
    description: 'Concise, high-impact cold message tailored for LinkedIn InMail or busy executive recruiters.',
    defaultSubject: '{candidateName} – Introduction for {role} at {company}',
    bodyTemplate: `Hi {recruiterName},

I saw {company}'s opening for {role} and wanted to reach out directly.

Quick summary of what I bring:
• {yoe} hands-on experience in {strengths}
• {flagshipAchievement}
• Live portfolio: {portfolioUrl}
• GitHub codebases: {githubUrl}

Given {company}'s technical trajectory, I am confident I can make an immediate impact on your team's upcoming deliverables.

Are you available for a brief 10-minute introductory call sometime next week?

{signature}`
  },
  {
    id: 'alumni-referral-request',
    title: 'Peer / Alumni Referral Request',
    category: 'Specialized & Networking',
    description: 'Warm, respectful outreach to an existing team member or mutual connection requesting an internal referral.',
    defaultSubject: 'Quick question regarding engineering at {company} / {role}',
    bodyTemplate: `Hi {recruiterName},

I hope this message finds you well! I noticed your work at {company} and have been really impressed by the team's recent trajectory.

I am an engineer with {yoe} specializing in {strengths}. I am currently applying for the {role} position at {company} and wanted to ask if you would be open to sharing any brief insights into the engineering culture on the team?

If you feel my background looks like a good match ({portfolioUrl} / {githubUrl}), I would be immensely grateful for an internal referral or introduction to the hiring manager.

Either way, thank you for your time and continued great work!

{signature}`
  },
  {
    id: 'post-interview-thankyou',
    title: 'Post-Interview Thank You & Concrete Value Add',
    category: 'Specialized & Networking',
    description: 'Follow-up email sent within 24 hours of a technical screen reinforcing enthusiasm and key talking points.',
    defaultSubject: 'Thank you – {role} interview follow-up – {candidateName}',
    bodyTemplate: `Dear {recruiterName},

Thank you very much for taking the time to speak with me today about the {role} position at {company}.

I truly enjoyed learning more about {company}'s current challenges, particularly your focus on {strengths}. The conversation reinforced my excitement about the opportunity to contribute.

Following our discussion regarding system scaling, I put together a few thoughts and references based on similar systems I built ({flagshipAchievement}), which you can also review in my portfolio at {portfolioUrl}.

Please don't hesitate to let me know if you need any additional code samples, references, or documentation from my end.

{signature}`
  }
];

/**
 * Replaces all placeholders in a template with actual candidate and job details.
 */
export function interpolateDraft(
  template: FoundationalDraft,
  profile: UserProfile,
  job?: Partial<JobItem>
): { subject: string; body: string } {
  const isPraveen = !profile.fullName || profile.fullName.toLowerCase().includes('praveen');

  const candidateName = profile.fullName?.trim() || 'Praveen Kashyap';
  const candidateTitle = profile.currentRole?.trim() || (isPraveen ? 'Full Stack Engineer / SDE' : 'Software Engineer');
  const company = job?.companyName?.trim() || 'your company';
  const role = job?.targetRole?.trim() || (isPraveen ? 'Full Stack Engineer / SDE' : 'Software Engineer');
  
  const rawRecruiter = job?.hrRecruiterName?.trim();
  const recruiterName = (rawRecruiter && !rawRecruiter.includes('@'))
    ? rawRecruiter
    : `${company} Hiring Team`;

  const yoe = profile.yoe?.trim() || '3+ years';
  const strengths = profile.keyStrengths?.trim() || (isPraveen 
    ? 'Angular, React, TypeScript, C#, .NET Core, Microservices, Cloud Architecture' 
    : 'building scalable microservices and resilient cloud architectures');
  const flagshipAchievement = profile.flagshipAchievement?.trim()
    ? `Recently, I ${profile.flagshipAchievement.trim().replace(/^\.?/, '').trim()}.`
    : `In my career, I have consistently driven measurable outcomes, architecting distributed systems with low p99 latencies.`;

  const portfolioUrl = profile.portfolioUrl?.trim() || profile.githubUrl?.trim() || (isPraveen ? 'https://github.com/coder-pro10z' : 'https://portfolio.dev');
  const githubUrl = profile.githubUrl?.trim() || (isPraveen ? 'https://github.com/coder-pro10z' : 'https://github.com');
  const linkedinUrl = profile.linkedinUrl?.trim() || (isPraveen ? 'https://www.linkedin.com/in/coder-pro10z/' : 'https://linkedin.com');
  const phone = profile.phone?.trim() || (isPraveen ? '+91 7394990738' : '');
  const email = profile.email?.trim() || (isPraveen ? '2pkashyap2001@gmail.com' : '');

  const signature = assembleSignature(profile);

  const replacements: Record<string, string> = {
    '{candidateName}': candidateName,
    '{candidateTitle}': candidateTitle,
    '{company}': company,
    '{role}': role,
    '{recruiterName}': recruiterName,
    '{yoe}': yoe,
    '{strengths}': strengths,
    '{flagshipAchievement}': flagshipAchievement,
    '{portfolioUrl}': portfolioUrl,
    '{githubUrl}': githubUrl,
    '{linkedinUrl}': linkedinUrl,
    '{phone}': phone,
    '{email}': email,
    '{signature}': signature
  };

  let subject = template.defaultSubject;
  let body = template.bodyTemplate;

  for (const [placeholder, val] of Object.entries(replacements)) {
    subject = subject.split(placeholder).join(val);
    body = body.split(placeholder).join(val);
  }

  return { subject, body };
}
