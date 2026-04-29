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
        var response = clientes.Select(c => new ClienteResponseDto
        {
            Id = c.Id,
            Nome = c.Nome,
            CpfCnpj = c.CpfCnpj,
            Telefone = c.Telefone,
            Email = c.Email,
            Endereco = c.Endereco,
            DataCadastro = c.DataCadastro,
            Ativo = c.Ativo,
            QuantidadeVeiculos = c.Veiculos?.Count ?? 0
        });
        
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id);
        if (cliente == null)
            return NotFound($"Cliente com ID {id} não encontrado");
            
        var response = new ClienteResponseDto
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
            
        return Ok(response);
    }
    
    [HttpGet("buscar/{nome}")]
    public async Task<IActionResult> GetByNome(string nome)
    {
        var clientes = await _clienteRepository.GetByNomeAsync(nome);
        var response = clientes.Select(c => new ClienteResponseDto
        {
            Id = c.Id,
            Nome = c.Nome,
            CpfCnpj = c.CpfCnpj,
            Telefone = c.Telefone,
            Email = c.Email,
            Endereco = c.Endereco,
            DataCadastro = c.DataCadastro,
            Ativo = c.Ativo,
            QuantidadeVeiculos = c.Veiculos?.Count ?? 0
        });
        
        return Ok(response);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ClienteRequestDto request)
    {
        // Validação básica
        if (string.IsNullOrWhiteSpace(request.Nome))
            return BadRequest("Nome é obrigatório");
            
        if (string.IsNullOrWhiteSpace(request.CpfCnpj))
            return BadRequest("CPF/CNPJ é obrigatório");
        
        // Verifica se já existe cliente com mesmo CPF/CNPJ
        var existing = await _clienteRepository.GetByCpfCnpjAsync(request.CpfCnpj);
        if (existing != null)
            return Conflict($"Já existe um cliente com o CPF/CNPJ {request.CpfCnpj}");
            
        var cliente = new Cliente
        {
            Nome = request.Nome,
            CpfCnpj = request.CpfCnpj,
            Telefone = request.Telefone,
            Email = request.Email,
            Endereco = request.Endereco,
            DataCadastro = DateTime.Now,
            Ativo = true
        };
        
        var created = await _clienteRepository.CreateAsync(cliente);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ClienteRequestDto request)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id);
        if (cliente == null)
            return NotFound($"Cliente com ID {id} não encontrado");
            
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
            return NotFound($"Cliente com ID {id} não encontrado");
            
        return NoContent();
    }
}
