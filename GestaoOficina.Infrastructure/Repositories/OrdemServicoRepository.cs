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
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .OrderByDescending(o => o.DataAbertura)
            .ToListAsync();
    }

    public async Task<OrdemServico?> GetByIdAsync(int id)
    {
        return await _context.OrdensServico
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<OrdemServico>> GetByClienteIdAsync(int clienteId)
    {
        return await _context.OrdensServico
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
        var ordemServico = await GetByIdAsync(id);
        if (ordemServico == null)
            return false;

        _context.OrdensServico.Remove(ordemServico);
        await _context.SaveChangesAsync();
        return true;
    }
}
