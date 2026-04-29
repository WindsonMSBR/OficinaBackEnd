using Microsoft.EntityFrameworkCore;
using GestaoOficina.Domain.Entities;

namespace GestaoOficina.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Veiculo> Veiculos { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuração da tabela Clientes
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).HasColumnType("int").UseMySqlIdentityColumn();
            
            entity.Property(c => c.Nome)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");
                
            entity.Property(c => c.CpfCnpj)
                .IsRequired()
                .HasMaxLength(18)
                .HasColumnType("varchar(18)");
                
            entity.HasIndex(c => c.CpfCnpj).IsUnique();
            
            entity.Property(c => c.Telefone)
                .HasMaxLength(20)
                .HasColumnType("varchar(20)");
                
            entity.Property(c => c.Email)
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");
                
            entity.Property(c => c.Endereco)
                .HasMaxLength(200)
                .HasColumnType("varchar(200)");
                
            entity.Property(c => c.DataCadastro)
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
                
            entity.Property(c => c.Ativo)
                .HasColumnType("tinyint(1)")
                .HasDefaultValue(true);
                
            // Relacionamento com Veículos
            entity.HasMany(c => c.Veiculos)
                .WithOne(v => v.Cliente)
                .HasForeignKey(v => v.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        // Configuração da tabela Veiculos
        modelBuilder.Entity<Veiculo>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.Property(v => v.Id).HasColumnType("int").UseMySqlIdentityColumn();
            
            entity.Property(v => v.Placa)
                .IsRequired()
                .HasMaxLength(8)
                .HasColumnType("varchar(8)");
                
            entity.HasIndex(v => v.Placa).IsUnique();
            
            entity.Property(v => v.Modelo)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnType("varchar(50)");
                
            entity.Property(v => v.Marca)
                .HasMaxLength(50)
                .HasColumnType("varchar(50)");
                
            entity.Property(v => v.Cor)
                .HasMaxLength(20)
                .HasColumnType("varchar(20)");
                
            entity.Property(v => v.Ano)
                .HasColumnType("int");
                
            entity.Property(v => v.KmAtual)
                .HasColumnType("int");
        });
    }
}