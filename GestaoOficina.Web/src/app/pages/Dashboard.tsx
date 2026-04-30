import { useEffect, useState } from "react";
import {
  Calendar,
  Car,
  Edit,
  Eye,
  FileText,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Cliente,
  clientesApi,
  OrdemServico,
  ordensServicoApi,
  Veiculo,
  veiculosApi,
} from "../services/api";

const faturamentoData = [
  { dia: "Seg", valor: 0 },
  { dia: "Ter", valor: 0 },
  { dia: "Qua", valor: 0 },
  { dia: "Qui", valor: 0 },
  { dia: "Sex", valor: 0 },
  { dia: "Sab", valor: 0 },
  { dia: "Dom", valor: 0 },
];

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

export function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [clientesResponse, veiculosResponse, ordensResponse] =
          await Promise.all([
            clientesApi.list(),
            veiculosApi.list(),
            ordensServicoApi.list(),
          ]);

        setClientes(clientesResponse);
        setVeiculos(veiculosResponse);
        setOrdens(ordensResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dashboard");
      }
    }

    loadDashboard();
  }, []);

  const ordensAbertas = ordens.filter(
    (ordem) => ordem.status !== "Concluida" && ordem.status !== "Cancelada"
  );
  const ordensConcluidas = ordens.filter((ordem) => ordem.status === "Concluida");
  const faturamentoRegistrado = ordens.reduce(
    (total, ordem) => total + ordem.valorTotal,
    0
  );
  const ultimasOS = ordens.slice(0, 5);

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground">OS Abertas</h3>
            <FileText className="text-primary" size={24} />
          </div>
          <p className="text-3xl text-primary">{ordensAbertas.length}</p>
          <p className="text-sm text-muted-foreground mt-1">ordens em trabalho</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground">Clientes</h3>
            <Users className="text-green-600" size={24} />
          </div>
          <p className="text-3xl text-primary">{clientes.length}</p>
          <p className="text-sm text-green-600 mt-1">cadastros no banco</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground">Veiculos</h3>
            <Car className="text-destructive" size={24} />
          </div>
          <p className="text-3xl text-primary">{veiculos.length}</p>
          <p className="text-sm text-destructive mt-1">vinculados a clientes</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground">Faturamento</h3>
            <Calendar className="text-accent" size={24} />
          </div>
          <p className="text-3xl text-primary">{formatCurrency(faturamentoRegistrado)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {ordensConcluidas.length} OS concluidas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-lg border border-border shadow-sm">
          <h3 className="mb-4 text-primary">Faturamento da Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={faturamentoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="valor" fill="#F5821F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <h3 className="mb-4 text-primary">Resumo Operacional</h3>
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">OS abertas</p>
              <p className="text-xl text-primary">{ordensAbertas.length}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">OS concluidas</p>
              <p className="text-xl text-primary">{ordensConcluidas.length}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Ticket medio</p>
              <p className="text-xl text-primary">
                {formatCurrency(ordens.length ? faturamentoRegistrado / ordens.length : 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <h3 className="mb-4 text-primary">Ultimas Ordens de Servico</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground">Numero</th>
                <th className="text-left p-3 text-muted-foreground">Cliente</th>
                <th className="text-left p-3 text-muted-foreground">Veiculo</th>
                <th className="text-left p-3 text-muted-foreground">Valor</th>
                <th className="text-left p-3 text-muted-foreground">Status</th>
                <th className="text-left p-3 text-muted-foreground">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {ultimasOS.length === 0 ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={6}>
                    Nenhuma ordem de servico cadastrada.
                  </td>
                </tr>
              ) : (
                ultimasOS.map((os) => (
                  <tr
                    key={os.id}
                    className="border-b border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    <td className="p-3">{os.numero}</td>
                    <td className="p-3">{os.nomeCliente}</td>
                    <td className="p-3">
                      {os.veiculoDescricao} {os.placa}
                    </td>
                    <td className="p-3">{formatCurrency(os.valorTotal)}</td>
                    <td className="p-3">
                      <span
                        className={`${statusClasses[os.status] ?? "bg-slate-500"} text-white px-3 py-1 rounded-full text-xs`}
                      >
                        {os.status}
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
