export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string;
  targetDomain: 'sde' | 'cloud' | 'dual' | string;
  currentRole?: string;
  yoe?: string;
  keyStrengths?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  phone?: string;
  flagshipAchievement?: string;
  resumeSummary?: string;
  createdAt?: string;
}

export interface PublicUserSummary {
  id: string;
  email: string;
  fullName: string;
  targetDomain: string;
  currentRole?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfileDto;
}
