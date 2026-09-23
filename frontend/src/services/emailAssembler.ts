import type { JobItem, UserProfile } from '../types/job';

/**
 * Builds a standardized, publication-ready email signature block
 * incorporating candidate name, role, contact info, GitHub, LinkedIn, and Portfolio.
 */
export function assembleSignature(profile: UserProfile): string {
  const name = profile.fullName?.trim() || 'Candidate';
  const role = profile.currentRole?.trim() || 'Software Engineer';
  const phone = profile.phone?.trim();
  const email = profile.email?.trim();
  const linkedin = profile.linkedinUrl?.trim();
  const github = profile.githubUrl?.trim();
  const portfolio = profile.portfolioUrl?.trim();

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
  if (portfolio) lines.push(`Portfolio: ${portfolio}`);

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
  const company = job.companyName?.trim() || 'the Engineering';
  const role = job.targetRole?.trim() || 'Software Engineer';
  const recruiter = job.hrRecruiterName?.trim();
  const greeting = (recruiter && !recruiter.includes('@')) 
    ? `Dear ${recruiter},` 
    : `Dear ${company} Hiring Team,`;

  const yoe = profile.yoe?.trim() || '5+ years';
  const strengths = profile.keyStrengths?.trim() || 'building scalable microservices, resilient cloud architectures, and modern web applications';
  const achievement = profile.flagshipAchievement?.trim();

  // If there's already an extensive tailored draft preview, use it as core body
  const preview = job.outreachBodyPreview?.trim();
  let coreBody = '';

  if (preview && preview.length > 180) {
    // If preview is already a multi-paragraph or long text, clean it and use it
    coreBody = preview;
  } else {
    // Build a structured, high-converting pitch tailored to the candidate's domain
    const hook = `I am writing to express my enthusiasm for the ${role} opening at ${company}. With over ${yoe} of hands-on experience, I have dedicated my career to ${strengths}.`;
    
    const metricHook = achievement 
      ? `In my recent roles, I have consistently driven measurable outcomes, including: ${achievement}. I take pride in crafting clean, production-hardened systems with robust testing, continuous deployment, and deep observability.`
      : `In my work, I focus on delivering reliable, production-hardened software systems that balance high engineering velocity with exceptional uptime and performance.`;

    const portfolioNote = (profile.portfolioUrl || profile.githubUrl)
      ? `You can explore my open-source code and featured case studies at ${profile.portfolioUrl || profile.githubUrl}.`
      : '';

    const cta = `I would welcome the opportunity to discuss how my technical background and problem-solving approach align with ${company}'s goals. Would you be open to a brief 15-minute conversation sometime next week?`;

    coreBody = [hook, metricHook, portfolioNote, cta].filter(Boolean).join('\n\n');
  }

  const signature = assembleSignature(profile);

  // If coreBody already includes a greeting, don't duplicate it
  const startsWithGreeting = /^(Dear|Hello|Hi)\s+/i.test(coreBody);
  const fullMessage = startsWithGreeting 
    ? `${coreBody}\n\n${signature}` 
    : `${greeting}\n\n${coreBody}\n\n${signature}`;

  return fullMessage;
}
