using System.Collections.Generic;
using System.Threading.Tasks;
using GestaoOficina.Domain.Entities;

namespace GestaoOficina.Domain.Interfaces;

public interface IClienteRepository
{
    Task<IEnumerable<Cliente>> GetAllAsync();
    Task<Cliente?> GetByIdAsync(int id);
    Task<IEnumerable<Cliente>> GetByNomeAsync(string nome);
    Task<Cliente?> GetByCpfCnpjAsync(string cpfCnpj);
    Task<Cliente> CreateAsync(Cliente cliente);
    Task<Cliente> UpdateAsync(Cliente cliente);
    Task<bool> DeleteAsync(int id);
}
