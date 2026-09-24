import type { JobItem, UserProfile } from '../types/job';

/**
 * Builds a standardized, publication-ready email signature block
 * incorporating candidate name, role, contact info, GitHub, LinkedIn, and Portfolio.
 */
export function assembleSignature(profile: UserProfile): string {
  const isPraveen = !profile.fullName || profile.fullName.toLowerCase().includes('praveen');

  const name = profile.fullName?.trim() || 'Praveen Kashyap';
  const role = profile.currentRole?.trim() || (isPraveen ? 'Full Stack Engineer / SDE' : 'Software Engineer');
  const phone = profile.phone?.trim() || (isPraveen ? '+91 7394990738' : '');
  const email = profile.email?.trim() || (isPraveen ? '2pkashyap2001@gmail.com' : '');
  const linkedin = profile.linkedinUrl?.trim() || (isPraveen ? 'https://www.linkedin.com/in/coder-pro10z/' : '');
  const github = profile.githubUrl?.trim() || (isPraveen ? 'https://github.com/coder-pro10z' : '');
  const portfolio = profile.portfolioUrl?.trim() || (isPraveen ? 'https://github.com/coder-pro10z' : '');

  const lines: string[] = [
    '--',
    'Best regards,',
    name,
    role
  ];

  const contactLine: string[] = [];
  if (phone) contactLine.push(`Phone: ${phone}`);
  if (email) contactLine.push(`Email: ${email}`);
  if (contactLine.length > 0) {
    lines.push(contactLine.join(' | '));
  }

  if (linkedin) lines.push(`LinkedIn: ${linkedin}`);
  if (github) lines.push(`GitHub: ${github}`);
  if (portfolio && portfolio !== github) lines.push(`Portfolio: ${portfolio}`);
  else if (github) lines.push(`Portfolio / Repositories: ${github}`);

  return lines.join('\n');
}

/**
 * Assembles a complete, multi-paragraph cold email draft for a specific job application.
 * Ensures the email contains:
 * 1. Professional Greeting
 * 2. Role-specific context & hook
 * 3. Candidate's core value proposition & key strengths
 * 4. Concrete metrics or flagship achievements
 * 5. Call to action (15-min discovery call)
 * 6. Full formal signature with contact & portfolio links
 */
export function assembleFullOutreachEmail(job: JobItem, profile: UserProfile): string {
  const isPraveen = !profile.fullName || profile.fullName.toLowerCase().includes('praveen');

  const company = job.companyName?.trim() || 'the Engineering';
  const role = job.targetRole?.trim() || (isPraveen ? 'Full Stack Engineer / SDE' : 'Software Engineer');
  const recruiter = job.hrRecruiterName?.trim();
  const greeting = (recruiter && !recruiter.includes('@')) 
    ? `Dear ${recruiter},` 
    : `Dear ${company} Hiring Team,`;

  const yoe = profile.yoe?.trim() || '3+ years';
  const strengths = profile.keyStrengths?.trim() || (isPraveen 
    ? 'Angular, React, TypeScript, C#, .NET Core, Microservices, Cloud Architecture' 
    : 'building scalable microservices, resilient cloud architectures, and modern web applications');
  const achievement = profile.flagshipAchievement?.trim();

  const preview = job.outreachBodyPreview?.trim();

  // Robust anti-truncation check:
  // If the preview is missing, ends in '...', contains 'e...', or is a short teaser under 280 chars,
  // do NOT use the broken teaser. Synthesize the complete pitch!
  const isTruncatedOrOutdated = !preview || 
    preview.endsWith('...') || 
    preview.endsWith('…') || 
    preview.length < 280 || 
    !preview.includes('\n\n') ||
    preview.includes('5+ years'); // Discard any legacy 5+ years text

  let coreBody = '';

  if (!isTruncatedOrOutdated) {
    coreBody = preview;
  } else {
    // Build a structured, high-converting pitch tailored to the candidate's exact profile and target company
    const lowerCo = company.toLowerCase();
    let companyContext = `In my work across frontend and backend services, I focus on delivering scalable, production-hardened systems with robust automated testing, low p99 latencies, and high developer velocity.`;

    if (lowerCo.includes('uber')) {
      companyContext = `I have followed Uber's engineering architecture closely—particularly how your teams manage millions of concurrent trip state transitions with strict p99 latency SLAs. In my production work, I specialize in low-latency event-driven microservices, distributed caching, and clean service contracts.`;
    } else if (lowerCo.includes('netflix')) {
      companyContext = `Netflix's culture of Freedom and Responsibility combined with world-class cloud resilience inspires my engineering approach. I specialize in designing fault-tolerant microservices engineered to fail gracefully under heavy load with comprehensive observability.`;
    } else if (lowerCo.includes('google') || lowerCo.includes('alphabet')) {
      companyContext = `I admire Google's foundational contributions to distributed computing and infrastructure reliability. I bring deep experience in scalable backend architectures, clean data contracts, and algorithmic efficiency at scale.`;
    } else if (lowerCo.includes('meta') || lowerCo.includes('facebook')) {
      companyContext = `Meta's culture of moving fast and building for billions of people resonates with how I operate. I take pride in taking complex features from architectural RFC to production release with end-to-end telemetry and quantifiable user engagement impact.`;
    } else if (lowerCo.includes('stripe')) {
      companyContext = `Building for the financial internet demands zero tolerance for data anomalies, seamless backward compatibility, and five-nines uptime. I specialize in designing idempotent APIs, distributed transaction pipelines, and highly observable services.`;
    } else if (lowerCo.includes('microsoft') || lowerCo.includes('azure')) {
      companyContext = `With deep experience in C#, .NET Core, TypeScript, and cloud-native microservices, my background is tightly aligned with Microsoft's engineering ecosystem. I architect enterprise-grade services engineered for security, high throughput, and developer productivity.`;
    } else if (lowerCo.includes('amazon') || lowerCo.includes('aws')) {
      companyContext = `Across my engineering career, I embody Amazon's Leadership Principles of Customer Obsession, Ownership, and Bias for Action, with extensive experience designing decoupled, fault-tolerant microservices with automated deployment pipelines.`;
    } else if (lowerCo.includes('razorpay') || lowerCo.includes('phonepe')) {
      companyContext = `Handling high-volume digital payments with 99.999% uptime is an incredible benchmark. I focus on distributed systems that guarantee transaction atomicity, sub-second latency, and idempotent webhook delivery.`;
    } else if (lowerCo.includes('flipkart') || lowerCo.includes('zomato') || lowerCo.includes('swiggy') || lowerCo.includes('meesho')) {
      companyContext = `Operating systems that gracefully absorb massive peak surges (like flash sales and holiday rushes) requires rigorous architecture. I specialize in high-concurrency microservices, distributed cache topologies (Redis), and real-time state machines.`;
    } else if (lowerCo.includes('atlassian')) {
      companyContext = `I admire Atlassian's open engineering culture and commitment to building durable, multi-tenant cloud platforms. I bring battle-tested skills in microservice scaling, resilient state handling, and high developer velocity.`;
    }

    const hook = `I am writing to express my strong enthusiasm for the ${role} opening at ${company}. With over ${yoe} of hands-on software engineering experience, I specialize in ${strengths}.`;
    
    const metricHook = achievement 
      ? `${companyContext} Recently: ${achievement}.`
      : companyContext;

    const portfolioLink = profile.portfolioUrl || profile.githubUrl || 'https://github.com/coder-pro10z';
    const portfolioNote = `You can explore my featured projects, open-source repositories, and technical write-ups at ${portfolioLink}.`;

    const cta = `I would welcome the opportunity to discuss how my technical background and problem-solving approach align with ${company}'s roadmap. Would you be open to a brief 15-minute conversation sometime next week?`;

    coreBody = [hook, metricHook, portfolioNote, cta].join('\n\n');
  }

  const signature = assembleSignature(profile);

  // If coreBody already includes a greeting, don't duplicate it
  const startsWithGreeting = /^(Dear|Hello|Hi)\s+/i.test(coreBody);
  
  // If coreBody already includes the signature, don't duplicate it
  const hasSignature = coreBody.includes('--\nBest regards') || coreBody.includes('Best regards,');

  let fullMessage = '';
  if (startsWithGreeting && hasSignature) {
    fullMessage = coreBody;
  } else if (startsWithGreeting && !hasSignature) {
    fullMessage = `${coreBody}\n\n${signature}`;
  } else if (!startsWithGreeting && hasSignature) {
    fullMessage = `${greeting}\n\n${coreBody}`;
  } else {
    fullMessage = `${greeting}\n\n${coreBody}\n\n${signature}`;
  }

  return fullMessage;
}
