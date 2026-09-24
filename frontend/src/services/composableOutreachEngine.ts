import type { UserProfile } from '../types/job';
import { assembleSignature } from './emailAssembler';

export type WorkModeType = 'Remote' | 'Hybrid' | 'Onsite';
export type CompanyScaleType = 'startup' | 'mid-size' | 'mnc' | 'service' | 'high-comp-product';
export type OutreachAngleType = 'recruiter-direct' | 'hiring-manager-technical' | 'peer-referral';

export interface ComposableDraftOptions {
  companyName: string;
  targetRole: string;
  workMode?: WorkModeType | string;
  companyScale?: CompanyScaleType;
  outreachAngle?: OutreachAngleType;
  recruiterName?: string;
  profile: UserProfile;
}

/**
 * Automatically infers company scale and culture archetype from company name.
 * Uses patterns from the Top 500 Highest-Paying companies list and IT market sectors.
 */
export function inferCompanyScale(companyName: string): CompanyScaleType {
  const c = companyName.toLowerCase().trim();

  // High-Comp Quant, FinTech, & Deep Tech (from 500 Highest Paying list)
  const highCompKeywords = [
    'openai', 'anthropic', 'citadel', 'jane street', 'two sigma', 'hudson river',
    'radix', 'jump trading', 'drw', 'optiver', 'akuna', 'point72', 'bridgewater',
    'stripe', 'snowflake', 'databricks', 'rippling', 'coupang', 'coinbase',
    'waymo', 'cruise', 'roblox', 'figma', 'notion', 'clickup', 'plaid', 'chime'
  ];
  if (highCompKeywords.some(k => c.includes(k))) {
    return 'high-comp-product';
  }

  // MNC & Big Tech / Global Tech Giants
  const mncKeywords = [
    'google', 'alphabet', 'meta', 'facebook', 'instagram', 'apple', 'amazon', 'aws',
    'microsoft', 'azure', 'netflix', 'uber', 'airbnb', 'salesforce', 'adobe',
    'oracle', 'cisco', 'servicenow', 'sap', 'qualcomm', 'intel', 'ibm', 'dell',
    'atlassian', 'spotify', 'twitter', 'x corp', 'linkedin', 'ebay', 'paypal'
  ];
  if (mncKeywords.some(k => c.includes(k))) {
    return 'mnc';
  }

  // IT Services, Global Consulting, & Enterprise Solutions
  const serviceKeywords = [
    'tcs', 'tata consultancy', 'infosys', 'wipro', 'accenture', 'cognizant',
    'capgemini', 'hcl', 'tech mahindra', 'l&t', 'lti', 'mindtree', 'mphasis',
    'kpmg', 'deloitte', 'pwc', 'ey', 'ernst & young', 'nagarro', 'persistent',
    'birlasoft', 'hexaware', 'virtusa', 'sopra', 'publicis sapient', 'cgi',
    'solutions', 'technologies limited', 'consultancy', 'services'
  ];
  if (serviceKeywords.some(k => c.includes(k))) {
    return 'service';
  }

  // Mid-Size / High-Growth Scale-Ups (Series C-E, Unicorns)
  const midSizeKeywords = [
    'flipkart', 'razorpay', 'phonepe', 'zomato', 'swiggy', 'meesho', 'zepto',
    'blinkit', 'cred', 'groww', 'zerodha', 'dream11', 'postman', 'browserstack',
    'inmobi', 'freshworks', 'chargebee', 'druva', 'hasura', 'darwinbox'
  ];
  if (midSizeKeywords.some(k => c.includes(k))) {
    return 'mid-size';
  }

  // Default to mid-size / product scale-up
  return 'startup';
}

/**
 * Returns a tailored contextual hook for the company scale/archetype.
 */
function getCompanyScaleHook(scale: CompanyScaleType, company: string): string {
  switch (scale) {
    case 'startup':
      return `I love the speed, ownership, and high agency required at ${company}. As an engineer who thrives in fast-paced 0-to-1 environments, I wear multiple hats—translating customer needs into production code fast, preventing technical debt from accumulating, and shipping features end-to-end.`;
    case 'mid-size':
      return `At ${company}'s current stage of rapid scale, the engineering challenge shifts from initial MVP to breaking bottlenecks, decomposing monolithic services, and elevating platform reliability. I specialize in building modular systems that allow teams to ship faster without compromising system stability.`;
    case 'mnc':
      return `I admire ${company}'s engineering rigor in managing large-scale distributed architectures with strict p99 latency SLAs and five-nines availability. I bring deep experience working with clean architectural RFCs, automated CI/CD guardrails, and observable microservices at scale.`;
    case 'service':
      return `I understand the high-stakes demands of enterprise client delivery, digital transformation, and legacy modernization at ${company}. I excel at rapidly ramping up on complex client domains, modernizing legacy .NET architectures to cloud-native microservices, and delivering dependable milestone releases on schedule.`;
    case 'high-comp-product':
      return `Building systems for ${company} demands absolute correctness, low tail latency, and zero tolerance for data anomalies. I bring a disciplined engineering methodology focused on idempotent APIs, resilient asynchronous pipelines, and optimal compute efficiency under high throughput.`;
    default:
      return `I have followed ${company}'s engineering journey and would love to bring my systems background to your team.`;
  }
}

/**
 * Returns an alignment block tailored to the work mode (Remote vs Hybrid vs Onsite).
 */
function getWorkModeHook(mode: WorkModeType): string {
  switch (mode) {
    case 'Remote':
      return `Operating fully remotely, I bring strong self-directed autonomy, documentation-first communication, and proactive Slack/Loom/PR discipline. I am experienced in collaborating across distributed timezones and maintaining high shipping velocity without needing synchronous supervision.`;
    case 'Hybrid':
      return `I thrive in a hybrid model—using in-office days for high-bandwidth whiteboard architecture, sprint planning, and cross-functional pairing, while leveraging remote days for deep, uninterrupted implementation work.`;
    case 'Onsite':
      return `I am excited about working onsite with the team. In-person collaboration allows for zero-latency whiteboarding, immediate feedback loops on code reviews, and building deep team camaraderie to tackle complex technical hurdles together.`;
    default:
      return `I am highly adaptable across remote, hybrid, or onsite collaboration styles and prioritize clear communication and dependable delivery above all.`;
  }
}

/**
 * Returns a role and candidate value proposition block based on Praveen's verified profile.
 */
function getCandidateValueBlock(
  profile: UserProfile,
  angle: OutreachAngleType,
  company: string
): string {
  const isPraveen = !profile.fullName || profile.fullName.toLowerCase().includes('praveen');
  const yoe = profile.yoe?.trim() || '3+ years';
  const strengths = profile.keyStrengths?.trim() || (isPraveen
    ? 'Angular, React, TypeScript, C#, .NET Core, Microservices, Cloud Architecture'
    : 'building resilient microservices and cloud architectures');
  
  const achievement = profile.flagshipAchievement?.trim()
    ? `Recently: ${profile.flagshipAchievement.trim().replace(/^\.?/, '').trim()}`
    : `In my career, I have consistently driven measurable outcomes, architecting low-latency microservices with automated testing and end-to-end telemetry.`;

  if (angle === 'hiring-manager-technical') {
    return `With ${yoe} of production experience specializing in ${strengths}, my day-to-day focus is on architecting clean, maintainable microservices and high-performance frontends. ${achievement} I focus heavily on domain-driven design, sub-50ms p99 response times, and defensive API contracts.`;
  }

  if (angle === 'peer-referral') {
    return `I am an engineer with ${yoe} specializing in ${strengths}. ${achievement} Having researched ${company}'s recent technical trajectory, I believe my background could be a strong match for open engineering challenges on your team.`;
  }

  // Recruiter Direct
  return `As a Full Stack Engineer with ${yoe} of hands-on experience in ${strengths}, I bridge user-centric frontend experiences with scalable, production-hardened backend services. ${achievement}`;
}

/**
 * Returns an outreach angle call-to-action.
 */
function getCallToAction(angle: OutreachAngleType, company: string, mode: WorkModeType): string {
  if (angle === 'peer-referral') {
    return `If you feel my background looks like a good match for the team, would you be open to a brief 10-minute chat or an internal referral to the hiring manager? I would be immensely grateful for your perspective on the engineering culture at ${company}.`;
  }

  if (angle === 'hiring-manager-technical') {
    return `I would welcome 15 minutes to learn more about your team's upcoming roadmap and share how my technical background in distributed systems and modern frontends can support your goals. Would you be open to connecting sometime next week?`;
  }

  // Recruiter Direct
  const locationSuffix = mode === 'Onsite' || mode === 'Hybrid' ? ' (and am fully aligned with your in-office model)' : '';
  return `I have reviewed the requirements for the ${company} opening${locationSuffix}. Would you have 10–15 minutes available next week for a brief introductory call to discuss if my background aligns with your hiring needs?`;
}

/**
 * Returns a high-signal subject line tailored to the scale, mode, and angle.
 */
function getSubjectLine(
  company: string,
  role: string,
  candidateName: string,
  mode: WorkModeType,
  scale: CompanyScaleType,
  angle: OutreachAngleType
): string {
  const modeTag = mode === 'Remote' ? '[Remote]' : mode === 'Hybrid' ? '[Hybrid]' : '[Onsite]';

  if (angle === 'peer-referral') {
    return `Quick question regarding engineering at ${company} – ${role}`;
  }

  if (angle === 'hiring-manager-technical') {
    if (scale === 'high-comp-product' || scale === 'mnc') {
      return `${role} Application – Distributed Systems & Scalability – ${candidateName} ${modeTag}`;
    }
    return `${role} Application – ${candidateName} ${modeTag}`;
  }

  // Recruiter direct
  if (scale === 'startup') {
    return `Full Stack Engineer (${role}) – High-Agency Builder – ${candidateName}`;
  }
  if (scale === 'service') {
    return `${role} Application – Client Delivery & Cloud Modernization – ${candidateName}`;
  }
  return `${role} Candidate Introduction – ${candidateName} ${modeTag}`;
}

/**
 * Composes a multi-dimensional cold outreach draft on the fly.
 * Completely in-memory: 0ms latency, zero database overhead, 100% offline-ready.
 */
export function composeOutreachEmail(options: ComposableDraftOptions): { subject: string; body: string } {
  const {
    companyName,
    targetRole,
    profile,
    recruiterName
  } = options;

  const company = companyName.trim() || 'the Company';
  const role = targetRole.trim() || 'Software Engineer';
  const candidateName = profile.fullName?.trim() || 'Praveen Kashyap';

  // Normalize Work Mode
  let workMode: WorkModeType = 'Remote';
  if (options.workMode) {
    const wmLower = options.workMode.toLowerCase();
    if (wmLower.includes('hybrid')) workMode = 'Hybrid';
    else if (wmLower.includes('onsite') || wmLower.includes('on-site') || wmLower.includes('office')) workMode = 'Onsite';
    else workMode = 'Remote';
  }

  // Infer or use specified company scale
  const scale = options.companyScale || inferCompanyScale(company);
  const angle = options.outreachAngle || 'recruiter-direct';

  // Salutation
  const rawRec = recruiterName?.trim();
  const greeting = (rawRec && !rawRec.includes('@'))
    ? `Dear ${rawRec},`
    : `Dear ${company} Hiring Team,`;

  // Hooks & Blocks
  const scaleHook = getCompanyScaleHook(scale, company);
  const valueBlock = getCandidateValueBlock(profile, angle, company);
  const modeHook = getWorkModeHook(workMode);
  const portfolioLink = profile.portfolioUrl || profile.githubUrl || 'https://github.com/coder-pro10z';
  const portfolioNote = `You can explore my production architecture write-ups, interactive web builds, and open-source repositories at ${portfolioLink} and GitHub (${profile.githubUrl || 'https://github.com/coder-pro10z'}).`;
  const cta = getCallToAction(angle, company, workMode);
  const signature = assembleSignature(profile);

  // Combine into structured multi-paragraph message
  const bodyParagraphs = [
    greeting,
    scaleHook,
    valueBlock,
    modeHook,
    portfolioNote,
    cta,
    signature
  ];

  const body = bodyParagraphs.join('\n\n');
  const subject = getSubjectLine(company, role, candidateName, workMode, scale, angle);

  return { subject, body };
}
