using System.Collections.Generic;

namespace GestaoOficina.Domain.Entities;

public class Veiculo
{
    public int Id { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
    public int Ano { get; set; }
    public int KmAtual { get; set; }
    public int ClienteId { get; set; }
    
    // Relacionamento: um veículo pertence a um cliente
    public Cliente? Cliente { get; set; }
    public ICollection<OrdemServico> OrdensServico { get; set; } = new List<OrdemServico>();
}
