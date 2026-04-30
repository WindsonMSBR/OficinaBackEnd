using Microsoft.EntityFrameworkCore;
using GestaoOficina.Domain.Entities;

namespace GestaoOficina.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Veiculo> Veiculos { get; set; }
    public DbSet<OrdemServico> OrdensServico { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuração da tabela Clientes
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).ValueGeneratedOnAdd();
            
            entity.Property(c => c.Nome)
                .IsRequired()
                .HasMaxLength(100);
                
            entity.Property(c => c.CpfCnpj)
                .IsRequired()
                .HasMaxLength(18);
                
            entity.HasIndex(c => c.CpfCnpj).IsUnique();
            
            entity.Property(c => c.Telefone)
                .HasMaxLength(20);
                
            entity.Property(c => c.Email)
                .HasMaxLength(100);
                
            entity.Property(c => c.Endereco)
                .HasMaxLength(200);
                
            entity.Property(c => c.DataCadastro)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
                
            entity.Property(c => c.Ativo)
                .HasDefaultValue(true);
                
            // Relacionamento com Veículos
            entity.HasMany(c => c.Veiculos)
                .WithOne(v => v.Cliente)
                .HasForeignKey(v => v.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(c => c.OrdensServico)
                .WithOne(o => o.Cliente)
                .HasForeignKey(o => o.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        // Configuração da tabela Veiculos
        modelBuilder.Entity<Veiculo>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.Property(v => v.Id).ValueGeneratedOnAdd();
            
            entity.Property(v => v.Placa)
                .IsRequired()
                .HasMaxLength(8);
                
            entity.HasIndex(v => v.Placa).IsUnique();
            
            entity.Property(v => v.Modelo)
                .IsRequired()
                .HasMaxLength(50);
                
            entity.Property(v => v.Marca)
                .HasMaxLength(50);
                
            entity.Property(v => v.Cor)
                .HasMaxLength(20);

            entity.HasMany(v => v.OrdensServico)
                .WithOne(o => o.Veiculo)
                .HasForeignKey(o => o.VeiculoId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<OrdemServico>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.Id).ValueGeneratedOnAdd();

            entity.Property(o => o.Numero)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasIndex(o => o.Numero).IsUnique();

            entity.Property(o => o.MecanicoResponsavel)
                .HasMaxLength(100);

            entity.Property(o => o.Observacoes)
                .HasMaxLength(1000);

            entity.Property(o => o.Status)
                .IsRequired()
                .HasMaxLength(40)
                .HasDefaultValue("Aberta");

            entity.Property(o => o.DataAbertura)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(o => o.ValorTotal)
                .HasPrecision(12, 2);
        });
    }
}
