namespace GestaoOficina.Communication.DTOs;

public class OrdemServicoRequestDto
{
    public int ClienteId { get; set; }
    public int VeiculoId { get; set; }
    public string MecanicoResponsavel { get; set; } = string.Empty;
    public DateTime? DataPrometida { get; set; }
    public string Observacoes { get; set; } = string.Empty;
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = "Aberta";
}

public class OrdemServicoResponseDto
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public int ClienteId { get; set; }
    public string NomeCliente { get; set; } = string.Empty;
    public int VeiculoId { get; set; }
    public string VeiculoDescricao { get; set; } = string.Empty;
    public string Placa { get; set; } = string.Empty;
    public string MecanicoResponsavel { get; set; } = string.Empty;
    public DateTime DataAbertura { get; set; }
    public DateTime? DataPrometida { get; set; }
    public string Observacoes { get; set; } = string.Empty;
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = string.Empty;
}
