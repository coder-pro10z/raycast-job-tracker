export interface LeadSearchConfig {
  personas: Record<string, string[]>;
  roleKeywords: string[];
  defaultCities: string[];
}

export const DEFAULT_LEAD_SEARCH_CONFIG: LeadSearchConfig = {
  personas: {
    'Technical Recruiter': ['Technical Recruiter', 'IT Recruiter', 'Talent Acquisition', 'Talent Acquisition Specialist'],
    'Hiring Manager': ['Hiring Manager', 'Engineering Manager', 'Team Lead', 'Delivery Manager'],
    'People/Colleague': ['.NET Developer', 'Full Stack Engineer', 'Software Engineer']
  },
  roleKeywords: ['.NET', 'Full Stack', 'ASP.NET Core', 'C#'],
  defaultCities: ['Noida', 'Delhi', 'Gurgaon', 'Bangalore', 'Hyderabad', 'Pune']
};

const METRO_CLUSTERS: Record<string, string[]> = {
  Noida: ['Noida', 'Delhi', 'Gurgaon'],
  Delhi: ['Delhi', 'Noida', 'Gurgaon'],
  Gurgaon: ['Gurgaon', 'Delhi', 'Noida'],
  Bangalore: ['Bangalore', 'Bengaluru'],
  Hyderabad: ['Hyderabad'],
  Pune: ['Pune'],
};

export function buildLinkedInSearchUrl(
  companyName: string,
  persona: string,
  jobLocation: string | null | undefined,
  config: LeadSearchConfig = DEFAULT_LEAD_SEARCH_CONFIG
): string {
  const personaTerms = config.personas[persona] || [persona];
  const cities = getCitiesForLocation(jobLocation, config.defaultCities);

  const parts = [
    `"${companyName}"`,
    `(${personaTerms.map(t => `"${t}"`).join(' OR ')})`,
  ];

  // For recruiter/hiring-manager personas, also require role relevance.
  // For People/Colleague, personaTerms ARE the role keywords already.
  if (persona !== 'People/Colleague') {
    parts.push(`(${config.roleKeywords.map(k => `"${k}"`).join(' OR ')})`);
  }

  parts.push(`(${cities.map(c => `"${c}"`).join(' OR ')})`);

  const query = parts.join(' AND ');
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
}

function getCitiesForLocation(location: string | null | undefined, defaultCities: string[]): string[] {
  if (!location) return defaultCities;
  
  // Try to match the location to a known cluster
  for (const [key, cluster] of Object.entries(METRO_CLUSTERS)) {
    if (location.toLowerCase().includes(key.toLowerCase())) {
      return cluster;
    }
  }
  
  // If it's a specific location not in our clusters, use it as the only city
  if (location !== 'Remote' && location !== 'Unknown') {
    return [location];
  }
  
  return defaultCities;
}
