using Microsoft.EntityFrameworkCore;
using GestaoOficina.Domain.Entities;
using GestaoOficina.Domain.Interfaces;
using GestaoOficina.Infrastructure.Data;

namespace GestaoOficina.Infrastructure.Repositories;

public class OrdemServicoRepository : IOrdemServicoRepository
{
    private readonly AppDbContext _context;

    public OrdemServicoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrdemServico>> GetAllAsync()
    {
        return await _context.OrdensServico
            .AsNoTracking()
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .OrderByDescending(o => o.DataAbertura)
            .ToListAsync();
    }

    public async Task<(IEnumerable<OrdemServico> Items, int TotalCount)> GetPagedAsync(string? search, string? status, int page, int pageSize)
    {
        var query = _context.OrdensServico
            .AsNoTracking()
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("todos", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(o => o.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(o =>
                o.Numero.Contains(term) ||
                o.MecanicoResponsavel.Contains(term) ||
                o.Status.Contains(term) ||
                (o.Cliente != null && o.Cliente.Nome.Contains(term)) ||
                (o.Veiculo != null && (
                    o.Veiculo.Placa.Contains(term) ||
                    o.Veiculo.Modelo.Contains(term) ||
                    o.Veiculo.Marca.Contains(term))));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(o => o.DataAbertura)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<OrdemServico?> GetByIdAsync(int id)
    {
        return await _context.OrdensServico
            .AsNoTracking()
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<OrdemServico>> GetByClienteIdAsync(int clienteId)
    {
        return await _context.OrdensServico
            .AsNoTracking()
            .Where(o => o.ClienteId == clienteId)
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .OrderByDescending(o => o.DataAbertura)
            .ToListAsync();
    }

    public async Task<OrdemServico> CreateAsync(OrdemServico ordemServico)
    {
        _context.OrdensServico.Add(ordemServico);
        await _context.SaveChangesAsync();
        return ordemServico;
    }

    public async Task<OrdemServico> UpdateAsync(OrdemServico ordemServico)
    {
        _context.OrdensServico.Update(ordemServico);
        await _context.SaveChangesAsync();
        return ordemServico;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var ordemServico = await _context.OrdensServico.FirstOrDefaultAsync(o => o.Id == id);
        if (ordemServico == null)
            return false;

        _context.OrdensServico.Remove(ordemServico);
        await _context.SaveChangesAsync();
        return true;
    }
}
