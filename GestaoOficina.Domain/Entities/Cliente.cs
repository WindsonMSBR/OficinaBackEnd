using System;
using System.Collections.Generic;

namespace GestaoOficina.Domain.Entities;

public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CpfCnpj { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public DateTime DataCadastro { get; set; } = DateTime.Now;
    public bool Ativo { get; set; } = true;
    
    // Relacionamento: um cliente pode ter vários veículos
    public ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
}