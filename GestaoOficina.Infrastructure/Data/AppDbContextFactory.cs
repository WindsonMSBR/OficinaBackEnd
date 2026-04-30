using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GestaoOficina.Infrastructure.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("GESTAOOFICINA_DB")
            ?? ReadConnectionStringFromApiSettings();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.CommandTimeout(60);
                npgsqlOptions.EnableRetryOnFailure(3);
            })
            .Options;

        return new AppDbContext(options);
    }

    private static string ReadConnectionStringFromApiSettings()
    {
        var settingsPath = Path.GetFullPath(Path.Combine(
            AppContext.BaseDirectory,
            "..",
            "..",
            "..",
            "..",
            "GestaoOficina.API",
            "appsettings.json"));

        using var stream = File.OpenRead(settingsPath);
        using var document = JsonDocument.Parse(stream);

        return document.RootElement
            .GetProperty("ConnectionStrings")
            .GetProperty("PostgreSQLConnection")
            .GetString()
            ?? throw new InvalidOperationException("Connection string PostgreSQLConnection nao encontrada.");
    }
}
