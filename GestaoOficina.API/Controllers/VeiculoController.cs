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
    
    public VeiculoController(IVeiculoRepository veiculoRepository, IClienteRepository clienteRepository)
    {
        _veiculoRepository = veiculoRepository;
        _clienteRepository = clienteRepository;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var veiculos = await _veiculoRepository.GetAllAsync();
        var response = veiculos.Select(v => new VeiculoResponseDto
        {
            Id = v.Id,
            Placa = v.Placa,
            Modelo = v.Modelo,
            Marca = v.Marca,
            Cor = v.Cor,
            Ano = v.Ano,
            KmAtual = v.KmAtual,
            ClienteId = v.ClienteId,
            NomeCliente = v.Cliente?.Nome ?? string.Empty
        });
        
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var veiculo = await _veiculoRepository.GetByIdAsync(id);
        if (veiculo == null)
            return NotFound($"Veículo com ID {id} não encontrado");
            
        var response = new VeiculoResponseDto
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
            
        return Ok(response);
    }
    
    [HttpGet("cliente/{clienteId}")]
    public async Task<IActionResult> GetByCliente(int clienteId)
    {
        var veiculos = await _veiculoRepository.GetByClienteIdAsync(clienteId);
        var response = veiculos.Select(v => new VeiculoResponseDto
        {
            Id = v.Id,
            Placa = v.Placa,
            Modelo = v.Modelo,
            Marca = v.Marca,
            Cor = v.Cor,
            Ano = v.Ano,
            KmAtual = v.KmAtual,
            ClienteId = v.ClienteId,
            NomeCliente = v.Cliente?.Nome ?? string.Empty
        });
        
        return Ok(response);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] VeiculoRequestDto request)
    {
        // Validações
        if (string.IsNullOrWhiteSpace(request.Placa))
            return BadRequest("Placa é obrigatória");
            
        if (string.IsNullOrWhiteSpace(request.Modelo))
            return BadRequest("Modelo é obrigatório");
            
        // Verifica se o cliente existe
        var cliente = await _clienteRepository.GetByIdAsync(request.ClienteId);
        if (cliente == null)
            return BadRequest($"Cliente com ID {request.ClienteId} não encontrado");
            
        var veiculo = new Veiculo
        {
            Placa = request.Placa.ToUpper(),
            Modelo = request.Modelo,
            Marca = request.Marca,
            Cor = request.Cor,
            Ano = request.Ano,
            KmAtual = request.KmAtual,
            ClienteId = request.ClienteId
        };
        
        var created = await _veiculoRepository.CreateAsync(veiculo);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] VeiculoRequestDto request)
    {
        var veiculo = await _veiculoRepository.GetByIdAsync(id);
        if (veiculo == null)
            return NotFound($"Veículo com ID {id} não encontrado");
            
        // Verifica se o cliente existe
        var cliente = await _clienteRepository.GetByIdAsync(request.ClienteId);
        if (cliente == null)
            return BadRequest($"Cliente com ID {request.ClienteId} não encontrado");
            
        veiculo.Placa = request.Placa.ToUpper();
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
        var deleted = await _veiculoRepository.DeleteAsync(id);
        if (!deleted)
            return NotFound($"Veículo com ID {id} não encontrado");
            
        return NoContent();
    }
}