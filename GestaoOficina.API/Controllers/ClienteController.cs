using Microsoft.AspNetCore.Mvc;
using GestaoOficina.Domain.Interfaces;
using GestaoOficina.Domain.Entities;
using GestaoOficina.Communication.DTOs;

namespace GestaoOficina.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClienteController : ControllerBase
{
    private readonly IClienteRepository _clienteRepository;

    public ClienteController(IClienteRepository clienteRepository)
    {
        _clienteRepository = clienteRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var clientes = await _clienteRepository.GetAllAsync();
        return Ok(clientes.Select(ToResponse));
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        (page, pageSize) = NormalizePagination(page, pageSize);
        var (items, totalCount) = await _clienteRepository.GetPagedAsync(search, page, pageSize);

        return Ok(new PaginatedResponseDto<ClienteResponseDto>
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
        var cliente = await _clienteRepository.GetByIdAsync(id);
        if (cliente == null)
            return NotFound($"Cliente com ID {id} nao encontrado");

        return Ok(ToResponse(cliente));
    }

    [HttpGet("buscar/{nome}")]
    public async Task<IActionResult> GetByNome(string nome)
    {
        var clientes = await _clienteRepository.GetByNomeAsync(nome);
        return Ok(clientes.Select(ToResponse));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ClienteRequestDto request)
    {
        var validationError = await ValidateRequest(request);
        if (validationError != null)
            return validationError;

        var cliente = new Cliente
        {
            Nome = request.Nome,
            CpfCnpj = request.CpfCnpj,
            Telefone = request.Telefone,
            Email = request.Email,
            Endereco = request.Endereco,
            DataCadastro = DateTime.UtcNow,
            Ativo = true
        };

        var created = await _clienteRepository.CreateAsync(cliente);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToResponse(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ClienteRequestDto request)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id);
        if (cliente == null)
            return NotFound($"Cliente com ID {id} nao encontrado");

        var validationError = await ValidateRequest(request, id);
        if (validationError != null)
            return validationError;

        cliente.Nome = request.Nome;
        cliente.CpfCnpj = request.CpfCnpj;
        cliente.Telefone = request.Telefone;
        cliente.Email = request.Email;
        cliente.Endereco = request.Endereco;

        await _clienteRepository.UpdateAsync(cliente);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _clienteRepository.DeleteAsync(id);
        if (!deleted)
            return NotFound($"Cliente com ID {id} nao encontrado");

        return NoContent();
    }

    private async Task<IActionResult?> ValidateRequest(ClienteRequestDto request, int? currentId = null)
    {
        if (string.IsNullOrWhiteSpace(request.Nome))
            return BadRequest("Nome e obrigatorio");

        if (string.IsNullOrWhiteSpace(request.CpfCnpj))
            return BadRequest("CPF/CNPJ e obrigatorio");

        if (request.Nome.Length > 100)
            return BadRequest("Nome deve ter no maximo 100 caracteres");

        if (request.CpfCnpj.Length > 18)
            return BadRequest("CPF/CNPJ deve ter no maximo 18 caracteres");

        if (request.Telefone.Length > 20)
            return BadRequest("Telefone deve ter no maximo 20 caracteres");

        if (request.Email.Length > 100)
            return BadRequest("Email deve ter no maximo 100 caracteres");

        if (request.Endereco.Length > 200)
            return BadRequest("Endereco deve ter no maximo 200 caracteres");

        var existing = await _clienteRepository.GetByCpfCnpjAsync(request.CpfCnpj);
        if (existing != null && existing.Id != currentId)
            return Conflict($"Ja existe um cliente com o CPF/CNPJ {request.CpfCnpj}");

        return null;
    }

    private static ClienteResponseDto ToResponse(Cliente cliente)
    {
        return new ClienteResponseDto
        {
            Id = cliente.Id,
            Nome = cliente.Nome,
            CpfCnpj = cliente.CpfCnpj,
            Telefone = cliente.Telefone,
            Email = cliente.Email,
            Endereco = cliente.Endereco,
            DataCadastro = cliente.DataCadastro,
            Ativo = cliente.Ativo,
            QuantidadeVeiculos = cliente.Veiculos?.Count ?? 0
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
