import { useState } from "react";
import { DollarSign, CheckCircle, X } from "lucide-react";

const contasAReceber = [
  {
    os: "OS-1234",
    cliente: "João Silva",
    valor: 850,
    vencimento: "2026-05-05",
    status: "pendente",
  },
  {
    os: "OS-1231",
    cliente: "Ana Oliveira",
    valor: 680,
    vencimento: "2026-05-08",
    status: "pendente",
  },
  {
    os: "OS-1229",
    cliente: "Fernanda Lima",
    valor: 1450,
    vencimento: "2026-05-12",
    status: "pendente",
  },
];

const contasRecebidas = [
  {
    os: "OS-1232",
    cliente: "Pedro Costa",
    valor: 450,
    vencimento: "2026-04-25",
    dataPagamento: "2026-04-24",
    status: "pago",
  },
  {
    os: "OS-1228",
    cliente: "Lucas Pereira",
    valor: 580,
    vencimento: "2026-04-20",
    dataPagamento: "2026-04-20",
    status: "pago",
  },
  {
    os: "OS-1227",
    cliente: "Roberto Alves",
    valor: 2100,
    vencimento: "2026-04-18",
    dataPagamento: "2026-04-15",
    status: "pago",
  },
];

const contasVencidas = [
  {
    os: "OS-1233",
    cliente: "Maria Santos",
    valor: 1250,
    vencimento: "2026-04-15",
    diasAtraso: 14,
    status: "vencido",
  },
  {
    os: "OS-1230",
    cliente: "Carlos Mendes",
    valor: 920,
    vencimento: "2026-04-10",
    diasAtraso: 19,
    status: "vencido",
  },
];

export function Financeiro() {
  const [activeTab, setActiveTab] = useState<"receber" | "recebidas" | "vencidas">(
    "receber"
  );
  const [showBaixaModal, setShowBaixaModal] = useState(false);
  const [selectedConta, setSelectedConta] = useState<any>(null);

  const totalReceber = contasAReceber.reduce((acc, c) => acc + c.valor, 0);
  const totalVencido = contasVencidas.reduce((acc, c) => acc + c.valor, 0);
  const totalRecebido = contasRecebidas.reduce((acc, c) => acc + c.valor, 0);

  const openBaixaModal = (conta: any) => {
    setSelectedConta(conta);
    setShowBaixaModal(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-primary">Financeiro - Contas a Receber</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground">Total a Receber</h3>
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <p className="text-3xl text-primary">
            R$ {totalReceber.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {contasAReceber.length} contas pendentes
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground">Total Vencido</h3>
            <DollarSign className="text-destructive" size={24} />
          </div>
          <p className="text-3xl text-destructive">
            R$ {totalVencido.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {contasVencidas.length} contas vencidas
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground">Recebido no Mês</h3>
            <DollarSign className="text-green-600" size={24} />
          </div>
          <p className="text-3xl text-green-600">
            R$ {totalRecebido.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {contasRecebidas.length} pagamentos
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("receber")}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === "receber"
                ? "bg-accent text-accent-foreground border-b-2 border-accent"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            A Receber
          </button>
          <button
            onClick={() => setActiveTab("recebidas")}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === "recebidas"
                ? "bg-accent text-accent-foreground border-b-2 border-accent"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Recebidas
          </button>
          <button
            onClick={() => setActiveTab("vencidas")}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === "vencidas"
                ? "bg-accent text-accent-foreground border-b-2 border-accent"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Vencidas
          </button>
        </div>

        <div className="p-6">
          {activeTab === "receber" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-muted-foreground">OS</th>
                    <th className="text-left p-3 text-muted-foreground">
                      Cliente
                    </th>
                    <th className="text-left p-3 text-muted-foreground">Valor</th>
                    <th className="text-left p-3 text-muted-foreground">
                      Vencimento
                    </th>
                    <th className="text-left p-3 text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contasAReceber.map((conta) => (
                    <tr
                      key={conta.os}
                      className="border-b border-border hover:bg-muted transition-colors"
                    >
                      <td className="p-3">{conta.os}</td>
                      <td className="p-3">{conta.cliente}</td>
                      <td className="p-3">R$ {conta.valor.toFixed(2)}</td>
                      <td className="p-3">
                        {new Date(conta.vencimento).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                          Pendente
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => openBaixaModal(conta)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Baixar Pagamento
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "recebidas" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-muted-foreground">OS</th>
                    <th className="text-left p-3 text-muted-foreground">
                      Cliente
                    </th>
                    <th className="text-left p-3 text-muted-foreground">Valor</th>
                    <th className="text-left p-3 text-muted-foreground">
                      Vencimento
                    </th>
                    <th className="text-left p-3 text-muted-foreground">
                      Pagamento
                    </th>
                    <th className="text-left p-3 text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contasRecebidas.map((conta) => (
                    <tr
                      key={conta.os}
                      className="border-b border-border hover:bg-muted transition-colors"
                    >
                      <td className="p-3">{conta.os}</td>
                      <td className="p-3">{conta.cliente}</td>
                      <td className="p-3">R$ {conta.valor.toFixed(2)}</td>
                      <td className="p-3">
                        {new Date(conta.vencimento).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3">
                        {new Date(conta.dataPagamento).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="p-3">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                          Pago
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "vencidas" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-muted-foreground">OS</th>
                    <th className="text-left p-3 text-muted-foreground">
                      Cliente
                    </th>
                    <th className="text-left p-3 text-muted-foreground">Valor</th>
                    <th className="text-left p-3 text-muted-foreground">
                      Vencimento
                    </th>
                    <th className="text-left p-3 text-muted-foreground">
                      Dias em Atraso
                    </th>
                    <th className="text-left p-3 text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contasVencidas.map((conta) => (
                    <tr
                      key={conta.os}
                      className="border-b border-border hover:bg-muted transition-colors bg-red-50"
                    >
                      <td className="p-3">{conta.os}</td>
                      <td className="p-3">{conta.cliente}</td>
                      <td className="p-3">R$ {conta.valor.toFixed(2)}</td>
                      <td className="p-3">
                        {new Date(conta.vencimento).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3">
                        <span className="text-destructive font-semibold">
                          {conta.diasAtraso} dias
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs">
                          Vencido
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => openBaixaModal(conta)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Baixar Pagamento
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showBaixaModal && selectedConta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-primary">Baixar Pagamento</h3>
              <button
                onClick={() => setShowBaixaModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">OS</p>
              <p className="mb-2">{selectedConta.os}</p>
              <p className="text-sm text-muted-foreground mb-1">Cliente</p>
              <p className="mb-2">{selectedConta.cliente}</p>
              <p className="text-sm text-muted-foreground mb-1">Valor</p>
              <p className="text-xl text-accent">
                R$ {selectedConta.valor.toFixed(2)}
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-muted-foreground">
                  Data do Pagamento
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">
                  Forma de Pagamento
                </label>
                <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="debito">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">
                  Observações
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Observações sobre o pagamento..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBaixaModal(false)}
                  className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Confirmar Baixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
