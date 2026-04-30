using Microsoft.AspNetCore.Mvc;
using GestaoOficina.Domain.Interfaces;
using GestaoOficina.Domain.Entities;
using GestaoOficina.Communication.DTOs;

namespace GestaoOficina.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VeiculoController : ControllerBase
{
    private readonly IVeiculoRepository _veiculoRepository;
    private readonly IClienteRepository _clienteRepository;
    private readonly IOrdemServicoRepository _ordemServicoRepository;

    public VeiculoController(
        IVeiculoRepository veiculoRepository,
        IClienteRepository clienteRepository,
        IOrdemServicoRepository ordemServicoRepository)
    {
        _veiculoRepository = veiculoRepository;
        _clienteRepository = clienteRepository;
        _ordemServicoRepository = ordemServicoRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var veiculos = await _veiculoRepository.GetAllAsync();
        return Ok(veiculos.Select(ToResponse));
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        (page, pageSize) = NormalizePagination(page, pageSize);
        var (items, totalCount) = await _veiculoRepository.GetPagedAsync(search, page, pageSize);

        return Ok(new PaginatedResponseDto<VeiculoResponseDto>
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
        var veiculo = await _veiculoRepository.GetByIdAsync(id);
        if (veiculo == null)
            return NotFound($"Veiculo com ID {id} nao encontrado");

        return Ok(ToResponse(veiculo));
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<IActionResult> GetByCliente(int clienteId)
    {
        var veiculos = await _veiculoRepository.GetByClienteIdAsync(clienteId);
        return Ok(veiculos.Select(ToResponse));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] VeiculoRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Placa))
            return BadRequest("Placa e obrigatoria");

        if (string.IsNullOrWhiteSpace(request.Modelo))
            return BadRequest("Modelo e obrigatorio");

        var validationError = ValidateRequest(request);
        if (validationError != null)
            return validationError;

        var cliente = await _clienteRepository.GetByIdAsync(request.ClienteId);
        if (cliente == null)
            return BadRequest($"Cliente com ID {request.ClienteId} nao encontrado");

        var placa = request.Placa.ToUpper();
        var veiculosComPlaca = await _veiculoRepository.GetByPlacaAsync(placa);
        if (veiculosComPlaca.Any(v => v.Placa.Equals(placa, StringComparison.OrdinalIgnoreCase)))
            return Conflict($"Ja existe um veiculo com a placa {placa}");

        var veiculo = new Veiculo
        {
            Placa = placa,
            Modelo = request.Modelo,
            Marca = request.Marca,
            Cor = request.Cor,
            Ano = request.Ano,
            KmAtual = request.KmAtual,
            ClienteId = request.ClienteId
        };

        var created = await _veiculoRepository.CreateAsync(veiculo);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToResponse(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] VeiculoRequestDto request)
    {
        var veiculo = await _veiculoRepository.GetByIdAsync(id);
        if (veiculo == null)
            return NotFound($"Veiculo com ID {id} nao encontrado");

        if (string.IsNullOrWhiteSpace(request.Placa))
            return BadRequest("Placa e obrigatoria");

        if (string.IsNullOrWhiteSpace(request.Modelo))
            return BadRequest("Modelo e obrigatorio");

        var validationError = ValidateRequest(request);
        if (validationError != null)
            return validationError;

        var cliente = await _clienteRepository.GetByIdAsync(request.ClienteId);
        if (cliente == null)
            return BadRequest($"Cliente com ID {request.ClienteId} nao encontrado");

        var placa = request.Placa.ToUpper();
        var veiculosComPlaca = await _veiculoRepository.GetByPlacaAsync(placa);
        if (veiculosComPlaca.Any(v => v.Id != id && v.Placa.Equals(placa, StringComparison.OrdinalIgnoreCase)))
            return Conflict($"Ja existe outro veiculo com a placa {placa}");

        veiculo.Placa = placa;
        veiculo.Modelo = request.Modelo;
        veiculo.Marca = request.Marca;
        veiculo.Cor = request.Cor;
        veiculo.Ano = request.Ano;
        veiculo.KmAtual = request.KmAtual;
        veiculo.ClienteId = request.ClienteId;

        await _veiculoRepository.UpdateAsync(veiculo);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var veiculo = await _veiculoRepository.GetByIdAsync(id);
        if (veiculo == null)
            return NotFound($"Veiculo com ID {id} nao encontrado");

        var ordens = await _ordemServicoRepository.GetByClienteIdAsync(veiculo.ClienteId);
        if (ordens.Any(o => o.VeiculoId == id))
            return Conflict("Nao e possivel excluir este veiculo porque existem ordens de servico vinculadas a ele.");

        await _veiculoRepository.DeleteAsync(id);
        return NoContent();
    }

    private static VeiculoResponseDto ToResponse(Veiculo veiculo)
    {
        return new VeiculoResponseDto
        {
            Id = veiculo.Id,
            Placa = veiculo.Placa,
            Modelo = veiculo.Modelo,
            Marca = veiculo.Marca,
            Cor = veiculo.Cor,
            Ano = veiculo.Ano,
            KmAtual = veiculo.KmAtual,
            ClienteId = veiculo.ClienteId,
            NomeCliente = veiculo.Cliente?.Nome ?? string.Empty
        };
    }

    private static IActionResult? ValidateRequest(VeiculoRequestDto request)
    {
        if (request.Placa.Length > 8)
            return new BadRequestObjectResult("Placa deve ter no maximo 8 caracteres");

        if (request.Modelo.Length > 50)
            return new BadRequestObjectResult("Modelo deve ter no maximo 50 caracteres");

        if (request.Marca.Length > 50)
            return new BadRequestObjectResult("Marca deve ter no maximo 50 caracteres");

        if (request.Cor.Length > 20)
            return new BadRequestObjectResult("Cor deve ter no maximo 20 caracteres");

        return null;
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
