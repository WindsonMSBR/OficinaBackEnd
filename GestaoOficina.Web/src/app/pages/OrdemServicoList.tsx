import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Edit, Eye, Filter, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { OrdemServico, ordensServicoApi } from "../services/api";

const statusClasses: Record<string, string> = {
  Aberta: "bg-blue-500",
  "Em andamento": "bg-blue-500",
  "Aguardando pecas": "bg-yellow-500",
  "Aguardando aprovacao": "bg-orange-500",
  Concluida: "bg-green-500",
  Cancelada: "bg-red-500",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function OrdemServicoList() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrdens() {
    setLoading(true);
    setError("");

    try {
      const response = await ordensServicoApi.listPaged({
        search: searchTerm,
        status: statusFilter,
        page,
        pageSize: 10,
      });

      setOrdens(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar ordens");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrdens();
  }, [page, searchTerm, statusFilter]);

  async function removeOrdem(id: number) {
    const confirmed = window.confirm("Deseja excluir esta ordem de servico?");
    if (!confirmed) return;

    setError("");

    try {
      await ordensServicoApi.remove(id);
      await loadOrdens();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir ordem");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-primary">Ordens de Servico</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe as ordens salvas pela API.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadOrdens}
            className="bg-secondary text-secondary-foreground px-4 py-3 rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
          <Link
            to="/os/nova"
            className="bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nova OS
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por numero, cliente, placa..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <Filter size={20} />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div>
              <label className="block mb-2 text-sm text-muted-foreground">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">Todos</option>
                <option value="Aberta">Aberta</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Aguardando pecas">Aguardando pecas</option>
                <option value="Aguardando aprovacao">Aguardando aprovacao</option>
                <option value="Concluida">Concluida</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground">Numero</th>
                <th className="text-left p-3 text-muted-foreground">Cliente</th>
                <th className="text-left p-3 text-muted-foreground">Veiculo</th>
                <th className="text-left p-3 text-muted-foreground">Mecanico</th>
                <th className="text-left p-3 text-muted-foreground">Valor</th>
                <th className="text-left p-3 text-muted-foreground">Status</th>
                <th className="text-left p-3 text-muted-foreground">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={7}>
                    Carregando ordens de servico...
                  </td>
                </tr>
              ) : ordens.length === 0 ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={7}>
                    Nenhuma ordem encontrada.
                  </td>
                </tr>
              ) : (
                ordens.map((ordem) => (
                  <tr
                    key={ordem.id}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="p-3">{ordem.numero}</td>
                    <td className="p-3">{ordem.nomeCliente}</td>
                    <td className="p-3">
                      {ordem.veiculoDescricao} - {ordem.placa}
                    </td>
                    <td className="p-3">{ordem.mecanicoResponsavel}</td>
                    <td className="p-3">{formatCurrency(ordem.valorTotal)}</td>
                    <td className="p-3">
                      <span
                        className={`${statusClasses[ordem.status] ?? "bg-slate-500"} text-white px-3 py-1 rounded-full text-xs`}
                      >
                        {ordem.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={16} className="text-primary" />
                        </button>
                        <button
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={() => removeOrdem(ordem.id)}
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
            Mostrando {ordens.length} de {totalCount} resultados
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
