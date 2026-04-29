using Microsoft.EntityFrameworkCore;
using GestaoOficina.Domain.Entities;
using GestaoOficina.Domain.Interfaces;
using GestaoOficina.Infrastructure.Data;

namespace GestaoOficina.Infrastructure.Repositories;

public class ClienteRepository : IClienteRepository
{
    private readonly AppDbContext _context;
    
    public ClienteRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Cliente>> GetAllAsync()
    {
        return await _context.Clientes
            .Include(c => c.Veiculos)
            .ToListAsync();
    }
    
    public async Task<Cliente?> GetByIdAsync(int id)
    {
        return await _context.Clientes
            .Include(c => c.Veiculos)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
    
    public async Task<IEnumerable<Cliente>> GetByNomeAsync(string nome)
    {
        return await _context.Clientes
            .Where(c => c.Nome.Contains(nome))
            .Include(c => c.Veiculos)
            .ToListAsync();
    }
    
    public async Task<Cliente?> GetByCpfCnpjAsync(string cpfCnpj)
    {
        return await _context.Clientes
            .FirstOrDefaultAsync(c => c.CpfCnpj == cpfCnpj);
    }
    
    public async Task<Cliente> CreateAsync(Cliente cliente)
    {
        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();
        return cliente;
    }
    
    public async Task<Cliente> UpdateAsync(Cliente cliente)
    {
        _context.Clientes.Update(cliente);
        await _context.SaveChangesAsync();
        return cliente;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        var cliente = await GetByIdAsync(id);
        if (cliente == null)
            return false;
        
        // Soft delete (apenas marca como inativo)
        cliente.Ativo = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
