export interface LeadSearchConfig {
  personas: Record<string, string[]>;
  cityGeoUrns: Record<string, string>;
  hiringJobTitleIds: Record<string, string>;
}

export const DEFAULT_LEAD_SEARCH_CONFIG: LeadSearchConfig = {
  personas: {
    'Technical Recruiter': ['Technical Recruiter', 'IT Recruiter', 'Talent Acquisition', 'Talent Acquisition Specialist'],
    'Hiring Manager': ['Hiring Manager', 'Engineering Manager', 'Team Lead'],
    'People/Colleague': ['.NET Developer', 'Full Stack Engineer', 'Software Engineer']
  },
  cityGeoUrns: {
    'Noida': '106442238',
    'Hyderabad': '104869687',
    'Bengaluru': '106187582',
    'Delhi': '105556991',
    'Gurugram': '115918471'
  },
  hiringJobTitleIds: {
    '.NET Developer': '4384',
    'Full Stack Developer': '25201',
    'Senior Software Engineer': '39'
  }
};

export interface BuildLinkedInSearchParams {
  personaTitles: string[];
  companyName: string;
  companyUrn?: string;
  cityGeoUrns: string[];
  hiringJobTitleIds?: string[];
}

export function buildLinkedInSearchUrl(params: BuildLinkedInSearchParams): string {
  const { personaTitles, companyName, companyUrn, cityGeoUrns, hiringJobTitleIds } = params;

  // The keywords query includes the company name (if we don't have its URN to facet by)
  // plus the persona titles joined by the OR operator (' | ')
  const keywords = companyUrn
    ? personaTitles.join(' | ')
    : `${companyName} ${personaTitles.join(' | ')}`;

  const search = new URLSearchParams();
  search.set('keywords', keywords);
  search.set('origin', 'FACETED_SEARCH');
  
  if (companyUrn) {
    search.set('currentCompany', JSON.stringify([companyUrn]));
  }
  
  if (cityGeoUrns.length) {
    search.set('geoUrn', JSON.stringify(cityGeoUrns));
  }
  
  if (hiringJobTitleIds && hiringJobTitleIds.length) {
    // '-100' is LinkedIn's placeholder for "Other" unclassified buckets, which is auto-appended
    search.set('activelyHiringForJobTitles', JSON.stringify([...hiringJobTitleIds, '-100']));
  }

  return `https://www.linkedin.com/search/results/people/?${search.toString()}`;
}

