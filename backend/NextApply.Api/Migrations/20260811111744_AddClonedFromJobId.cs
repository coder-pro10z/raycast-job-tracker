using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextApply.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClonedFromJobId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClonedFromJobId",
                table: "jobs",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_jobs_ClonedFromJobId",
                table: "jobs",
                column: "ClonedFromJobId");

            migrationBuilder.AddForeignKey(
                name: "FK_jobs_jobs_ClonedFromJobId",
                table: "jobs",
                column: "ClonedFromJobId",
                principalTable: "jobs",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_jobs_jobs_ClonedFromJobId",
                table: "jobs");

            migrationBuilder.DropIndex(
                name: "IX_jobs_ClonedFromJobId",
                table: "jobs");

            migrationBuilder.DropColumn(
                name: "ClonedFromJobId",
                table: "jobs");
        }
    }
}
