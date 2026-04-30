import { useState } from "react";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const faturamentoMensal = [
  { mes: "Jan", valor: 38500 },
  { mes: "Fev", valor: 42300 },
  { mes: "Mar", valor: 39800 },
  { mes: "Abr", valor: 45230 },
];

const osPorMecanico = [
  { name: "Carlos", value: 45, color: "#F5821F" },
  { name: "Roberto", value: 32, color: "#1E3A5F" },
  { name: "José", value: 28, color: "#48bb78" },
];

const produtosMaisVendidos = [
  { produto: "Óleo 5W30", quantidade: 85, valor: 3825 },
  { produto: "Filtro de óleo", quantidade: 68, valor: 1904 },
  { produto: "Pastilha de freio", quantidade: 42, valor: 5040 },
  { produto: "Disco de freio", quantidade: 28, valor: 5040 },
  { produto: "Filtro de ar", quantidade: 56, valor: 1960 },
];

const servicosMaisRealizados = [
  { servico: "Troca de óleo", quantidade: 125, receita: 18750 },
  { servico: "Revisão completa", quantidade: 48, receita: 21600 },
  { servico: "Alinhamento", quantidade: 92, receita: 7360 },
  { servico: "Balanceamento", quantidade: 78, receita: 4680 },
  { servico: "Troca de pastilhas", quantidade: 35, receita: 11200 },
];

export function Relatorios() {
  const [selectedReport, setSelectedReport] = useState<
    "faturamento" | "os-mecanico" | "produtos" | "servicos"
  >("faturamento");

  const reports = [
    { id: "faturamento" as const, label: "Faturamento Mensal" },
    { id: "os-mecanico" as const, label: "OS por Mecânico" },
    { id: "produtos" as const, label: "Produtos Mais Vendidos" },
    { id: "servicos" as const, label: "Serviços Mais Realizados" },
  ];

  const exportPDF = () => {
    alert("Exportação em PDF em desenvolvimento");
  };

  const exportExcel = () => {
    alert("Exportação em Excel em desenvolvimento");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-primary">Relatórios</h1>

      <div className="flex gap-6">
        <aside className="w-64 bg-card p-4 rounded-lg border border-border shadow-sm h-fit">
          <h3 className="mb-4 text-primary">Tipos de Relatório</h3>
          <ul className="space-y-2">
            {reports.map((report) => (
              <li key={report.id}>
                <button
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedReport === report.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {report.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-primary">
              {reports.find((r) => r.id === selectedReport)?.label}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Exportar PDF
              </button>
              <button
                onClick={exportExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Exportar Excel
              </button>
            </div>
          </div>

          {selectedReport === "faturamento" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-accent/10 border border-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Faturamento Total
                  </p>
                  <p className="text-2xl text-accent">R$ 165.830,00</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Média Mensal
                  </p>
                  <p className="text-2xl text-blue-600">R$ 41.457,50</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Crescimento
                  </p>
                  <p className="text-2xl text-green-600">+13,5%</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={faturamentoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `R$ ${value}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="valor" fill="#F5821F" name="Faturamento" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedReport === "os-mecanico" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {osPorMecanico.map((mecanico) => (
                  <div
                    key={mecanico.name}
                    className="p-4 bg-muted rounded-lg border border-border"
                  >
                    <p className="text-sm text-muted-foreground mb-1">
                      {mecanico.name}
                    </p>
                    <p className="text-2xl text-primary">{mecanico.value} OS</p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={osPorMecanico}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {osPorMecanico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedReport === "produtos" && (
            <div className="space-y-6">
              <div className="p-4 bg-accent/10 border border-accent rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Receita Total com Produtos
                </p>
                <p className="text-2xl text-accent">R$ 17.769,00</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground">
                        Posição
                      </th>
                      <th className="text-left p-3 text-muted-foreground">
                        Produto
                      </th>
                      <th className="text-left p-3 text-muted-foreground">
                        Quantidade
                      </th>
                      <th className="text-left p-3 text-muted-foreground">
                        Receita
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosMaisVendidos.map((produto, index) => (
                      <tr
                        key={index}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="p-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-accent text-accent-foreground rounded-full">
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-3">{produto.produto}</td>
                        <td className="p-3">{produto.quantidade} unidades</td>
                        <td className="p-3 text-accent">
                          R$ {produto.valor.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === "servicos" && (
            <div className="space-y-6">
              <div className="p-4 bg-accent/10 border border-accent rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Receita Total com Serviços
                </p>
                <p className="text-2xl text-accent">R$ 63.590,00</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground">
                        Posição
                      </th>
                      <th className="text-left p-3 text-muted-foreground">
                        Serviço
                      </th>
                      <th className="text-left p-3 text-muted-foreground">
                        Quantidade
                      </th>
                      <th className="text-left p-3 text-muted-foreground">
                        Receita
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosMaisRealizados.map((servico, index) => (
                      <tr
                        key={index}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="p-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-accent text-accent-foreground rounded-full">
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-3">{servico.servico}</td>
                        <td className="p-3">{servico.quantidade} vezes</td>
                        <td className="p-3 text-accent">
                          R$ {servico.receita.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
