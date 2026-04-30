using System.Collections.Generic;
using System.Threading.Tasks;
using GestaoOficina.Domain.Entities;

namespace GestaoOficina.Domain.Interfaces;

public interface IOrdemServicoRepository
{
    Task<IEnumerable<OrdemServico>> GetAllAsync();
    Task<OrdemServico?> GetByIdAsync(int id);
    Task<IEnumerable<OrdemServico>> GetByClienteIdAsync(int clienteId);
    Task<OrdemServico> CreateAsync(OrdemServico ordemServico);
    Task<OrdemServico> UpdateAsync(OrdemServico ordemServico);
    Task<bool> DeleteAsync(int id);
}
