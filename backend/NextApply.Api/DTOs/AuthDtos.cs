using System;

namespace NextApply.Api.DTOs
{
    public class SignUpDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public string TargetDomain { get; set; } = "dual";
        public string? CurrentRole { get; set; }
        public string? Yoe { get; set; }
        public string? KeyStrengths { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? Phone { get; set; }
        public string? FlagshipAchievement { get; set; }
        public string? ResumeSummary { get; set; }
    }

    public class LoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? FullName { get; set; }
        public string? TargetDomain { get; set; }
        public string? CurrentRole { get; set; }
        public string? Yoe { get; set; }
        public string? KeyStrengths { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? Phone { get; set; }
        public string? FlagshipAchievement { get; set; }
        public string? ResumeSummary { get; set; }
    }

    public class UserProfileDto
    {
        public required string Id { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public string TargetDomain { get; set; } = "dual";
        public string? CurrentRole { get; set; }
        public string? Yoe { get; set; }
        public string? KeyStrengths { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? Phone { get; set; }
        public string? FlagshipAchievement { get; set; }
        public string? ResumeSummary { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AuthResponseDto
    {
        public required string Token { get; set; }
        public required UserProfileDto User { get; set; }
    }

    public class PublicUserSummaryDto
    {
        public required string Id { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public string TargetDomain { get; set; } = "dual";
        public string? CurrentRole { get; set; }
    }
}
