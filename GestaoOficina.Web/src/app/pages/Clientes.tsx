import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import {
  Cliente,
  ClienteRequest,
  clientesApi,
} from "../services/api";

const emptyForm: ClienteRequest = {
  nome: "",
  cpfCnpj: "",
  telefone: "",
  email: "",
  endereco: "",
};

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<ClienteRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredClientes = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return clientes;

    return clientes.filter((cliente) =>
      [
        cliente.nome,
        cliente.cpfCnpj,
        cliente.telefone,
        cliente.email,
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [clientes, searchTerm]);

  async function loadClientes() {
    setLoading(true);
    setError("");

    try {
      setClientes(await clientesApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editCliente(cliente: Cliente) {
    setEditingId(cliente.id);
    setForm({
      nome: cliente.nome,
      cpfCnpj: cliente.cpfCnpj,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await clientesApi.update(editingId, form);
      } else {
        await clientesApi.create(form);
      }

      resetForm();
      await loadClientes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar cliente");
    } finally {
      setSaving(false);
    }
  }

  async function removeCliente(id: number) {
    const confirmed = window.confirm("Deseja excluir este cliente?");
    if (!confirmed) return;

    setError("");

    try {
      await clientesApi.remove(id);
      await loadClientes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir cliente");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-primary">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre e consulte clientes salvos no banco da API.
          </p>
        </div>
        <button
          onClick={loadClientes}
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
            {editingId ? "Editar cliente" : "Novo cliente"}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            required
            value={form.nome}
            onChange={(event) => setForm({ ...form, nome: event.target.value })}
            placeholder="Nome"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            value={form.cpfCnpj}
            onChange={(event) =>
              setForm({ ...form, cpfCnpj: event.target.value })
            }
            placeholder="CPF/CNPJ"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            value={form.telefone}
            onChange={(event) =>
              setForm({ ...form, telefone: event.target.value })
            }
            placeholder="Telefone"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder="Email"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            value={form.endereco}
            onChange={(event) =>
              setForm({ ...form, endereco: event.target.value })
            }
            placeholder="Endereco"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
          />
        </div>

        <button
          disabled={saving}
          className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          <Plus size={20} />
          {saving ? "Salvando..." : editingId ? "Salvar alteracoes" : "Cadastrar cliente"}
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
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nome, CPF/CNPJ, telefone ou email"
            className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground">Nome</th>
                <th className="text-left p-3 text-muted-foreground">CPF/CNPJ</th>
                <th className="text-left p-3 text-muted-foreground">Telefone</th>
                <th className="text-left p-3 text-muted-foreground">Email</th>
                <th className="text-left p-3 text-muted-foreground">Veiculos</th>
                <th className="text-left p-3 text-muted-foreground">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={6}>
                    Carregando clientes...
                  </td>
                </tr>
              ) : filteredClientes.length === 0 ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={6}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="p-3">{cliente.nome}</td>
                    <td className="p-3">{cliente.cpfCnpj}</td>
                    <td className="p-3">{cliente.telefone}</td>
                    <td className="p-3">{cliente.email}</td>
                    <td className="p-3">{cliente.quantidadeVeiculos}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editCliente(cliente)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={() => removeCliente(cliente.id)}
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
      </div>
    </div>
  );
}
