using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextApply.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddJobApplicationImportFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AutomatorStatus",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GmailDraftId",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OutreachBodyPreview",
                table: "jobs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OutreachSubject",
                table: "jobs",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutomatorStatus",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "GmailDraftId",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "OutreachBodyPreview",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "OutreachSubject",
                table: "jobs");
        }
    }
}
