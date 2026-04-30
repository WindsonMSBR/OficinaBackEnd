using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestaoOficina.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_OrdensServico_DataAbertura",
                table: "OrdensServico",
                column: "DataAbertura");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensServico_Status",
                table: "OrdensServico",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_Ativo",
                table: "Clientes",
                column: "Ativo");

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_Nome",
                table: "Clientes",
                column: "Nome");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OrdensServico_DataAbertura",
                table: "OrdensServico");

            migrationBuilder.DropIndex(
                name: "IX_OrdensServico_Status",
                table: "OrdensServico");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_Ativo",
                table: "Clientes");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_Nome",
                table: "Clientes");
        }
    }
}
