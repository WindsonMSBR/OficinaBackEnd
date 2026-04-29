using Microsoft.EntityFrameworkCore;
using GestaoOficina.Domain.Entities;
using GestaoOficina.Domain.Interfaces;
using GestaoOficina.Infrastructure.Data;

namespace GestaoOficina.Infrastructure.Repositories;

public class VeiculoRepository : IVeiculoRepository
{
    private readonly AppDbContext _context;
    
    public VeiculoRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Veiculo>> GetAllAsync()
    {
        return await _context.Veiculos
            .Include(v => v.Cliente)
            .ToListAsync();
    }
    
    public async Task<Veiculo?> GetByIdAsync(int id)
    {
        return await _context.Veiculos
            .Include(v => v.Cliente)
            .FirstOrDefaultAsync(v => v.Id == id);
    }
    
    public async Task<IEnumerable<Veiculo>> GetByPlacaAsync(string placa)
    {
        return await _context.Veiculos
            .Where(v => v.Placa.Contains(placa))
            .Include(v => v.Cliente)
            .ToListAsync();
    }
    
    public async Task<IEnumerable<Veiculo>> GetByClienteIdAsync(int clienteId)
    {
        return await _context.Veiculos
            .Where(v => v.ClienteId == clienteId)
            .Include(v => v.Cliente)
            .ToListAsync();
    }
    
    public async Task<Veiculo> CreateAsync(Veiculo veiculo)
    {
        _context.Veiculos.Add(veiculo);
        await _context.SaveChangesAsync();
        return veiculo;
    }
    
    public async Task<Veiculo> UpdateAsync(Veiculo veiculo)
    {
        _context.Veiculos.Update(veiculo);
        await _context.SaveChangesAsync();
        return veiculo;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        var veiculo = await GetByIdAsync(id);
        if (veiculo == null)
            return false;
            
        _context.Veiculos.Remove(veiculo);
        await _context.SaveChangesAsync();
        return true;
    }
}
