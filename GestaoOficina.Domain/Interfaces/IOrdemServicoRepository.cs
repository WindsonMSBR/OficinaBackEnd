using System.Collections.Generic;
using System.Threading.Tasks;
using GestaoOficina.Domain.Entities;

namespace GestaoOficina.Domain.Interfaces;

public interface IOrdemServicoRepository
{
    Task<IEnumerable<OrdemServico>> GetAllAsync();
    Task<(IEnumerable<OrdemServico> Items, int TotalCount)> GetPagedAsync(string? search, string? status, int page, int pageSize);
    Task<OrdemServico?> GetByIdAsync(int id);
    Task<IEnumerable<OrdemServico>> GetByClienteIdAsync(int clienteId);
    Task<OrdemServico> CreateAsync(OrdemServico ordemServico);
    Task<OrdemServico> UpdateAsync(OrdemServico ordemServico);
    Task<bool> DeleteAsync(int id);
}
