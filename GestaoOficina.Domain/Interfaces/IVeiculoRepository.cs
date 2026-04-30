using System.Collections.Generic;
using System.Threading.Tasks;
using GestaoOficina.Domain.Entities;

namespace GestaoOficina.Domain.Interfaces;

public interface IVeiculoRepository
{
    Task<IEnumerable<Veiculo>> GetAllAsync();
    Task<(IEnumerable<Veiculo> Items, int TotalCount)> GetPagedAsync(string? search, int page, int pageSize);
    Task<Veiculo?> GetByIdAsync(int id);
    Task<IEnumerable<Veiculo>> GetByPlacaAsync(string placa);
    Task<IEnumerable<Veiculo>> GetByClienteIdAsync(int clienteId);
    Task<Veiculo> CreateAsync(Veiculo veiculo);
    Task<Veiculo> UpdateAsync(Veiculo veiculo);
    Task<bool> DeleteAsync(int id);
}
