import { FormEvent, useEffect, useState } from "react";
import { Edit, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import {
  Cliente,
  clientesApi,
  Veiculo,
  VeiculoRequest,
  veiculosApi,
} from "../services/api";

const currentYear = new Date().getFullYear();

const emptyForm: VeiculoRequest = {
  placa: "",
  modelo: "",
  marca: "",
  cor: "",
  ano: currentYear,
  kmAtual: 0,
  clienteId: 0,
};

export function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<VeiculoRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [clientesResponse, veiculosResponse] = await Promise.all([
        clientesApi.list(),
        veiculosApi.listPaged({ search: searchTerm, page, pageSize: 10 }),
      ]);

      setClientes(clientesResponse);
      setVeiculos(veiculosResponse.items);
      setTotalCount(veiculosResponse.totalCount);
      setTotalPages(veiculosResponse.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [page, searchTerm]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editVeiculo(veiculo: Veiculo) {
    setEditingId(veiculo.id);
    setForm({
      placa: veiculo.placa,
      modelo: veiculo.modelo,
      marca: veiculo.marca,
      cor: veiculo.cor,
      ano: veiculo.ano,
      kmAtual: veiculo.kmAtual,
      clienteId: veiculo.clienteId,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await veiculosApi.update(editingId, form);
      } else {
        await veiculosApi.create(form);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar veiculo");
    } finally {
      setSaving(false);
    }
  }

  async function removeVeiculo(id: number) {
    const confirmed = window.confirm("Deseja excluir este veiculo?");
    if (!confirmed) return;

    setError("");

    try {
      await veiculosApi.remove(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir veiculo");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-primary">Veiculos</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre os veiculos vinculados aos clientes da API.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-primary">
            {editingId ? "Editar veiculo" : "Novo veiculo"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Cancelar edicao"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            required
            value={form.clienteId}
            onChange={(event) =>
              setForm({ ...form, clienteId: Number(event.target.value) })
            }
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-3"
          >
            <option value={0}>Selecione o cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} - {cliente.cpfCnpj}
              </option>
            ))}
          </select>
          <input
            required
            value={form.placa}
            onChange={(event) =>
              setForm({ ...form, placa: event.target.value.toUpperCase() })
            }
            placeholder="Placa"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            value={form.modelo}
            onChange={(event) =>
              setForm({ ...form, modelo: event.target.value })
            }
            placeholder="Modelo"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            value={form.marca}
            onChange={(event) =>
              setForm({ ...form, marca: event.target.value })
            }
            placeholder="Marca"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            value={form.cor}
            onChange={(event) => setForm({ ...form, cor: event.target.value })}
            placeholder="Cor"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            type="number"
            value={form.ano}
            onChange={(event) =>
              setForm({ ...form, ano: Number(event.target.value) })
            }
            placeholder="Ano"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            type="number"
            value={form.kmAtual}
            onChange={(event) =>
              setForm({ ...form, kmAtual: Number(event.target.value) })
            }
            placeholder="Km atual"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          disabled={saving || clientes.length === 0}
          className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          <Plus size={20} />
          {saving ? "Salvando..." : editingId ? "Salvar alteracoes" : "Cadastrar veiculo"}
        </button>
      </form>

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por placa, modelo, marca, cor ou cliente"
            className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground">Placa</th>
                <th className="text-left p-3 text-muted-foreground">Modelo</th>
                <th className="text-left p-3 text-muted-foreground">Marca</th>
                <th className="text-left p-3 text-muted-foreground">Ano</th>
                <th className="text-left p-3 text-muted-foreground">Km</th>
                <th className="text-left p-3 text-muted-foreground">Cliente</th>
                <th className="text-left p-3 text-muted-foreground">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={7}>
                    Carregando veiculos...
                  </td>
                </tr>
              ) : veiculos.length === 0 ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={7}>
                    Nenhum veiculo encontrado.
                  </td>
                </tr>
              ) : (
                veiculos.map((veiculo) => (
                  <tr
                    key={veiculo.id}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="p-3">{veiculo.placa}</td>
                    <td className="p-3">{veiculo.modelo}</td>
                    <td className="p-3">{veiculo.marca}</td>
                    <td className="p-3">{veiculo.ano}</td>
                    <td className="p-3">{veiculo.kmAtual.toLocaleString("pt-BR")}</td>
                    <td className="p-3">{veiculo.nomeCliente}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editVeiculo(veiculo)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={() => removeVeiculo(veiculo.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Mostrando {veiculos.length} de {totalCount} veiculos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              {page} / {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage((current) => current + 1)}
              disabled={totalPages === 0 || page >= totalPages}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              Proxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
