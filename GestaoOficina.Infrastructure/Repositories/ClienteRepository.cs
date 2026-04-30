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
            .AsNoTracking()
            .Where(c => c.Ativo)
            .Include(c => c.Veiculos)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Cliente> Items, int TotalCount)> GetPagedAsync(string? search, int page, int pageSize)
    {
        var query = _context.Clientes
            .AsNoTracking()
            .Where(c => c.Ativo);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(c =>
                c.Nome.Contains(term) ||
                c.CpfCnpj.Contains(term) ||
                c.Telefone.Contains(term) ||
                c.Email.Contains(term));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Include(c => c.Veiculos)
            .OrderBy(c => c.Nome)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
    
    public async Task<Cliente?> GetByIdAsync(int id)
    {
        return await _context.Clientes
            .AsNoTracking()
            .Include(c => c.Veiculos)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
    
    public async Task<IEnumerable<Cliente>> GetByNomeAsync(string nome)
    {
        return await _context.Clientes
            .AsNoTracking()
            .Where(c => c.Ativo && c.Nome.Contains(nome))
            .Include(c => c.Veiculos)
            .ToListAsync();
    }
    
    public async Task<Cliente?> GetByCpfCnpjAsync(string cpfCnpj)
    {
        return await _context.Clientes
            .AsNoTracking()
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
        var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);
        if (cliente == null)
            return false;
        
        // Soft delete (apenas marca como inativo)
        cliente.Ativo = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
