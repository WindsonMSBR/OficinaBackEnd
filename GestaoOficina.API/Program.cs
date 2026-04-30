using Microsoft.EntityFrameworkCore;
using GestaoOficina.Domain.Interfaces;
using GestaoOficina.Infrastructure.Data;
using GestaoOficina.Infrastructure.Repositories;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Adicionar controllers
builder.Services.AddControllers();

// Configurar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔥 Configuração do PostgreSQL com Supabase
var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        // Timeout maior para conexões remotas
        npgsqlOptions.CommandTimeout(60);
        // Enable retry on failure (recomendado para banco em nuvem)
        npgsqlOptions.EnableRetryOnFailure(3);
    }));
// Registrar repositórios (Injeção de Dependência)
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IVeiculoRepository, VeiculoRepository>();
builder.Services.AddScoped<IOrdemServicoRepository, OrdemServicoRepository>();

// Configurar CORS para o front-end acessar
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",  // React
                "http://localhost:4200",  // Angular
                "http://localhost:5173",  // Vite/Vue
                "http://127.0.0.1:5173")  // Vite local
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Aplicar migrations pendentes no banco de dados.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        await dbContext.Database.MigrateAsync();
        Console.WriteLine("Banco de dados verificado/migrado com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao conectar/migrar o PostgreSQL: {ex.Message}");
        throw;
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
