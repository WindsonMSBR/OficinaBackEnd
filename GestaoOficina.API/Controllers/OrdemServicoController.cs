using Microsoft.AspNetCore.Mvc;
using GestaoOficina.Communication.DTOs;
using GestaoOficina.Domain.Entities;
using GestaoOficina.Domain.Interfaces;

namespace GestaoOficina.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdemServicoController : ControllerBase
{
    private readonly IOrdemServicoRepository _ordemServicoRepository;
    private readonly IClienteRepository _clienteRepository;
    private readonly IVeiculoRepository _veiculoRepository;

    public OrdemServicoController(
        IOrdemServicoRepository ordemServicoRepository,
        IClienteRepository clienteRepository,
        IVeiculoRepository veiculoRepository)
    {
        _ordemServicoRepository = ordemServicoRepository;
        _clienteRepository = clienteRepository;
        _veiculoRepository = veiculoRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ordens = await _ordemServicoRepository.GetAllAsync();
        return Ok(ordens.Select(ToResponse));
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        (page, pageSize) = NormalizePagination(page, pageSize);
        var (items, totalCount) = await _ordemServicoRepository.GetPagedAsync(search, status, page, pageSize);

        return Ok(new PaginatedResponseDto<OrdemServicoResponseDto>
        {
            Items = items.Select(ToResponse),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = CalculateTotalPages(totalCount, pageSize)
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ordem = await _ordemServicoRepository.GetByIdAsync(id);
        if (ordem == null)
            return NotFound($"Ordem de servico com ID {id} nao encontrada");

        return Ok(ToResponse(ordem));
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<IActionResult> GetByCliente(int clienteId)
    {
        var ordens = await _ordemServicoRepository.GetByClienteIdAsync(clienteId);
        return Ok(ordens.Select(ToResponse));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] OrdemServicoRequestDto request)
    {
        var validationError = await ValidateRequest(request);
        if (validationError != null)
            return validationError;

        var ordem = new OrdemServico
        {
            Numero = $"OS-{DateTime.UtcNow:yyyyMMddHHmmssfff}",
            ClienteId = request.ClienteId,
            VeiculoId = request.VeiculoId,
            MecanicoResponsavel = request.MecanicoResponsavel,
            DataPrometida = ToUtc(request.DataPrometida),
            Observacoes = request.Observacoes,
            ValorTotal = request.ValorTotal,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Aberta" : request.Status,
            DataAbertura = DateTime.UtcNow
        };

        var created = await _ordemServicoRepository.CreateAsync(ordem);
        var fullCreated = await _ordemServicoRepository.GetByIdAsync(created.Id);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToResponse(fullCreated ?? created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] OrdemServicoRequestDto request)
    {
        var ordem = await _ordemServicoRepository.GetByIdAsync(id);
        if (ordem == null)
            return NotFound($"Ordem de servico com ID {id} nao encontrada");

        var validationError = await ValidateRequest(request);
        if (validationError != null)
            return validationError;

        ordem.ClienteId = request.ClienteId;
        ordem.VeiculoId = request.VeiculoId;
        ordem.MecanicoResponsavel = request.MecanicoResponsavel;
        ordem.DataPrometida = ToUtc(request.DataPrometida);
        ordem.Observacoes = request.Observacoes;
        ordem.ValorTotal = request.ValorTotal;
        ordem.Status = string.IsNullOrWhiteSpace(request.Status) ? ordem.Status : request.Status;

        await _ordemServicoRepository.UpdateAsync(ordem);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _ordemServicoRepository.DeleteAsync(id);
        if (!deleted)
            return NotFound($"Ordem de servico com ID {id} nao encontrada");

        return NoContent();
    }

    private async Task<IActionResult?> ValidateRequest(OrdemServicoRequestDto request)
    {
        if (request.ClienteId <= 0)
            return BadRequest("Cliente e obrigatorio");

        if (request.VeiculoId <= 0)
            return BadRequest("Veiculo e obrigatorio");

        var cliente = await _clienteRepository.GetByIdAsync(request.ClienteId);
        if (cliente == null)
            return BadRequest($"Cliente com ID {request.ClienteId} nao encontrado");

        var veiculo = await _veiculoRepository.GetByIdAsync(request.VeiculoId);
        if (veiculo == null)
            return BadRequest($"Veiculo com ID {request.VeiculoId} nao encontrado");

        if (veiculo.ClienteId != request.ClienteId)
            return BadRequest("O veiculo selecionado nao pertence ao cliente informado");

        if (request.ValorTotal < 0)
            return BadRequest("Valor total nao pode ser negativo");

        if (request.MecanicoResponsavel.Length > 100)
            return BadRequest("Mecanico responsavel deve ter no maximo 100 caracteres");

        if (request.Observacoes.Length > 1000)
            return BadRequest("Observacoes devem ter no maximo 1000 caracteres");

        if (request.Status.Length > 40)
            return BadRequest("Status deve ter no maximo 40 caracteres");

        return null;
    }

    private static OrdemServicoResponseDto ToResponse(OrdemServico ordem)
    {
        var veiculoDescricao = ordem.Veiculo == null
            ? string.Empty
            : $"{ordem.Veiculo.Marca} {ordem.Veiculo.Modelo}".Trim();

        return new OrdemServicoResponseDto
        {
            Id = ordem.Id,
            Numero = ordem.Numero,
            ClienteId = ordem.ClienteId,
            NomeCliente = ordem.Cliente?.Nome ?? string.Empty,
            VeiculoId = ordem.VeiculoId,
            VeiculoDescricao = veiculoDescricao,
            Placa = ordem.Veiculo?.Placa ?? string.Empty,
            MecanicoResponsavel = ordem.MecanicoResponsavel,
            DataAbertura = ordem.DataAbertura,
            DataPrometida = ordem.DataPrometida,
            Observacoes = ordem.Observacoes,
            ValorTotal = ordem.ValorTotal,
            Status = ordem.Status
        };
    }

    private static DateTime? ToUtc(DateTime? dateTime)
    {
        if (dateTime == null)
            return null;

        return dateTime.Value.Kind switch
        {
            DateTimeKind.Utc => dateTime.Value,
            DateTimeKind.Local => dateTime.Value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Utc)
        };
    }

    private static (int Page, int PageSize) NormalizePagination(int page, int pageSize)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        return (page, pageSize);
    }

    private static int CalculateTotalPages(int totalCount, int pageSize)
    {
        return totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);
    }
}
