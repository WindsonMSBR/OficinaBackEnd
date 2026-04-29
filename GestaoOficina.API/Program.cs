using Microsoft.EntityFrameworkCore;
using GestaoOficina.Domain.Interfaces;
using GestaoOficina.Infrastructure.Data;
using GestaoOficina.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Adicionar controllers
builder.Services.AddControllers();

// Configurar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔥 Configuração do MySQL - Substitua pela sua senha
var connectionString = builder.Configuration.GetConnectionString("MySQLConnection") 
    ?? "Server=localhost;Database=gestao_oficina;User=root;Password=123456;";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Registrar repositórios (Injeção de Dependência)
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IVeiculoRepository, VeiculoRepository>();

// Configurar CORS para o front-end acessar
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",  // React
                "http://localhost:4200",  // Angular
                "http://localhost:5173",  // Vite
                "http://localhost:8080")  // Vue
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Criar banco de dados se não existir
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.EnsureCreated();
        Console.WriteLine("Banco de dados verificado/criado com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao conectar ao MySQL: {ex.Message}");
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