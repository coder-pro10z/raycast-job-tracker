using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NextApply.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAuthAndProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "user_id",
                table: "notes",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "user_profiles",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    full_name = table.Column<string>(type: "text", nullable: false),
                    target_domain = table.Column<string>(type: "text", nullable: false, defaultValue: "dual"),
                    current_role = table.Column<string>(type: "text", nullable: true),
                    yoe = table.Column<string>(type: "text", nullable: true),
                    key_strengths = table.Column<string>(type: "text", nullable: true),
                    linkedin_url = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true),
                    resume_summary = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_profiles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user_job_states",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    job_id = table.Column<int>(type: "integer", nullable: false),
                    application_status = table.Column<string>(type: "text", nullable: false, defaultValue: "Not Started"),
                    priority = table.Column<string>(type: "text", nullable: false, defaultValue: "Medium"),
                    next_action = table.Column<string>(type: "text", nullable: true),
                    applied_date = table.Column<DateOnly>(type: "date", nullable: true),
                    follow_up_date = table.Column<DateOnly>(type: "date", nullable: true),
                    referral_needed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    referral_contact_name = table.Column<string>(type: "text", nullable: true),
                    referral_contact_role = table.Column<string>(type: "text", nullable: true),
                    referral_contact_email = table.Column<string>(type: "text", nullable: true),
                    referral_contact_linkedin = table.Column<string>(type: "text", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_job_states", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_job_states_jobs_job_id",
                        column: x => x.job_id,
                        principalTable: "jobs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_job_states_user_profiles_user_id",
                        column: x => x.user_id,
                        principalTable: "user_profiles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_notes_user_id",
                table: "notes",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "idx_user_job_states_status",
                table: "user_job_states",
                column: "application_status");

            migrationBuilder.CreateIndex(
                name: "idx_user_job_states_user",
                table: "user_job_states",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "idx_user_job_states_user_job",
                table: "user_job_states",
                columns: new[] { "user_id", "job_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_job_states_job_id",
                table: "user_job_states",
                column: "job_id");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_email",
                table: "user_profiles",
                column: "email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_notes_user_profiles_user_id",
                table: "notes",
                column: "user_id",
                principalTable: "user_profiles",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_notes_user_profiles_user_id",
                table: "notes");

            migrationBuilder.DropTable(
                name: "user_job_states");

            migrationBuilder.DropTable(
                name: "user_profiles");

            migrationBuilder.DropIndex(
                name: "IX_notes_user_id",
                table: "notes");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "notes");
        }
    }
}
