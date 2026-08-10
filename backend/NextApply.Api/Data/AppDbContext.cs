using Microsoft.EntityFrameworkCore;
using NextApply.Api.Models;

namespace NextApply.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Job> Jobs { get; set; } = null!;
        public DbSet<Note> Notes { get; set; } = null!;
        public DbSet<OutreachTemplateUsed> OutreachTemplatesUsed { get; set; } = null!;
        public DbSet<Settings> Settings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Job Configurations
            modelBuilder.Entity<Job>(entity =>
            {
                entity.ToTable("jobs");
                entity.HasKey(e => e.Id);
                
                // Npgsql snake_case mapping conventions can be handled globally,
                // but we map the table names explicitly here to match the schema
                
                // Property column mappings
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CompanyName).HasColumnName("company_name").IsRequired();
                entity.Property(e => e.TargetRole).HasColumnName("target_role");
                entity.Property(e => e.Domain).HasColumnName("domain");
                entity.Property(e => e.Location).HasColumnName("location");
                entity.Property(e => e.WorkMode).HasColumnName("work_mode");
                entity.Property(e => e.ApplicationLink).HasColumnName("application_link");
                entity.Property(e => e.Priority).HasColumnName("priority").HasDefaultValue("Medium");
                entity.Property(e => e.ApplicationStatus).HasColumnName("application_status").HasDefaultValue("Not Started");
                entity.Property(e => e.NextAction).HasColumnName("next_action");
                entity.Property(e => e.TechStack).HasColumnName("tech_stack");
                entity.Property(e => e.CareerPageLink).HasColumnName("career_page_link");
                entity.Property(e => e.AppliedDate).HasColumnName("applied_date");
                entity.Property(e => e.ReferralNeeded).HasColumnName("referral_needed").HasDefaultValue(false);
                entity.Property(e => e.ReferralContactName).HasColumnName("referral_contact_name");
                entity.Property(e => e.HrRecruiterName).HasColumnName("hr_recruiter_name");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("now()");

                // Indexes matching schema
                entity.HasIndex(e => e.ApplicationStatus).HasDatabaseName("idx_jobs_status");
                entity.HasIndex(e => e.Priority).HasDatabaseName("idx_jobs_priority");
                entity.HasIndex(e => e.Domain).HasDatabaseName("idx_jobs_domain");
            });

            // Note Configurations
            modelBuilder.Entity<Note>(entity =>
            {
                entity.ToTable("notes");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.JobId).HasColumnName("job_id");
                entity.Property(e => e.Content).HasColumnName("content").IsRequired();
                entity.Property(e => e.NoteType).HasColumnName("note_type").HasDefaultValue("General");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");

                entity.HasOne(e => e.Job)
                    .WithMany(j => j.Notes)
                    .HasForeignKey(e => e.JobId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // OutreachTemplateUsed Configurations
            modelBuilder.Entity<OutreachTemplateUsed>(entity =>
            {
                entity.ToTable("outreach_templates_used");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.JobId).HasColumnName("job_id");
                entity.Property(e => e.TemplateName).HasColumnName("template_name").IsRequired();
                entity.Property(e => e.Channel).HasColumnName("channel");
                entity.Property(e => e.SentAt).HasColumnName("sent_at").HasDefaultValueSql("now()");
                entity.Property(e => e.RecipientName).HasColumnName("recipient_name");

                entity.HasOne(e => e.Job)
                    .WithMany(j => j.OutreachTemplatesUsed)
                    .HasForeignKey(e => e.JobId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Settings Configurations
            modelBuilder.Entity<Settings>(entity =>
            {
                entity.ToTable("settings");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.FullName).HasColumnName("full_name");
                entity.Property(e => e.ExperienceSummary).HasColumnName("experience_summary");
                entity.Property(e => e.KeyStrengths).HasColumnName("key_strengths");
                entity.Property(e => e.ContactLinks).HasColumnName("contact_links").HasColumnType("jsonb");
                entity.Property(e => e.Theme).HasColumnName("theme").HasDefaultValue("dark");
                entity.Property(e => e.ActiveTrack).HasColumnName("active_track").HasDefaultValue("Dual Domain");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("now()");
            });
        }
    }
}
