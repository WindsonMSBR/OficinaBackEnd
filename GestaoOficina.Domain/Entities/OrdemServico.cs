namespace GestaoOficina.Domain.Entities;

public class OrdemServico
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public int ClienteId { get; set; }
    public int VeiculoId { get; set; }
    public string MecanicoResponsavel { get; set; } = string.Empty;
    public DateTime DataAbertura { get; set; } = DateTime.UtcNow;
    public DateTime? DataPrometida { get; set; }
    public string Observacoes { get; set; } = string.Empty;
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = "Aberta";

    public Cliente? Cliente { get; set; }
    public Veiculo? Veiculo { get; set; }
}
