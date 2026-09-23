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
    // Build a structured, high-converting pitch tailored to the candidate's exact profile
    const hook = `I am writing to express my strong enthusiasm for the ${role} opening at ${company}. With over ${yoe} of hands-on software engineering experience, I specialize in ${strengths}.`;
    
    const metricHook = achievement 
      ? `In my production work, I have consistently driven measurable outcomes, including: ${achievement}. I take pride in crafting high-throughput systems, resilient APIs, and responsive frontends with end-to-end telemetry.`
      : `In my work across frontend and backend services, I focus on delivering scalable, production-hardened systems with robust automated testing, low p99 latencies, and high developer velocity.`;

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
