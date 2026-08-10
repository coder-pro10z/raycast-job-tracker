using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NextApply.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "jobs",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    company_name = table.Column<string>(type: "text", nullable: false),
                    target_role = table.Column<string>(type: "text", nullable: true),
                    domain = table.Column<string>(type: "text", nullable: true),
                    location = table.Column<string>(type: "text", nullable: true),
                    work_mode = table.Column<string>(type: "text", nullable: true),
                    application_link = table.Column<string>(type: "text", nullable: true),
                    priority = table.Column<string>(type: "text", nullable: true, defaultValue: "Medium"),
                    application_status = table.Column<string>(type: "text", nullable: true, defaultValue: "Not Started"),
                    next_action = table.Column<string>(type: "text", nullable: true),
                    tech_stack = table.Column<string>(type: "text", nullable: true),
                    career_page_link = table.Column<string>(type: "text", nullable: true),
                    applied_date = table.Column<DateOnly>(type: "date", nullable: true),
                    referral_needed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    referral_contact_name = table.Column<string>(type: "text", nullable: true),
                    hr_recruiter_name = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jobs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "settings",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    full_name = table.Column<string>(type: "text", nullable: true),
                    experience_summary = table.Column<string>(type: "text", nullable: true),
                    key_strengths = table.Column<string>(type: "text", nullable: true),
                    contact_links = table.Column<JsonElement>(type: "jsonb", nullable: true),
                    theme = table.Column<string>(type: "text", nullable: true, defaultValue: "dark"),
                    active_track = table.Column<string>(type: "text", nullable: true, defaultValue: "Dual Domain"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_settings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "notes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    job_id = table.Column<int>(type: "integer", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    note_type = table.Column<string>(type: "text", nullable: true, defaultValue: "General"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notes", x => x.id);
                    table.ForeignKey(
                        name: "FK_notes_jobs_job_id",
                        column: x => x.job_id,
                        principalTable: "jobs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "outreach_templates_used",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    job_id = table.Column<int>(type: "integer", nullable: false),
                    template_name = table.Column<string>(type: "text", nullable: false),
                    channel = table.Column<string>(type: "text", nullable: true),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    recipient_name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_outreach_templates_used", x => x.id);
                    table.ForeignKey(
                        name: "FK_outreach_templates_used_jobs_job_id",
                        column: x => x.job_id,
                        principalTable: "jobs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "idx_jobs_domain",
                table: "jobs",
                column: "domain");

            migrationBuilder.CreateIndex(
                name: "idx_jobs_priority",
                table: "jobs",
                column: "priority");

            migrationBuilder.CreateIndex(
                name: "idx_jobs_status",
                table: "jobs",
                column: "application_status");

            migrationBuilder.CreateIndex(
                name: "IX_notes_job_id",
                table: "notes",
                column: "job_id");

            migrationBuilder.CreateIndex(
                name: "IX_outreach_templates_used_job_id",
                table: "outreach_templates_used",
                column: "job_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "notes");

            migrationBuilder.DropTable(
                name: "outreach_templates_used");

            migrationBuilder.DropTable(
                name: "settings");

            migrationBuilder.DropTable(
                name: "jobs");
        }
    }
}
