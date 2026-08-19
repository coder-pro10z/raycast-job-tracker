using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextApply.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingJobFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "follow_up_date",
                table: "jobs",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "hr_recruiter_email",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "hr_recruiter_linkedin",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "hr_recruiter_phone",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "referral_contact_email",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "referral_contact_linkedin",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "referral_contact_role",
                table: "jobs",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "follow_up_date",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "hr_recruiter_email",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "hr_recruiter_linkedin",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "hr_recruiter_phone",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "referral_contact_email",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "referral_contact_linkedin",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "referral_contact_role",
                table: "jobs");
        }
    }
}
