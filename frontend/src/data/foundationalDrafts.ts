import type { UserProfile, JobItem } from '../types/job';
import { assembleSignature } from '../services/emailAssembler';

export interface FoundationalDraft {
  id: string;
  title: string;
  category: 'SDE / Full Stack' | 'Cloud & DevOps' | 'Specialized & Networking';
  description: string;
  defaultSubject: string;
  bodyTemplate: string;
}

export const FOUNDATIONAL_DRAFTS: FoundationalDraft[] = [
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
  const candidateName = profile.fullName?.trim() || 'Candidate';
  const candidateTitle = profile.currentRole?.trim() || 'Software Engineer';
  const company = job?.companyName?.trim() || 'your company';
  const role = job?.targetRole?.trim() || 'Software Engineer';
  
  const rawRecruiter = job?.hrRecruiterName?.trim();
  const recruiterName = (rawRecruiter && !rawRecruiter.includes('@'))
    ? rawRecruiter
    : `${company} Hiring Team`;

  const yoe = profile.yoe?.trim() || '5+ years';
  const strengths = profile.keyStrengths?.trim() || 'building scalable microservices and resilient cloud architectures';
  const flagshipAchievement = profile.flagshipAchievement?.trim()
    ? `Recently, I ${profile.flagshipAchievement.trim().replace(/^\.?/, '').trim()}.`
    : `In my career, I have consistently driven measurable outcomes and maintained high engineering velocity.`;

  const portfolioUrl = profile.portfolioUrl?.trim() || 'https://portfolio.dev';
  const githubUrl = profile.githubUrl?.trim() || 'https://github.com';
  const linkedinUrl = profile.linkedinUrl?.trim() || 'https://linkedin.com';
  const phone = profile.phone?.trim() || '';
  const email = profile.email?.trim() || '';

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
